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
  const percentage = totalRequired > 0 ? Math.round((answeredCount / totalRequired) * 100) : 0;

  return (
    <div className="sticky top-0 z-20 -mx-4 space-y-2 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="truncate text-muted-foreground">
          <span className="font-medium tabular-nums text-foreground">{answeredCount}</span>
          <span className="text-muted-foreground"> / {totalRequired}</span>
          <span className="hidden sm:inline"> questions answered</span>
          <span className="sm:hidden"> answered</span>
        </p>
        <div className="flex items-center gap-2">
          {trailing}
          <p
            className={
              "tabular-nums " +
              (isComplete ? "font-semibold text-green-600" : "text-muted-foreground")
            }
          >
            {percentage}%
          </p>
        </div>
      </div>
      <Progress value={percentage} className="h-1.5 bg-brand-blue/20 [&>*]:bg-brand-blue" />
    </div>
  );
}
