import type {
  Scholarship,
  PersonalityProfile,
  ScholarshipAnalysis,
} from "../types";

/**
 * System prompt for scholarship analysis
 */
export const SCHOLARSHIP_ANALYSIS_SYSTEM = `You are an expert at analyzing scholarship programs to identify their core values, hidden priorities, and success patterns. Your goal is to create a comprehensive "personality profile" for each scholarship that will help students understand what the scholarship truly values and how to best position their applications.`;

/**
 * Prompt for analyzing a scholarship and extracting patterns
 */
export function createScholarshipAnalysisPrompt(
  scholarship: Scholarship
): string {
  const winnerStoriesSection =
    scholarship.winner_stories && scholarship.winner_stories.length > 0
      ? `\n\nPast Winner Stories:\n${scholarship.winner_stories
          .map((story, i) => `\nWinner ${i + 1}:\n${story}`)
          .join("\n")}`
      : "";

  return `Analyze the following scholarship to extract deep insights about what it truly values:

**Scholarship Title:** ${scholarship.title}
**Organization:** ${scholarship.organization}

**Description:**
${scholarship.description}

**Stated Criteria:**
${scholarship.criteria}

**Requirements:**
${JSON.stringify(scholarship.requirements, null, 2)}

**Tags:** ${scholarship.tags.join(", ")}
${winnerStoriesSection}

Based on this information, provide a comprehensive analysis in the following JSON format:

\`\`\`json
{
  "personality_profile": {
    "type": "A concise label for this scholarship's personality (e.g., 'Merit-Driven Academic', 'Community Impact Champion', 'Innovation Pioneer')",
    "traits": ["Key personality traits this scholarship embodies"],
    "values": ["Core values the scholarship prioritizes"],
    "tone": "The tone/voice that would resonate (e.g., 'formal and academic', 'passionate and personal', 'innovative and forward-thinking')"
  },
  "priority_weights": {
    "academic": 0.0,
    "leadership": 0.0,
    "service": 0.0,
    "innovation": 0.0,
    "personal_story": 0.0,
    "extracurricular": 0.0
  },
  "hidden_priorities": [
    "Implicit values or priorities not explicitly stated but evident from language and context"
  ],
  "success_patterns": [
    "Patterns identified from winner stories about what makes successful applications"
  ],
  "messaging_strategy": "A comprehensive strategy for how students should frame their applications, including what to emphasize, what tone to use, and what stories to tell"
}
\`\`\`

**Instructions:**
1. The priority_weights should sum to 1.0 (100%) and reflect what this specific scholarship values most
2. Look beyond stated criteria to identify hidden priorities in the language used
3. If winner stories are provided, extract concrete patterns about what they emphasized
4. Provide actionable messaging strategy that goes beyond generic advice
5. Be specific and insightful - avoid generic analysis

Respond with ONLY the JSON, no additional text.`;
}

/**
 * System prompt for student-scholarship matching
 */
export const MATCHING_SYSTEM = `You are an expert at evaluating student-scholarship fit. You analyze student profiles against scholarship priorities to calculate match scores and provide detailed explanations of alignment.`;

/**
 * Prompt for calculating match score between student and scholarship
 */
export function createMatchingPrompt(params: {
  studentData: string;
  scholarshipTitle: string;
  priorityWeights: Record<string, number>;
  personalityProfile: PersonalityProfile;
}): string {
  return `Evaluate how well this student matches the scholarship based on the scholarship's adaptive priority weights.

**Scholarship:** ${params.scholarshipTitle}

**Scholarship Personality:**
${JSON.stringify(params.personalityProfile, null, 2)}

**Priority Weights (how much scholarship values each area):**
${JSON.stringify(params.priorityWeights, null, 2)}

**Student Profile:**
${params.studentData}

Calculate a match score (0-100) for each priority area and provide an overall assessment.

Respond in this JSON format:

\`\`\`json
{
  "match_score": 0.0,
  "match_breakdown": {
    "academic": 0.0,
    "leadership": 0.0,
    "service": 0.0,
    "innovation": 0.0,
    "personal_story": 0.0,
    "extracurricular": 0.0
  },
  "match_explanation": "A detailed explanation of why this is a good/moderate/poor match, citing specific student experiences",
  "aligned_experiences": [
    "Specific student experiences or achievements that align well with scholarship values"
  ],
  "gaps": [
    "Areas where student is weaker relative to what scholarship values"
  ],
  "recommendations": [
    "What aspects of their profile to emphasize in the application"
  ]
}
\`\`\`

**Scoring Guidelines:**
- Each breakdown score is 0-100 representing how strong the student is in that area
- Overall match_score is a weighted average using the priority_weights
- Be honest about gaps but also highlight strengths
- Align your analysis with the scholarship's personality

Respond with ONLY the JSON, no additional text.`;
}

/**
 * System prompt for essay generation
 */
