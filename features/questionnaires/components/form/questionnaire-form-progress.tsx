"use client";

import { Progress } from "@/components/ui/progress";

type QuestionnaireFormProgressProps = {
  answeredCount: number;
  totalRequired: number;
  isComplete: boolean;
  /** Optional slot rendered beside the percentage (e.g. draft status badge). */
  trailing?: React.ReactNode;
};

export function QuestionnaireFormProgress({
  answeredCount,
  totalRequired,
  isComplete,
  trailing,
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
        <div className="flex items-center gap-2">
          {trailing}
          <p className={isComplete ? "font-medium text-green-600" : "text-muted-foreground"}>
            {percentage}%
          </p>
        </div>
      </div>
      <Progress value={percentage} className="bg-brand-blue/20 [&>*]:bg-brand-blue" />
    </div>
  );
}
