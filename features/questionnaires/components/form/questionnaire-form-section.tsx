"use client";

import { memo, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import type {
  QuestionnaireBuilderPreviewSection,
  QuestionnaireFormMode,
} from "@/features/questionnaires/types";

import { QuestionnaireFormMatrix } from "./questionnaire-form-matrix";
import { QuestionnaireFormStacked } from "./questionnaire-form-stacked";
import { useAnsweredCountFor } from "./questionnaire-form-store";

type QuestionnaireFormSectionProps = {
  section: QuestionnaireBuilderPreviewSection;
  mode: QuestionnaireFormMode;
  /** Hide the question counter on child sections to avoid duplication with the parent. */
  hideCounter?: boolean;
  /** When true, renders without the card wrapper (border/bg/padding). Used for child sections. */
  isChild?: boolean;
};

/**
 * Recursively collects all question IDs within a section (including nested children).
 * Used to derive which answers belong to this section for progress tracking.
 */
function collectQuestionIds(section: QuestionnaireBuilderPreviewSection): string[] {
  if (section.questions.length > 0) {
    return section.questions.map((q) => q.id);
  }
  return section.children.flatMap(collectQuestionIds);
}

function QuestionnaireFormSectionBase({
  section,
  mode,
  hideCounter = false,
  isChild = false,
}: QuestionnaireFormSectionProps) {
  const questionIds = useMemo(() => collectQuestionIds(section), [section]);
  const answeredCount = useAnsweredCountFor(questionIds);
  const totalQuestions = questionIds.length;

  const isLeaf = section.questions.length > 0;
  const isInternal = section.children.length > 0;

  const questionType = isLeaf ? (section.questions[0]?.type ?? "LIKERT_1_5") : "LIKERT_1_5";

  const isSectionComplete = answeredCount === totalQuestions && totalQuestions > 0;

  return (
    <div
      className={
        isChild ? "space-y-4 pl-3 sm:pl-6" : "space-y-4 rounded-2xl border bg-background p-4 sm:p-5"
      }
    >
      <div
        className={
          "flex flex-wrap items-center justify-between gap-x-3 gap-y-2 " +
          (isChild ? "" : "border-b border-border/50 pb-3 sm:pb-4")
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-playfair text-xl leading-tight font-semibold tracking-tight text-foreground sm:text-2xl">
            {section.title}
          </h3>
          {section.weight !== null && mode === "preview" && (
            <Badge variant="outline">Weight: {section.weight}%</Badge>
          )}
        </div>
        {mode === "interactive" && totalQuestions > 0 && !hideCounter && (
          <span
            className={
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold tabular-nums transition-colors " +
              (isSectionComplete
                ? "border-brand-blue/40 bg-brand-blue/10 text-brand-blue"
                : "border-border bg-muted/40 text-muted-foreground")
            }
          >
            <span
              aria-hidden="true"
              className={
                "size-1.5 rounded-full " +
                (isSectionComplete ? "bg-brand-blue" : "bg-muted-foreground/40")
              }
            />
            {answeredCount} / {totalQuestions}
          </span>
        )}
      </div>

      {isLeaf && (
        <>
          <div className="hidden md:block">
            <QuestionnaireFormMatrix
              questions={section.questions}
              questionType={questionType}
              mode={mode}
            />
          </div>
          <div className="md:hidden">
            <QuestionnaireFormStacked
              questions={section.questions}
              questionType={questionType}
              mode={mode}
            />
          </div>
        </>
      )}

      {isInternal && (
        <div className="space-y-4">
          {section.children.map((child) => (
            <QuestionnaireFormSection
              key={child.id}
              section={child}
              mode={mode}
              hideCounter
              isChild
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const QuestionnaireFormSection = memo(QuestionnaireFormSectionBase);