export const ESSAY_GENERATION_SYSTEM = `You are an expert scholarship essay writer who helps students craft compelling, authentic applications. You understand how to tailor messaging to different scholarship personalities while maintaining the student's genuine voice. You know how to strategically emphasize certain experiences over others based on what each scholarship values.`;

/**
 * Prompt for generating essay drafts with different angles
 */
export function createEssayGenerationPrompt(params: {
  studentProfile: string;
  scholarship: Scholarship;
  essayPrompt: string;
  wordLimit: number;
  scholarshipAnalysis: ScholarshipAnalysis;
  angle: "primary_strength" | "personal_story" | "balanced";
}): string {
  const angleDescriptions = {
    primary_strength:
      "Lead with and emphasize the student's strengths that align most strongly with the scholarship's highest-weighted priorities",
    personal_story:
      "Lead with the student's personal narrative, challenges overcome, and authentic journey, connecting it to scholarship values",
    balanced:
      "Balance multiple aspects of the student's profile, showing well-roundedness while still aligning with scholarship priorities",
  };

  return `Generate a scholarship essay that strategically positions this student for the specific scholarship.

**Scholarship:** ${params.scholarship.title}
**Organization:** ${params.scholarship.organization}

**Scholarship Analysis:**
${JSON.stringify(params.scholarshipAnalysis, null, 2)}

**Essay Prompt:**
${params.essayPrompt}

**Word Limit:** ${params.wordLimit} words

**Student Profile:**
${params.studentProfile}

**Essay Angle:** ${angleDescriptions[params.angle]}

**Requirements:**
1. Stay within ${params.wordLimit} words (strict limit)
2. Use authentic student voice - sound like a real high school/college student
3. Strategically emphasize experiences that align with scholarship's priority_weights
4. Mirror success_patterns from the scholarship analysis
5. Match the tone from the personality_profile
6. Be specific with details and examples, not generic
7. Follow the angle description to determine what to emphasize
8. Create a compelling narrative arc

Respond in this JSON format:

\`\`\`json
{
  "content": "The full essay text here",
  "word_count": 0,
  "reasoning": "Detailed explanation of your strategic choices: why you led with certain experiences, what you emphasized vs de-emphasized, how you matched the scholarship personality, which success patterns you incorporated",
  "highlighted_experiences": [
    "Specific student experiences you chose to feature prominently and why"
  ]
}
\`\`\`

Write an excellent essay that would genuinely improve this student's chances of winning this specific scholarship. Be strategic and purposeful in every choice.

Respond with ONLY the JSON, no additional text.`;
}

/**
 * Few-shot examples for scholarship analysis (for improved prompt engineering)
 */
export const SCHOLARSHIP_ANALYSIS_EXAMPLES = `
Example 1:

Input: National Merit Scholarship - Focused on academic excellence, standardized test scores, GPA requirements

Output:
{
  "personality_profile": {
    "type": "Merit-Driven Academic Excellence",
    "traits": ["rigorous", "achievement-oriented", "intellectually focused"],
    "values": ["academic achievement", "intellectual curiosity", "measurable excellence"],
    "tone": "formal and academic"
  },
  "priority_weights": {
    "academic": 0.55,
    "leadership": 0.10,
    "service": 0.05,
    "innovation": 0.15,
    "personal_story": 0.05,
    "extracurricular": 0.10
  },
  "hidden_priorities": [
    "Sustained academic performance over time, not just one year",
    "Intellectual depth in specific subject areas",
    "Potential for future academic contributions"
  ],
  "success_patterns": [],
  "messaging_strategy": "Lead with academic achievements and test scores. Emphasize intellectual curiosity and depth. Frame extracurriculars as intellectual pursuits. Use formal, academic tone. Focus on what you've learned and how you've grown intellectually."
}

Example 2:

Input: Coca-Cola Scholars Program - Leadership, community service, demonstrates capacity to lead and impact

Output:
{
  "personality_profile": {
    "type": "Leadership Impact Champion",
    "traits": ["action-oriented", "community-focused", "inspiring"],
    "values": ["servant leadership", "creating positive change", "empowering others"],
    "tone": "passionate and action-focused"
  },
  "priority_weights": {
    "academic": 0.15,
    "leadership": 0.40,
    "service": 0.30,
    "innovation": 0.05,
    "personal_story": 0.05,
    "extracurricular": 0.05
  },
  "hidden_priorities": [
    "Demonstrated impact and measurable outcomes from leadership",
    "Initiative to start programs, not just participate",
    "Ability to mobilize and inspire others",
    "Sustainable programs that continue beyond individual involvement"
  ],
  "success_patterns": [],
  "messaging_strategy": "Lead with leadership roles and quantifiable impact. Tell stories of how you mobilized others to create change. Emphasize community needs you identified and addressed. Show growth from follower to leader. Use dynamic, action-oriented language. Focus on 'we' not just 'I' to show collaborative leadership."
}
`;
