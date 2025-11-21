# ScholarLens: AI-Powered Adaptive Scholarship Matching

An intelligent scholarship matching system that uses Claude AI to analyze scholarship priorities, adaptively score student matches, and generate tailored application essays.

## 🎯 Project Overview

ScholarLens transforms the scholarship application process by:

- **Analyzing** scholarship descriptions to identify hidden priorities and values
- **Matching** students to scholarships with adaptive, explainable scoring
- **Generating** tailored essay drafts that emphasize the right aspects of each student's profile

Built for the Agentiiv Hackathon Challenge.

## 🚀 Features

- **Pattern Recognition**: Claude AI analyzes scholarships to extract personality profiles and success patterns
- **Adaptive Scoring**: Different scholarships get different weight profiles based on their priorities
- **Content Generation**: AI-powered essay drafting with multiple strategic angles
- **Explainable AI**: Clear explanations for match scores and essay strategies
- **User Authentication**: Secure login and profile management with Supabase
- **Modern UI**: Built with Next.js, TypeScript, and shadcn/ui components

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account and project ([create one here](https://supabase.com))
- An Anthropic API key ([get one here](https://console.anthropic.com))

## 🛠️ Setup Instructions

### 1. Clone and Install

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

```bash
npm install
```

### 2. Set Up Supabase Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Navigate to the **SQL Editor**
4. Copy the contents of `supabase/schema.sql` and run it
5. This will create all necessary tables: `scholarships`, `scholarship_analysis`, `student_profiles`, and `applications`

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your credentials:

   ```env
   # Get from Supabase Dashboard > Project Settings > API
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Get from https://console.anthropic.com/settings/keys
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

### 4. Run the Development Server

```bash
npm run dev
```

The app should now be running on [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
scholarlens/
├── app/
│   ├── api/
│   │   ├── analyze-scholarship/  # Claude AI scholarship analysis
│   │   ├── match-scholarships/   # Adaptive matching algorithm
│   │   └── generate-essay/       # AI essay generation
│   ├── (protected)/              # Authenticated routes
│   │   ├── home/                 # Dashboard
│   │   ├── scholarships/         # Browse scholarships
│   │   └── profile/              # Student profile (to be built)
│   └── auth/                     # Authentication pages
├── lib/
│   ├── ai/
│   │   ├── claude-client.ts      # Anthropic API wrapper
│   │   └── prompts.ts            # Prompt templates
│   ├── supabase/                 # Supabase clients
│   └── types.ts                  # TypeScript definitions
├── components/                    # React components
└── supabase/
    └── schema.sql                # Database schema
```

## 🔑 API Endpoints

### POST `/api/analyze-scholarship`

Analyzes a scholarship to extract personality profile, priority weights, and success patterns.

**Request:**

```json
{
  "scholarship_id": "uuid"
}
```

**Response:**

```json
{
  "analysis": {
    "personality_profile": {...},
    "priority_weights": {...},
    "hidden_priorities": [...],
    "success_patterns": [...],
    "messaging_strategy": "..."
  },
  "cached": true
}
```

### POST `/api/match-scholarships`

Calculates match scores between a student and all scholarships.

**Request:**

```json
{
  "student_id": "uuid",
  "limit": 10
}
```

**Response:**

```json
{
  "matches": [
    {
      "scholarship": {...},
      "match_score": 87.5,
      "match_breakdown": {...},
      "match_explanation": "...",
      "aligned_experiences": [...]
    }
  ]
}
```

### POST `/api/generate-essay`

Generates tailored essay drafts with different strategic angles.

**Request:**

```json
{
  "student_id": "uuid",
  "scholarship_id": "uuid",
  "essay_prompt_index": 0
}
```

**Response:**

```json
{
  "drafts": [
    {
      "version": 1,
      "angle": "Primary Strength Focus",
      "content": "...",
      "reasoning": "...",
      "highlighted_experiences": [...]
    }
  ]
}
```

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Claude 3.5 Sonnet (Anthropic)
- **Deployment**: Vercel (recommended)

## 📊 Database Schema

### Tables

- **scholarships**: Store scholarship data, criteria, and essay prompts
- **scholarship_analysis**: Cache Claude's analysis results
- **student_profiles**: Store student information and experiences
- **applications**: Track generated essays and match scores

See `supabase/schema.sql` for full schema details.

## 🔄 Development Workflow

1. **Add Scholarships**: Manually insert scholarship data into Supabase
2. **Analyze**: Call `/api/analyze-scholarship` to generate AI analysis
3. **Create Profile**: Build student profile through the UI
4. **Match**: Call `/api/match-scholarships` to find best fits
5. **Generate Essays**: Call `/api/generate-essay` for tailored drafts

## 🚧 Next Steps

- [ ] Build student profile creation UI
- [ ] Create scholarship browsing interface
- [ ] Implement essay drafting workflow
- [ ] Add visualization components (charts, comparisons)
- [ ] Seed database with 25+ scholarships
- [ ] Create demo scenarios for presentation
- [ ] Deploy to Vercel

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

This is a hackathon project. For questions or collaboration, please open an issue.

---

Built with ❤️ for the Agentiiv Hackathon Challenge
