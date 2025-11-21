// TypeScript types for ScholarLens database models

export interface Scholarship {
  id: string;
  title: string;
  organization: string;
  description: string;
  criteria: string;
  amount: number;
  deadline: string;
  essay_prompts: EssayPrompt[];
  winner_stories: string[];
  requirements: ScholarshipRequirements;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface EssayPrompt {
  question: string;
  word_limit: number;
}

export interface ScholarshipRequirements {
  gpa_min?: number;
  grade_level?: string[];
  citizenship?: string[];
  field_of_study?: string[];
  other?: string[];
}

export interface ScholarshipAnalysis {
  id: string;
  scholarship_id: string;
  personality_profile: PersonalityProfile;
  priority_weights: PriorityWeights;
  hidden_priorities: string[];
  success_patterns: string[];
  messaging_strategy: string;
  analyzed_at: string;
}

export interface PersonalityProfile {
  type: string;
  traits: string[];
  values: string[];
  tone: string;
}

export interface PriorityWeights {
  academic: number;
  leadership: number;
  service: number;
  innovation: number;
  personal_story: number;
  extracurricular: number;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  grade_level?: string;
  gpa?: number;
  test_scores?: TestScores;
  academic_achievements?: string[];
  courses_taken?: string[];
  extracurriculars?: Extracurricular[];
  leadership_roles?: LeadershipRole[];
  awards_honors?: string[];
  volunteer_work?: VolunteerWork[];
  community_impact?: string;
  projects?: Project[];
  background_story?: string;
  challenges_overcome?: string;
  future_goals?: string;
  personal_values?: string[];
  created_at: string;
  updated_at: string;
}

export interface TestScores {
  sat?: number;
  act?: number;
  ap_scores?: { subject: string; score: number }[];
}

export interface Extracurricular {
  name: string;
  role: string;
  duration: string;
  description: string;
  impact: string;
}

export interface LeadershipRole {
  organization: string;
  position: string;
  duration: string;
  responsibilities: string;
  achievements: string;
}

export interface VolunteerWork {
  organization: string;
  role: string;
  hours: number;
  impact: string;
  story: string;
}

export interface Project {
  title: string;
  description: string;
  technologies?: string[];
  outcomes: string;
}

export interface Application {
  id: string;
  student_id: string;
  scholarship_id: string;
  match_score: number;
  match_breakdown: MatchBreakdown;
  match_explanation: string;
  essay_drafts: EssayDraft[];
  selected_draft_id?: number;
  custom_edits?: string;
  status: "draft" | "in_progress" | "submitted";
  created_at: string;
  updated_at: string;
}

export interface MatchBreakdown {
  academic: number;
  leadership: number;
  service: number;
  innovation: number;
  personal_story: number;
  extracurricular: number;
}

export interface EssayDraft {
  version: number;
  angle: string;
  content: string;
  reasoning: string;
  highlighted_experiences: string[];
}

// API Request/Response types
export interface AnalyzeScholarshipRequest {
  scholarship_id: string;
}

export interface AnalyzeScholarshipResponse {
  analysis: ScholarshipAnalysis;
  cached: boolean;
}

export interface MatchScholarshipsRequest {
  student_id: string;
  limit?: number;
}

export interface MatchScholarshipsResponse {
  matches: ScholarshipMatch[];
}

export interface ScholarshipMatch {
  scholarship: Scholarship;
  analysis: ScholarshipAnalysis;
  match_score: number;
  match_breakdown: MatchBreakdown;
  match_explanation: string;
  aligned_experiences: string[];
}

export interface GenerateEssayRequest {
  student_id: string;
  scholarship_id: string;
  essay_prompt_index?: number;
}

export interface GenerateEssayResponse {
  drafts: EssayDraft[];
  scholarship_analysis: ScholarshipAnalysis;
}
