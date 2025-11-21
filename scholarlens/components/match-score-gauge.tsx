interface MatchScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function MatchScoreGauge({ score, size = "md" }: MatchScoreGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "w-16 h-16 text-lg";
      case "lg":
        return "w-32 h-32 text-4xl";
      default:
        return "w-24 h-24 text-2xl";
    }
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className={getSizeClasses(size)} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className={`${getColor(score)} transition-all duration-500`}
        />
      </svg>
      <div
        className={`absolute inset-0 flex items-center justify-center font-bold ${getColor(
          score
        )}`}
      >
        {Math.round(score)}
      </div>
    </div>
  );
}
