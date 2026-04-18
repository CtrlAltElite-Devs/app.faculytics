"use client";

import { memo } from "react";

import { Progress } from "@/components/ui/progress";

import { useAnsweredCountFor, useHasQualitativeContent } from "./questionnaire-form-store";

type QuestionnaireFormProgressProps = {
  requiredIds: string[];
  qualitativeRequired: boolean;
  /** Optional slot rendered beside the percentage (e.g. draft status badge). */
  trailing?: React.ReactNode;
  /** When provided, displays the faculty being evaluated above the progress row. */
  facultyName?: string;
};

function QuestionnaireFormProgressBase({
  requiredIds,
  qualitativeRequired,
  trailing,
  facultyName,
}: QuestionnaireFormProgressProps) {
  const answeredCount = useAnsweredCountFor(requiredIds);
  const hasQualitativeContent = useHasQualitativeContent();
  const totalRequired = requiredIds.length;

  const hasRequiredComment = !qualitativeRequired || hasQualitativeContent;
  const isComplete = answeredCount === totalRequired && hasRequiredComment;
  const percentage = totalRequired > 0 ? Math.round((answeredCount / totalRequired) * 100) : 0;

  return (
    <div className="sticky top-0 z-20 -mx-4 space-y-2 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:mx-0">
      {facultyName && (
        <div className="flex flex-col">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-[0.68rem]">
            Evaluating
          </span>
          <span className="truncate font-playfair text-sm font-semibold leading-tight text-foreground sm:text-base">
            {facultyName}
          </span>
        </div>
      )}
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
