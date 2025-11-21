-- ScholarLens Database Schema
-- Run this in Supabase SQL Editor to set up all tables

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT NOT NULL,
  criteria TEXT NOT NULL,
  amount DECIMAL(10, 2),
  deadline DATE,
  essay_prompts JSONB, -- Array of {question, word_limit}
  winner_stories TEXT[], -- Array of past winner narratives
  requirements JSONB, -- {gpa_min, grade_level, citizenship, etc}
  tags TEXT[], -- ["STEM", "Leadership", "Community Service"]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Analysis Cache (stores Claude's scholarship analysis)
CREATE TABLE IF NOT EXISTS scholarship_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  personality_profile JSONB, -- {type, traits, values, tone}
  priority_weights JSONB, -- {academic: 0.4, leadership: 0.2, service: 0.3, innovation: 0.1}
  hidden_priorities TEXT[], -- Extracted implicit values
  success_patterns TEXT[], -- Patterns from winner stories
  messaging_strategy TEXT, -- AI-generated guidance
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(scholarship_id)
);

-- Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  grade_level TEXT,
  gpa DECIMAL(3, 2),
  
  -- Academic info
  test_scores JSONB, -- {sat, act, ap_scores}
  academic_achievements TEXT[],
  courses_taken TEXT[],
  
  -- Activities & Leadership
  extracurriculars JSONB[], -- [{name, role, duration, description, impact}]
  leadership_roles JSONB[],
  awards_honors TEXT[],
  
  -- Community & Service
  volunteer_work JSONB[], -- [{organization, role, hours, impact, story}]
  community_impact TEXT,
  
  -- Projects & Innovation
  projects JSONB[], -- [{title, description, technologies, outcomes}]
  
  -- Personal Story
  background_story TEXT,
  challenges_overcome TEXT,
  future_goals TEXT,
  personal_values TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Applications (stores generated essays and match data)
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  
  -- Match Analysis
  match_score DECIMAL(5, 2), -- 0-100
  match_breakdown JSONB, -- {academic: 85, leadership: 72, service: 90}
  match_explanation TEXT, -- AI-generated explanation
  
  -- Generated Content
  essay_drafts JSONB[], -- [{version, angle, content, reasoning}]
  selected_draft_id INTEGER,
  custom_edits TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft', -- draft, in_progress, submitted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, scholarship_id)
);

-- Enable Row Level Security
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Scholarships are viewable by everyone" ON scholarships;
DROP POLICY IF EXISTS "Analysis is viewable by everyone" ON scholarship_analysis;
DROP POLICY IF EXISTS "Users can view own profile" ON student_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON student_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON student_profiles;
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Users can manage own applications" ON applications;

-- RLS Policies (public read for scholarships, user-specific for profiles/applications)
CREATE POLICY "Scholarships are viewable by everyone" ON scholarships FOR SELECT USING (true);

CREATE POLICY "Analysis is viewable by everyone" ON scholarship_analysis FOR SELECT USING (true);

CREATE POLICY "Users can view own profile" ON student_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON student_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON student_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = applications.student_id AND user_id = auth.uid())
);

CREATE POLICY "Users can manage own applications" ON applications FOR ALL USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = applications.student_id AND user_id = auth.uid())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scholarships_tags ON scholarships USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarship_analysis_scholarship_id ON scholarship_analysis(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_scholarship_id ON applications(scholarship_id);
