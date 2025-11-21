import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createMessage, parseJSONResponse } from "@/lib/ai/claude-client";
import {
  createEssayGenerationPrompt,
  ESSAY_GENERATION_SYSTEM,
} from "@/lib/ai/prompts";
import type {
  StudentProfile,
  Scholarship,
  ScholarshipAnalysis,
  EssayPrompt as EssayPromptType,
} from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const {
      student_id,
      scholarship_id,
      essay_prompt_index = 0,
    } = await request.json();

    if (!student_id || !scholarship_id) {
      return NextResponse.json(
        { error: "student_id and scholarship_id are required" },
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

    // Fetch scholarship with analysis
    const { data: scholarship, error: scholarshipError } = await supabase
      .from("scholarships")
      .select(
        `
        *,
        scholarship_analysis (*)
      `
      )
      .eq("id", scholarship_id)
      .single();

    if (scholarshipError || !scholarship) {
      return NextResponse.json(
        { error: "Scholarship not found" },
        { status: 404 }
      );
    }

    const analysis = scholarship.scholarship_analysis?.[0];
    if (!analysis) {
      return NextResponse.json(
        {
          error:
            "Scholarship has not been analyzed yet. Please analyze it first.",
        },
        { status: 400 }
      );
    }

    // Get the essay prompt
    const essayPrompts = scholarship.essay_prompts as EssayPromptType[];
    if (!essayPrompts || essayPrompts.length === 0) {
      return NextResponse.json(
        { error: "No essay prompts available for this scholarship" },
        { status: 400 }
      );
    }

    const selectedPrompt = essayPrompts[essay_prompt_index];
    if (!selectedPrompt) {
      return NextResponse.json(
        { error: "Invalid essay_prompt_index" },
        { status: 400 }
      );
    }

    // Format student profile
    const studentProfile = formatStudentProfile(student as StudentProfile);

    // Generate 3 different essay drafts with different angles
    const angles: Array<"primary_strength" | "personal_story" | "balanced"> = [
      "primary_strength",
      "personal_story",
      "balanced",
    ];

    const drafts = [];
    for (let i = 0; i < angles.length; i++) {
      const angle = angles[i];

      try {
        const prompt = createEssayGenerationPrompt({
          studentProfile,
          scholarship: scholarship as Scholarship,
          essayPrompt: selectedPrompt.question,
          wordLimit: selectedPrompt.word_limit,
          scholarshipAnalysis: analysis as ScholarshipAnalysis,
          angle,
        });

        const response = await createMessage({
          system: ESSAY_GENERATION_SYSTEM,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 3000,
        });

        const draftData = parseJSONResponse<{
          content: string;
          word_count: number;
          reasoning: string;
          highlighted_experiences: string[];
        }>(response);

        drafts.push({
          version: i + 1,
          angle: getAngleLabel(angle),
          content: draftData.content,
          reasoning: draftData.reasoning,
          highlighted_experiences: draftData.highlighted_experiences,
          word_count: draftData.word_count,
        });
      } catch (error) {
        console.error(`Error generating draft with angle ${angle}:`, error);
        // Continue with other drafts
      }
    }

    if (drafts.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate any essay drafts" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      drafts,
      scholarship_analysis: analysis,
      essay_prompt: selectedPrompt,
    });
  } catch (error) {
    console.error("Error generating essays:", error);
    return NextResponse.json(
      { error: "Failed to generate essays" },
      { status: 500 }
    );
  }
}

function getAngleLabel(
  angle: "primary_strength" | "personal_story" | "balanced"
): string {
  const labels = {
    primary_strength: "Primary Strength Focus",
    personal_story: "Personal Story Lead",
    balanced: "Balanced Approach",
  };
  return labels[angle];
}

function formatStudentProfile(student: StudentProfile): string {
  const sections = [];

  sections.push(`**Name:** ${student.full_name}`);
  if (student.grade_level)
    sections.push(`**Grade Level:** ${student.grade_level}`);
  if (student.gpa) sections.push(`**GPA:** ${student.gpa}`);

  // Test Scores
  if (student.test_scores) {
    sections.push(`\n**Test Scores:**`);
    if (student.test_scores.sat)
      sections.push(`- SAT: ${student.test_scores.sat}`);
    if (student.test_scores.act)
      sections.push(`- ACT: ${student.test_scores.act}`);
    if (
      student.test_scores.ap_scores &&
      student.test_scores.ap_scores.length > 0
    ) {
      sections.push(
        `- AP: ${student.test_scores.ap_scores
          .map((s) => `${s.subject} (${s.score})`)
          .join(", ")}`
      );
    }
  }

  // Academic Achievements
  if (
    student.academic_achievements &&
    student.academic_achievements.length > 0
  ) {
    sections.push(`\n**Academic Achievements:**`);
    student.academic_achievements.forEach((achievement) => {
      sections.push(`- ${achievement}`);
    });
  }

  // Extracurriculars
  if (student.extracurriculars && student.extracurriculars.length > 0) {
    sections.push(`\n**Extracurricular Activities:**`);
    student.extracurriculars.forEach((activity) => {
      sections.push(
        `**${activity.name}** (${activity.role}, ${activity.duration})`
      );
      sections.push(`  ${activity.description}`);
      if (activity.impact) sections.push(`  Impact: ${activity.impact}`);
    });
  }

  // Leadership
  if (student.leadership_roles && student.leadership_roles.length > 0) {
    sections.push(`\n**Leadership Roles:**`);
    student.leadership_roles.forEach((role) => {
      sections.push(
        `**${role.position}** at ${role.organization} (${role.duration})`
      );
      sections.push(`  Responsibilities: ${role.responsibilities}`);
      if (role.achievements)
        sections.push(`  Achievements: ${role.achievements}`);
    });
  }

  // Awards & Honors
  if (student.awards_honors && student.awards_honors.length > 0) {
    sections.push(`\n**Awards & Honors:**`);
    student.awards_honors.forEach((award) => {
      sections.push(`- ${award}`);
    });
  }

  // Volunteer Work
  if (student.volunteer_work && student.volunteer_work.length > 0) {
    sections.push(`\n**Volunteer & Community Service:**`);
    student.volunteer_work.forEach((work) => {
      sections.push(
        `**${work.organization}** (${work.role}, ${work.hours} hours)`
      );
      sections.push(`  ${work.story}`);
      if (work.impact) sections.push(`  Impact: ${work.impact}`);
    });
  }

  if (student.community_impact) {
    sections.push(`\n**Community Impact:** ${student.community_impact}`);
  }

  // Projects
  if (student.projects && student.projects.length > 0) {
    sections.push(`\n**Projects:**`);
    student.projects.forEach((project) => {
      sections.push(`**${project.title}**`);
      sections.push(`  ${project.description}`);
      if (project.technologies && project.technologies.length > 0) {
        sections.push(`  Technologies: ${project.technologies.join(", ")}`);
      }
      sections.push(`  Outcomes: ${project.outcomes}`);
    });
  }

  // Personal Story
  if (student.background_story) {
    sections.push(`\n**Background Story:**`);
    sections.push(student.background_story);
  }

  if (student.challenges_overcome) {
    sections.push(`\n**Challenges Overcome:**`);
    sections.push(student.challenges_overcome);
  }

  if (student.future_goals) {
    sections.push(`\n**Future Goals:**`);
    sections.push(student.future_goals);
  }

  if (student.personal_values && student.personal_values.length > 0) {
    sections.push(
      `\n**Personal Values:** ${student.personal_values.join(", ")}`
    );
  }

  return sections.join("\n");
}
