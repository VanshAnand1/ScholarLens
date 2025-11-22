"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    grade_level: "",
    gpa: "",
    sat: "",
    act: "",
    academic_achievements: [""],
    extracurriculars: [
      { name: "", role: "", duration: "", description: "", impact: "" },
    ],
    leadership_roles: [
      {
        organization: "",
        position: "",
        duration: "",
        responsibilities: "",
        achievements: "",
      },
    ],
    volunteer_work: [
      { organization: "", role: "", hours: "", impact: "", story: "" },
    ],
    projects: [{ title: "", description: "", technologies: "", outcomes: "" }],
    background_story: "",
    challenges_overcome: "",
    future_goals: "",
    personal_values: [""],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      // Clean and format data
      const profileData = {
        user_id: user.id,
        full_name: formData.full_name,
        email: formData.email,
        grade_level: formData.grade_level || null,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        test_scores: {
          sat: formData.sat ? parseInt(formData.sat) : null,
          act: formData.act ? parseInt(formData.act) : null,
        },
        academic_achievements: formData.academic_achievements.filter((a) =>
          a.trim()
        ),
        extracurriculars: formData.extracurriculars.filter((e) =>
          e.name.trim()
        ),
        leadership_roles: formData.leadership_roles.filter((l) =>
          l.organization.trim()
        ),
        volunteer_work: formData.volunteer_work
          .map((v) => ({
            ...v,
            hours: v.hours ? parseInt(v.hours) : 0,
          }))
          .filter((v) => v.organization.trim()),
        projects: formData.projects.filter((p) => p.title.trim()),
        background_story: formData.background_story || null,
        challenges_overcome: formData.challenges_overcome || null,
        future_goals: formData.future_goals || null,
        personal_values: formData.personal_values.filter((v) => v.trim()),
      };

      const { error } = await supabase
        .from("student_profiles")
        .upsert(profileData, { onConflict: "user_id" });

      if (error) throw error;

      alert("Profile saved successfully!");
      router.push("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field: string) => {
    setFormData((prev) => {
      const currentArray = prev[field as keyof typeof prev];
      const newItem =
        field === "academic_achievements" || field === "personal_values"
          ? ""
          : field === "extracurriculars"
          ? { name: "", role: "", duration: "", description: "", impact: "" }
          : field === "leadership_roles"
          ? {
              organization: "",
              position: "",
              duration: "",
              responsibilities: "",
              achievements: "",
            }
          : field === "volunteer_work"
          ? { organization: "", role: "", hours: "", impact: "", story: "" }
          : { title: "", description: "", technologies: "", outcomes: "" };

      return {
        ...prev,
        [field]: [
          ...(Array.isArray(currentArray) ? currentArray : []),
          newItem,
        ],
      };
    });
  };

  const removeItem = (field: string, index: number) => {
    setFormData((prev) => {
      const currentArray = prev[field as keyof typeof prev];
      return {
        ...prev,
        [field]: Array.isArray(currentArray)
          ? currentArray.filter((_, i) => i !== index)
          : [],
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          Tell us about yourself to get personalized scholarship matches
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your personal and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grade_level">Grade Level</Label>
                <Select
                  value={formData.grade_level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, grade_level: value })
                  }
                >
                  <SelectTrigger id="grade_level">
                    <SelectValue placeholder="Select your grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Below 8th Grade">
                      Below 8th Grade
                    </SelectItem>
                    <SelectItem value="9th Grade">9th Grade</SelectItem>
                    <SelectItem value="10th Grade">10th Grade</SelectItem>
                    <SelectItem value="11th Grade">11th Grade</SelectItem>
                    <SelectItem value="12th Grade">12th Grade</SelectItem>
                    <SelectItem value="1st Year Post-Secondary">
                      1st Year Post-Secondary
                    </SelectItem>
                    <SelectItem value="2nd Year Post-Secondary">
                      2nd Year Post-Secondary
                    </SelectItem>
                    <SelectItem value="3rd Year Post-Secondary">
                      3rd Year Post-Secondary
                    </SelectItem>
                    <SelectItem value="4th Year Post-Secondary">
                      4th Year Post-Secondary
                    </SelectItem>
                    <SelectItem value="5th Year Post-Secondary">
                      5th Year Post-Secondary
                    </SelectItem>
                    <SelectItem value="Masters Student">
                      Masters Student
                    </SelectItem>
                    <SelectItem value="Doctorate Student">
                      Doctorate Student
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="3.85"
                  value={formData.gpa}
                  onChange={(e) =>
                    setFormData({ ...formData, gpa: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sat">SAT Score</Label>
                <Input
                  id="sat"
                  type="number"
                  placeholder="1450"
                  value={formData.sat}
                  onChange={(e) =>
                    setFormData({ ...formData, sat: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="act">ACT Score</Label>
                <Input
                  id="act"
                  type="number"
                  placeholder="32"
                  value={formData.act}
                  onChange={(e) =>
                    setFormData({ ...formData, act: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Achievements</CardTitle>
            <CardDescription>
              Awards, honors, and notable accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.academic_achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="e.g., National Merit Scholar, AP Scholar with Distinction"
                  value={achievement}
                  onChange={(e) => {
                    const updated = [...formData.academic_achievements];
                    updated[index] = e.target.value;
                    setFormData({
                      ...formData,
                      academic_achievements: updated,
                    });
                  }}
                />
                {formData.academic_achievements.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeItem("academic_achievements", index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addItem("academic_achievements")}
            >
              + Add Achievement
            </Button>
          </CardContent>
        </Card>

        {/* Extracurriculars */}
        <Card>
          <CardHeader>
            <CardTitle>Extracurricular Activities</CardTitle>
            <CardDescription>
              Clubs, sports, and activities you participate in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.extracurriculars.map((activity, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Activity Name"
                    value={activity.name}
                    onChange={(e) => {
                      const updated = [...formData.extracurriculars];
                      updated[index].name = e.target.value;
                      setFormData({ ...formData, extracurriculars: updated });
                    }}
                  />
                  <Input
                    placeholder="Your Role"
                    value={activity.role}
                    onChange={(e) => {
                      const updated = [...formData.extracurriculars];
                      updated[index].role = e.target.value;
                      setFormData({ ...formData, extracurriculars: updated });
                    }}
                  />
                </div>
                <Input
                  placeholder="Duration (e.g., 2 years)"
                  value={activity.duration}
                  onChange={(e) => {
                    const updated = [...formData.extracurriculars];
                    updated[index].duration = e.target.value;
                    setFormData({ ...formData, extracurriculars: updated });
                  }}
                />
                <Input
                  placeholder="Description"
                  value={activity.description}
                  onChange={(e) => {
                    const updated = [...formData.extracurriculars];
                    updated[index].description = e.target.value;
                    setFormData({ ...formData, extracurriculars: updated });
                  }}
                />
                <Input
                  placeholder="Impact/Achievements"
                  value={activity.impact}
                  onChange={(e) => {
                    const updated = [...formData.extracurriculars];
                    updated[index].impact = e.target.value;
                    setFormData({ ...formData, extracurriculars: updated });
                  }}
                />
                {formData.extracurriculars.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeItem("extracurriculars", index)}
                  >
                    Remove Activity
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addItem("extracurriculars")}
            >
              + Add Activity
            </Button>
          </CardContent>
        </Card>

        {/* Leadership */}
        <Card>
          <CardHeader>
            <CardTitle>Leadership Experience</CardTitle>
            <CardDescription>
              Positions where you led or managed others
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.leadership_roles.map((role, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Organization"
                    value={role.organization}
                    onChange={(e) => {
                      const updated = [...formData.leadership_roles];
                      updated[index].organization = e.target.value;
                      setFormData({ ...formData, leadership_roles: updated });
                    }}
                  />
                  <Input
                    placeholder="Position"
                    value={role.position}
                    onChange={(e) => {
                      const updated = [...formData.leadership_roles];
                      updated[index].position = e.target.value;
                      setFormData({ ...formData, leadership_roles: updated });
                    }}
                  />
                </div>
                <Input
                  placeholder="Duration"
                  value={role.duration}
                  onChange={(e) => {
                    const updated = [...formData.leadership_roles];
                    updated[index].duration = e.target.value;
                    setFormData({ ...formData, leadership_roles: updated });
                  }}
                />
                <Input
                  placeholder="Responsibilities"
                  value={role.responsibilities}
                  onChange={(e) => {
                    const updated = [...formData.leadership_roles];
                    updated[index].responsibilities = e.target.value;
                    setFormData({ ...formData, leadership_roles: updated });
                  }}
                />
                <Input
                  placeholder="Achievements"
                  value={role.achievements}
                  onChange={(e) => {
                    const updated = [...formData.leadership_roles];
                    updated[index].achievements = e.target.value;
                    setFormData({ ...formData, leadership_roles: updated });
                  }}
                />
                {formData.leadership_roles.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeItem("leadership_roles", index)}
                  >
                    Remove Role
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addItem("leadership_roles")}
            >
              + Add Leadership Role
            </Button>
          </CardContent>
        </Card>

        {/* Volunteer Work */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer & Community Service</CardTitle>
            <CardDescription>
              Your community involvement and service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.volunteer_work.map((work, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Organization"
                    value={work.organization}
                    onChange={(e) => {
                      const updated = [...formData.volunteer_work];
                      updated[index].organization = e.target.value;
                      setFormData({ ...formData, volunteer_work: updated });
                    }}
                  />
                  <Input
                    placeholder="Your Role"
                    value={work.role}
                    onChange={(e) => {
                      const updated = [...formData.volunteer_work];
                      updated[index].role = e.target.value;
                      setFormData({ ...formData, volunteer_work: updated });
                    }}
                  />
                </div>
                <Input
                  type="number"
                  placeholder="Total Hours"
                  value={work.hours}
                  onChange={(e) => {
                    const updated = [...formData.volunteer_work];
                    updated[index].hours = e.target.value;
                    setFormData({ ...formData, volunteer_work: updated });
                  }}
                />
                <Input
                  placeholder="Impact/Outcomes"
                  value={work.impact}
                  onChange={(e) => {
                    const updated = [...formData.volunteer_work];
                    updated[index].impact = e.target.value;
                    setFormData({ ...formData, volunteer_work: updated });
                  }}
                />
                <Input
                  placeholder="Your Story/Experience"
                  value={work.story}
                  onChange={(e) => {
                    const updated = [...formData.volunteer_work];
                    updated[index].story = e.target.value;
                    setFormData({ ...formData, volunteer_work: updated });
                  }}
                />
                {formData.volunteer_work.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeItem("volunteer_work", index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addItem("volunteer_work")}
            >
              + Add Volunteer Experience
            </Button>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Projects & Innovation</CardTitle>
            <CardDescription>
              Personal projects, research, or creative work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.projects.map((project, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <Input
                  placeholder="Project Title"
                  value={project.title}
                  onChange={(e) => {
                    const updated = [...formData.projects];
                    updated[index].title = e.target.value;
                    setFormData({ ...formData, projects: updated });
                  }}
                />
                <Input
                  placeholder="Description"
                  value={project.description}
                  onChange={(e) => {
                    const updated = [...formData.projects];
                    updated[index].description = e.target.value;
                    setFormData({ ...formData, projects: updated });
                  }}
                />
                <Input
                  placeholder="Technologies/Tools Used"
                  value={project.technologies}
                  onChange={(e) => {
                    const updated = [...formData.projects];
                    updated[index].technologies = e.target.value;
                    setFormData({ ...formData, projects: updated });
                  }}
                />
                <Input
                  placeholder="Outcomes/Results"
                  value={project.outcomes}
                  onChange={(e) => {
                    const updated = [...formData.projects];
                    updated[index].outcomes = e.target.value;
                    setFormData({ ...formData, projects: updated });
                  }}
                />
                {formData.projects.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeItem("projects", index)}
                  >
                    Remove Project
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addItem("projects")}
            >
              + Add Project
            </Button>
          </CardContent>
        </Card>

        {/* Personal Story */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Story</CardTitle>
            <CardDescription>
              Tell us about your journey and aspirations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="background_story">Background Story</Label>
              <textarea
                id="background_story"
                className="w-full min-h-[100px] p-3 border rounded-md"
                placeholder="Your background, upbringing, or unique experiences..."
                value={formData.background_story}
                onChange={(e) =>
                  setFormData({ ...formData, background_story: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="challenges_overcome">Challenges Overcome</Label>
              <textarea
                id="challenges_overcome"
                className="w-full min-h-[100px] p-3 border rounded-md"
                placeholder="Obstacles you've faced and how you overcame them..."
                value={formData.challenges_overcome}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    challenges_overcome: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="future_goals">Future Goals</Label>
              <textarea
                id="future_goals"
                className="w-full min-h-[100px] p-3 border rounded-md"
                placeholder="Your aspirations, career plans, and what you hope to achieve..."
                value={formData.future_goals}
                onChange={(e) =>
                  setFormData({ ...formData, future_goals: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Personal Values */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Values</CardTitle>
            <CardDescription>What matters most to you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.personal_values.map((value, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="e.g., Innovation, Community, Integrity"
                  value={value}
                  onChange={(e) => {
                    const updated = [...formData.personal_values];
                    updated[index] = e.target.value;
                    setFormData({ ...formData, personal_values: updated });
                  }}
                />
                {formData.personal_values.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeItem("personal_values", index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addItem("personal_values")}
            >
              + Add Value
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
