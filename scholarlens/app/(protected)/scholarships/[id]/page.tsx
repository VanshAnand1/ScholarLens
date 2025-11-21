"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatchScoreGauge } from "@/components/match-score-gauge";
import Link from "next/link";

interface Scholarship {
  id: string;
  title: string;
  organization: string;
  description: string;
  criteria: string;
  amount: number;
  deadline: string;
  essay_prompts: Array<{ question: string; word_limit: number }>;
  tags: string[];
  requirements: Record<string, string | string[] | number>;
}

export default function ScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [matchData, setMatchData] = useState<{
    match_score: number;
    match_breakdown: Record<string, number>;
    match_explanation: string;
    aligned_experiences: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    loadScholarship();
    checkStudentProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadScholarship = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setScholarship(data);
    } catch (error) {
      console.error("Error loading scholarship:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkStudentProfile = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("student_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          setStudentId(profile.id);
          loadMatchData(profile.id);
        }
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  const loadMatchData = async (profileId: string) => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("applications")
        .select("*")
        .eq("student_id", profileId)
        .eq("scholarship_id", params.id)
        .single();

      if (data) {
        setMatchData(data);
      }
    } catch {
      // No match data yet, that's okay
    }
  };

  const analyzeMatch = async () => {
    if (!studentId) return;

    setAnalyzing(true);
    try {
      const response = await fetch("/api/match-scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, limit: 100 }),
      });

      const data = await response.json();
      const match = data.matches.find(
        (m: { scholarship: { id: string } }) => m.scholarship.id === params.id
      );

      if (match) {
        setMatchData(match);
      }
    } catch (error) {
      console.error("Error analyzing match:", error);
      alert("Failed to analyze match");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-muted-foreground">Scholarship not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(scholarship.amount);

  const formattedDeadline = new Date(scholarship.deadline).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <Button variant="outline" onClick={() => router.back()}>
        ← Back
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{scholarship.title}</h1>
            <p className="text-xl text-muted-foreground mt-2">
              {scholarship.organization}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {formattedAmount}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Deadline: {formattedDeadline}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {scholarship.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Match Score Section */}
      {studentId && (
        <Card>
          <CardHeader>
            <CardTitle>Your Match</CardTitle>
            <CardDescription>
              How well you align with this scholarship
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matchData ? (
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <MatchScoreGauge score={matchData.match_score} size="lg" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      Match Breakdown
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(matchData.match_breakdown || {}).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center"
                          >
                            <span className="capitalize">
                              {key.replace("_", " ")}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-12">
                                {Math.round(value as number)}%
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {matchData.match_explanation && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Why This Match?</h3>
                    <p className="text-muted-foreground">
                      {matchData.match_explanation}
                    </p>
                  </div>
                )}

                {matchData.aligned_experiences &&
                  matchData.aligned_experiences.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">
                        Your Aligned Strengths
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {matchData.aligned_experiences.map(
                          (exp: string, i: number) => (
                            <li key={i} className="text-muted-foreground">
                              {exp}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                <Link href={`/apply/${scholarship.id}`}>
                  <Button className="w-full" size="lg">
                    Generate Application Essays
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Analyze your match to see how well you align with this
                  scholarship
                </p>
                <Button onClick={analyzeMatch} disabled={analyzing}>
                  {analyzing ? "Analyzing..." : "Analyze My Match"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!studentId && (
        <Card className="border-yellow-500">
          <CardContent className="pt-6">
            <p className="text-center mb-4">
              Complete your profile to see personalized match scores
            </p>
            <Link href="/profile">
              <Button className="w-full">Create Profile</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About This Scholarship</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{scholarship.description}</p>
        </CardContent>
      </Card>

      {/* Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>Eligibility & Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{scholarship.criteria}</p>
        </CardContent>
      </Card>

      {/* Essay Prompts */}
      {scholarship.essay_prompts && scholarship.essay_prompts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Essay Prompts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scholarship.essay_prompts.map((prompt, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">Prompt {index + 1}</span>
                  <Badge variant="outline">{prompt.word_limit} words</Badge>
                </div>
                <p className="text-muted-foreground">{prompt.question}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Requirements */}
      {scholarship.requirements &&
        Object.keys(scholarship.requirements).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                {Object.entries(scholarship.requirements).map(
                  ([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <dt className="font-semibold capitalize">
                        {key.replace("_", " ")}:
                      </dt>
                      <dd className="text-muted-foreground">
                        {Array.isArray(value)
                          ? value.join(", ")
                          : String(value)}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
