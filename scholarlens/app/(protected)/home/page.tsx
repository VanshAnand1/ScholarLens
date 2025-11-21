"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScholarshipCard } from "@/components/scholarship-card";
import Link from "next/link";

export default function HomePage() {
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string;
    email: string;
  } | null>(null);
  const [topMatches, setTopMatches] = useState<
    Array<{ scholarship: any; match_score: number }>
  >([]);
  const [stats, setStats] = useState({
    profileComplete: 0,
    totalMatches: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Get student profile
      const { data: profileData } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setProfile(profileData);

      if (profileData) {
        // Calculate profile completion
        const fields = [
          profileData.full_name,
          profileData.email,
          profileData.gpa,
          profileData.academic_achievements?.length,
          profileData.extracurriculars?.length,
          profileData.volunteer_work?.length,
          profileData.background_story,
          profileData.future_goals,
        ];
        const completedFields = fields.filter((f) => f).length;
        const completion = Math.round((completedFields / fields.length) * 100);

        // Get application count
        const { count } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("student_id", profileData.id);

        setStats({
          profileComplete: completion,
          totalMatches: 0,
          applications: count || 0,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold">
          Welcome
          {profile?.full_name ? `, ${profile.full_name}` : " to ScholarLens"}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Your AI-powered scholarship matching assistant
        </p>
      </div>

      {/* Quick Stats */}
      {profile ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardDescription>Profile Completion</CardDescription>
              <CardTitle className="text-3xl">
                {stats.profileComplete}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.profileComplete < 100 && (
                <Link href="/profile">
                  <Button variant="outline" className="w-full">
                    Complete Profile
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Scholarships Available</CardDescription>
              <CardTitle className="text-3xl">{stats.totalMatches}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/scholarships">
                <Button variant="outline" className="w-full">
                  Browse All
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Applications Started</CardDescription>
              <CardTitle className="text-3xl">{stats.applications}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Keep working on your applications!
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Create your profile to unlock personalized scholarship matches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Tell us about your achievements, experiences, and goals. Our AI
              will:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                Match you with scholarships that align with your strengths
              </li>
              <li>Analyze what each scholarship truly values</li>
              <li>
                Generate tailored essay drafts that emphasize the right
                experiences
              </li>
            </ul>
            <Link href="/profile">
              <Button size="lg" className="w-full">
                Create Your Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Top Matches */}
      {topMatches.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Top Matches</h2>
            <Link href="/scholarships">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMatches.slice(0, 6).map((match) => (
              <ScholarshipCard
                key={match.scholarship.id}
                scholarship={match.scholarship}
                matchScore={match.match_score}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/scholarships">
            <Button>Browse Scholarships</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline">
              {profile ? "Edit Profile" : "Create Profile"}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How ScholarLens Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1</div>
              <h3 className="font-semibold mb-2">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Share your achievements, experiences, and aspirations
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2</div>
              <h3 className="font-semibold mb-2">AI Analyzes Matches</h3>
              <p className="text-sm text-muted-foreground">
                Our AI identifies scholarships that value your unique strengths
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <h3 className="font-semibold mb-2">Generate Essays</h3>
              <p className="text-sm text-muted-foreground">
                Get tailored essay drafts that emphasize what each scholarship
                values
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
