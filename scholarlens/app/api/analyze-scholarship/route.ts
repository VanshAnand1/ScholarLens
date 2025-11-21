import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createMessage, parseJSONResponse } from "@/lib/ai/claude-client";
import {
  createScholarshipAnalysisPrompt,
  SCHOLARSHIP_ANALYSIS_SYSTEM,
} from "@/lib/ai/prompts";
import type {
  Scholarship,
  PersonalityProfile,
  PriorityWeights,
} from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { scholarship_id } = await request.json();

    if (!scholarship_id) {
      return NextResponse.json(
        { error: "scholarship_id is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if analysis already exists in cache
    const { data: existingAnalysis } = await supabase
      .from("scholarship_analysis")
      .select("*")
      .eq("scholarship_id", scholarship_id)
      .single();

    if (existingAnalysis) {
      return NextResponse.json({
        analysis: existingAnalysis,
        cached: true,
      });
    }

    // Fetch scholarship details
    const { data: scholarship, error: scholarshipError } = await supabase
      .from("scholarships")
      .select("*")
      .eq("id", scholarship_id)
      .single();

    if (scholarshipError || !scholarship) {
      return NextResponse.json(
        { error: "Scholarship not found" },
        { status: 404 }
      );
    }

    // Generate analysis using Claude
    const prompt = createScholarshipAnalysisPrompt(scholarship as Scholarship);

    const response = await createMessage({
      system: SCHOLARSHIP_ANALYSIS_SYSTEM,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const analysisData = parseJSONResponse<{
      personality_profile: PersonalityProfile;
      priority_weights: PriorityWeights;
      hidden_priorities: string[];
      success_patterns: string[];
      messaging_strategy: string;
    }>(response);

    // Store analysis in database
    const { data: newAnalysis, error: insertError } = await supabase
      .from("scholarship_analysis")
      .insert({
        scholarship_id,
        personality_profile: analysisData.personality_profile,
        priority_weights: analysisData.priority_weights,
        hidden_priorities: analysisData.hidden_priorities,
        success_patterns: analysisData.success_patterns,
        messaging_strategy: analysisData.messaging_strategy,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error storing analysis:", insertError);
      // Return the analysis anyway, just not cached
      return NextResponse.json({
        analysis: {
          scholarship_id,
          ...analysisData,
          analyzed_at: new Date().toISOString(),
        },
        cached: false,
      });
    }

    return NextResponse.json({
      analysis: newAnalysis,
      cached: false,
    });
  } catch (error) {
    console.error("Error analyzing scholarship:", error);
    return NextResponse.json(
      { error: "Failed to analyze scholarship" },
      { status: 500 }
    );
  }
}
