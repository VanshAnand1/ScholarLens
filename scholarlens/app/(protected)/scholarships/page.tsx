"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ScholarshipCard } from "@/components/scholarship-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Scholarship {
  id: string;
  title: string;
  organization: string;
  amount: number;
  deadline: string;
  tags: string[];
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<
    Scholarship[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    loadScholarships();
  }, []);

  useEffect(() => {
    filterScholarships();
  }, [searchQuery, selectedTags, scholarships]);

  const loadScholarships = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("scholarships")
        .select("id, title, organization, amount, deadline, tags")
        .order("deadline", { ascending: true });

      if (error) throw error;

      setScholarships(data || []);

      // Extract all unique tags
      const tags = new Set<string>();
      data?.forEach((s) => s.tags?.forEach((tag: string) => tags.add(tag)));
      setAllTags(Array.from(tags).sort());
    } catch (error) {
      console.error("Error loading scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterScholarships = () => {
    let filtered = scholarships;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.organization.toLowerCase().includes(query)
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((s) =>
        selectedTags.some((tag) => s.tags?.includes(tag))
      );
    }

    setFilteredScholarships(filtered);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading scholarships...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Scholarships</h1>
          <p className="text-muted-foreground mt-2">
            Browse available scholarships and find your perfect match
          </p>
        </div>
        <Link href="/profile">
          <Button>Complete Profile to Get Matches</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <Input
          placeholder="Search scholarships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center">
              Filter by:
            </span>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredScholarships.length} of {scholarships.length}{" "}
          scholarships
        </p>

        {filteredScholarships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No scholarships found
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
