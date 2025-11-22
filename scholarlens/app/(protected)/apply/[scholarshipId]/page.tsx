"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
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

interface EssayDraft {
  version: number;
  angle: string;
  content: string;
  reasoning: string;
  highlighted_experiences: string[];
  word_count: number;
}

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scholarship, setScholarship] = useState<{
    id: string;
    title: string;
    organization: string;
  } | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<EssayDraft[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<number | null>(null);
  const [essayPrompt, setEssayPrompt] = useState<{
    question: string;
    word_limit: number;
  } | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.scholarshipId]);

  const loadData = async () => {
    try {
      const supabase = createClient();

      // Get student profile
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in");
        router.push("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) {
        toast.error("Please create your profile first");
        router.push("/profile");
        return;
      }

      setStudentId(profile.id);

      // Get scholarship
      const { data: scholarshipData } = await supabase
        .from("scholarships")
        .select("*")
        .eq("id", params.scholarshipId)
        .single();

      setScholarship(scholarshipData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const generateEssays = async () => {
    if (!studentId) return;

    setLoading(true);
    try {
      const response = await fetch("/api/generate-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          scholarship_id: params.scholarshipId,
          essay_prompt_index: 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate essays");
      }

      const data = await response.json();
      setDrafts(data.drafts || []);
      setEssayPrompt(data.essay_prompt);
    } catch (error: unknown) {
      console.error("Error generating essays:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate essays. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!scholarship) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <Button variant="outline" onClick={() => router.back()}>
        ← Back
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Generate Application Essay</h1>
        <p className="text-muted-foreground mt-2">
          {scholarship.title} - {scholarship.organization}
        </p>
      </div>

      {/* Essay Prompt */}
      {essayPrompt && (
        <Card>
          <CardHeader>
            <CardTitle>Essay Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">{essayPrompt.question}</p>
            <Badge variant="outline">
              Word Limit: {essayPrompt.word_limit}
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      {drafts.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Generate AI-powered essay drafts tailored to this
                scholarship&apos;s values and priorities
              </p>
              <Button onClick={generateEssays} disabled={loading} size="lg">
                {loading ? "Generating Essays..." : "Generate Essay Drafts"}
              </Button>
              {loading && (
                <p className="text-sm text-muted-foreground">
                  This may take 30-60 seconds...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Essay Drafts */}
      {drafts.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Select Your Essay Angle</h2>
            <p className="text-muted-foreground">
              We&apos;ve generated {drafts.length} different approaches based on
              the scholarship&apos;s priorities
            </p>
          </div>

          <div className="grid gap-6">
            {drafts.map((draft) => (
              <Card
                key={draft.version}
                className={`cursor-pointer transition-all ${
                  selectedDraft === draft.version
                    ? "ring-2 ring-primary"
                    : "hover:shadow-lg"
                }`}
                onClick={() => setSelectedDraft(draft.version)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        Version {draft.version}: {draft.angle}
                      </CardTitle>
                      <CardDescription>
                        {draft.word_count} words
                      </CardDescription>
                    </div>
                    {selectedDraft === draft.version && <Badge>Selected</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Essay Content */}
                  <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
                    <p className="whitespace-pre-wrap text-sm">
                      {draft.content}
                    </p>
                  </div>

                  {/* AI Reasoning */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Why This Approach?</h4>
                    <p className="text-sm text-muted-foreground">
                      {draft.reasoning}
                    </p>
                  </div>

                  {/* Highlighted Experiences */}
                  {draft.highlighted_experiences.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">
                        Experiences Emphasized
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {draft.highlighted_experiences.map((exp, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {exp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={generateEssays}
              disabled={loading}
            >
              Regenerate Essays
            </Button>
            <div className="flex gap-4">
              <Button
                variant="outline"
                disabled={selectedDraft === null}
                onClick={() => {
                  const draft = drafts.find((d) => d.version === selectedDraft);
                  if (draft) {
                    navigator.clipboard.writeText(draft.content);
                    toast.success("Essay copied to clipboard!");
                  }
                }}
              >
                Copy Selected Essay
              </Button>
              <Button
                disabled={selectedDraft === null}
                onClick={() => {
                  toast.success(
                    "Essay saved! (In a full implementation, this would save to the applications table)"
                  );
                }}
              >
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
