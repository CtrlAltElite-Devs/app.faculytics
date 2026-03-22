"use client";

import { Progress } from "@/components/ui/progress";

type QuestionnaireFormProgressProps = {
  answeredCount: number;
  totalRequired: number;
  isComplete: boolean;
};

export function QuestionnaireFormProgress({
  answeredCount,
  totalRequired,
  isComplete,
}: QuestionnaireFormProgressProps) {
  const percentage = totalRequired > 0
    ? Math.round((answeredCount / totalRequired) * 100)
    : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {answeredCount} / {totalRequired} questions answered
        </p>
        <p className={isComplete ? "font-medium text-green-600" : "text-muted-foreground"}>
          {percentage}%
        </p>
      </div>
      <Progress value={percentage} />
    </div>
  );
}
