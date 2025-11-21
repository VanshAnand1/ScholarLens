# ScholarLens Hackathon Implementation Plan

## Project Overview

Build an AI-powered scholarship matching system using Claude AI that analyzes scholarship priorities, adaptively scores student matches, and generates tailored application essays that emphasize the right aspects of each student's profile for specific scholarships.

**Tech Stack:** Next.js 14, TypeScript, Supabase, Claude AI (Anthropic), TailwindCSS, shadcn/ui

---

## Phase 1: Database Setup & Data Collection (Day 1 Morning)

### 1.1 Create Supabase Database Schema

Run the following SQL in Supabase SQL Editor to create all required tables:

```sql
-- Scholarships table
CREATE TABLE scholarships (
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
CREATE TABLE scholarship_analysis (
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
CREATE TABLE student_profiles (
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
CREATE TABLE applications (
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
```

### 1.2 Gather Real Scholarship Data

Collect 25+ scholarships from sources like:

- **fastweb.com, scholarships.com, bold.org**
- **College Board Scholarship Search**
- **Professional organizations** (IEEE, ACM, ACS for STEM)
- **Diversity scholarships** (Gates, Questbridge, UNCF)
- **Local community scholarships**

**Categories to cover:**

- Merit-based (5-7 scholarships)
- Community Service (4-5)
- STEM/Innovation (4-5)
- Leadership (3-4)
- Diversity & Inclusion (3-4)
- Creative/Arts (2-3)

**Data to collect per scholarship:**

- Full description and eligibility criteria
- Essay prompts with word limits
- Award amounts and deadlines
- Past winner stories (from scholarship websites or LinkedIn)
- Organization mission/values

### 1.3 Create Sample Student Profiles

Develop 3-5 diverse student personas for demo

---

## Phase 2: Claude AI Integration & Core Engine (Day 1 Afternoon - Day 2 Morning)

### 2.1 Install Dependencies

```bash
npm install @anthropic-ai/sdk zod
```

### 2.2 Create AI Service Layer

Build core AI infrastructure in `lib/ai/` directory

### 2.3 Build API Routes

- `/api/analyze-scholarship` - Pattern recognition
- `/api/match-scholarships` - Adaptive scoring
- `/api/generate-essay` - Content generation

---

## Phase 3: Frontend Development (Day 2 Afternoon - Day 3 Morning)

### 3.1 Student Profile Creation

Build comprehensive profile form

### 3.2 Scholarship Browse & Detail Pages

Implement browsing and matching UI

### 3.3 Essay Drafting Interface

Multi-step essay generation workflow

### 3.4 Dashboard & Match Overview

Student dashboard with recommendations

---

## Phase 4: Visualization & Explainable AI (Day 3 Afternoon)

Add charts and comparison views

---

## Phase 5: Polish & Demo Preparation (Day 4)

Seed data, create demo scenarios, finalize presentation

---

## Success Criteria

### Innovation & AI Integration (35%)

- Novel scholarship "personality profiling"
- Sophisticated prompt engineering
- Success pattern mining from winner stories
- Adaptive weights per scholarship
- Multi-angle essay generation

### Drafting Quality & Relevance (35%)

- Authentic student voice in essays
- Clear emphasis on scholarship-valued qualities
- Demonstrable improvement over generic approach
- User-friendly interface

### Technical Execution (30%)

- Clean architecture
- Effective Claude API integration
- Caching strategy for performance
- Responsive, polished UI
- Robust error handling
