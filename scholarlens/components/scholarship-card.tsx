import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ScholarshipCardProps {
  scholarship: {
    id: string;
    title: string;
    organization: string;
    amount: number;
    deadline: string;
    tags: string[];
  };
  matchScore?: number;
}

export function ScholarshipCard({
  scholarship,
  matchScore,
}: ScholarshipCardProps) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(scholarship.amount);

  const formattedDeadline = new Date(scholarship.deadline).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const getMatchColor = (score: number) => {
    if (score >= 80)
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (score >= 60)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  return (
    <Link href={`/scholarships/${scholarship.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <CardTitle className="text-lg">{scholarship.title}</CardTitle>
              <CardDescription>{scholarship.organization}</CardDescription>
            </div>
            {matchScore !== undefined && (
              <Badge className={getMatchColor(matchScore)}>
                {Math.round(matchScore)}% Match
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">
                {formattedAmount}
              </span>
              <span className="text-sm text-muted-foreground">
                Due: {formattedDeadline}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {scholarship.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {scholarship.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{scholarship.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
