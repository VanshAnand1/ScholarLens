import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createMessage, parseJSONResponse } from "@/lib/ai/claude-client";
import { createMatchingPrompt, MATCHING_SYSTEM } from "@/lib/ai/prompts";
import type { StudentProfile, MatchBreakdown } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { student_id, limit = 10 } = await request.json();

    if (!student_id) {
      return NextResponse.json(
        { error: "student_id is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch student profile
    const { data: student, error: studentError } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("id", student_id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    // Fetch all scholarships with their analysis
    const { data: scholarships, error: scholarshipsError } = await supabase
      .from("scholarships")
      .select(
        `
        *,
        scholarship_analysis (*)
      `
      )
      .limit(limit);

    if (scholarshipsError) {
      return NextResponse.json(
        { error: "Failed to fetch scholarships" },
        { status: 500 }
      );
    }

    // Filter scholarships that have analysis
    const scholarshipsWithAnalysis =
      scholarships?.filter(
        (s) => s.scholarship_analysis && s.scholarship_analysis.length > 0
      ) || [];

    // Prepare student data summary for Claude
    const studentData = formatStudentData(student as StudentProfile);

    // Calculate matches for each scholarship
    const matches = [];
    for (const scholarship of scholarshipsWithAnalysis) {
      const analysis = scholarship.scholarship_analysis[0];

      try {
        const prompt = createMatchingPrompt({
          studentData,
          scholarshipTitle: scholarship.title,
          priorityWeights: analysis.priority_weights,
          personalityProfile: analysis.personality_profile,
        });

        const response = await createMessage({
          system: MATCHING_SYSTEM,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          max_tokens: 1500,
        });

        const matchData = parseJSONResponse<{
          match_score: number;
          match_breakdown: MatchBreakdown;
          match_explanation: string;
          aligned_experiences: string[];
          gaps: string[];
          recommendations: string[];
        }>(response);

        matches.push({
          scholarship: {
            id: scholarship.id,
            title: scholarship.title,
            organization: scholarship.organization,
            amount: scholarship.amount,
            deadline: scholarship.deadline,
            tags: scholarship.tags,
          },
          analysis,
          match_score: matchData.match_score,
          match_breakdown: matchData.match_breakdown,
          match_explanation: matchData.match_explanation,
          aligned_experiences: matchData.aligned_experiences,
          gaps: matchData.gaps,
          recommendations: matchData.recommendations,
        });
      } catch (error) {
        console.error(`Error matching scholarship ${scholarship.id}:`, error);
        // Continue with other scholarships
      }
    }

    // Sort by match score descending
    matches.sort((a, b) => b.match_score - a.match_score);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Error matching scholarships:", error);
    return NextResponse.json(
      { error: "Failed to match scholarships" },
      { status: 500 }
    );
  }
}

/**
 * Format student profile into a concise text summary for Claude
 */
function formatStudentData(student: StudentProfile): string {
  const sections = [];

  // Academic
  sections.push(`**Academic Performance:**`);
  if (student.gpa) sections.push(`- GPA: ${student.gpa}`);
  if (student.grade_level)
    sections.push(`- Grade Level: ${student.grade_level}`);
  if (student.test_scores) {
    if (student.test_scores.sat)
      sections.push(`- SAT: ${student.test_scores.sat}`);
    if (student.test_scores.act)
      sections.push(`- ACT: ${student.test_scores.act}`);
  }
  if (student.academic_achievements?.length) {
    sections.push(
      `- Achievements: ${student.academic_achievements.join(", ")}`
    );
  }

  // Extracurriculars
  if (student.extracurriculars?.length) {
    sections.push(`\n**Extracurricular Activities:**`);
    student.extracurriculars.forEach((activity) => {
      sections.push(
        `- ${activity.name} (${activity.role}, ${activity.duration}): ${activity.description}`
      );
    });
  }

  // Leadership
  if (student.leadership_roles?.length) {
    sections.push(`\n**Leadership Experience:**`);
    student.leadership_roles.forEach((role) => {
      sections.push(
        `- ${role.position} at ${role.organization}: ${role.achievements}`
      );
    });
  }

  // Community Service
  if (student.volunteer_work?.length) {
    sections.push(`\n**Volunteer & Community Service:**`);
    student.volunteer_work.forEach((work) => {
      sections.push(
        `- ${work.organization} (${work.hours} hours): ${work.impact}`
      );
    });
  }

  // Projects
  if (student.projects?.length) {
    sections.push(`\n**Projects & Innovation:**`);
    student.projects.forEach((project) => {
      sections.push(`- ${project.title}: ${project.description}`);
    });
  }

  // Personal Story
  if (
    student.background_story ||
    student.challenges_overcome ||
    student.future_goals
  ) {
    sections.push(`\n**Personal Background:**`);
    if (student.background_story)
      sections.push(`Background: ${student.background_story}`);
    if (student.challenges_overcome)
      sections.push(`Challenges: ${student.challenges_overcome}`);
    if (student.future_goals) sections.push(`Goals: ${student.future_goals}`);
  }

  return sections.join("\n");
}
