"use client";

import { memo } from "react";

import { Progress } from "@/components/ui/progress";

import { useAnsweredCountFor, useHasQualitativeContent } from "./questionnaire-form-store";

type QuestionnaireFormProgressProps = {
  requiredIds: string[];
  qualitativeRequired: boolean;
  /** Optional slot rendered beside the percentage (e.g. draft status badge). */
  trailing?: React.ReactNode;
};

function QuestionnaireFormProgressBase({
  requiredIds,
  qualitativeRequired,
  trailing,
}: QuestionnaireFormProgressProps) {
  const answeredCount = useAnsweredCountFor(requiredIds);
  const hasQualitativeContent = useHasQualitativeContent();
  const totalRequired = requiredIds.length;

  const hasRequiredComment = !qualitativeRequired || hasQualitativeContent;
  const isComplete = answeredCount === totalRequired && hasRequiredComment;
  const percentage = totalRequired > 0 ? Math.round((answeredCount / totalRequired) * 100) : 0;

  return (
    <div className="sticky top-0 z-20 -mx-4 space-y-2 border-b border-border/60 bg-background px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
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

export const QuestionnaireFormProgress = memo(QuestionnaireFormProgressBase);
