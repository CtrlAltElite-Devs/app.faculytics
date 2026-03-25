"use client";

import { memo, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import type {
  QuestionnaireBuilderPreviewSection,
  QuestionnaireFormAnswers,
  QuestionnaireFormMode,
} from "@/features/questionnaires/types";

import { QuestionnaireFormMatrix } from "./questionnaire-form-matrix";
import { QuestionnaireFormStacked } from "./questionnaire-form-stacked";

type QuestionnaireFormSectionProps = {
  section: QuestionnaireBuilderPreviewSection;
  mode: QuestionnaireFormMode;
  answers: QuestionnaireFormAnswers;
  onAnswer: (questionId: string, value: number) => void;
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
  answers,
  onAnswer,
  hideCounter = false,
  isChild = false,
}: QuestionnaireFormSectionProps) {
  const questionIds = useMemo(() => collectQuestionIds(section), [section]);

  // Extract only the answers that belong to this section's questions.
  // This prevents unnecessary re-renders of sibling sections when an answer changes.
  const sectionAnswers = useMemo(() => {
    const filtered: QuestionnaireFormAnswers = {};
    for (const id of questionIds) {
      if (id in answers) {
        filtered[id] = answers[id];
      }
    }
    return filtered;
  }, [questionIds, answers]);

  const answeredCount = Object.keys(sectionAnswers).length;
  const totalQuestions = questionIds.length;

  // A "leaf" section contains questions directly.
  // An "internal" section contains child sections (subsections) instead.
  const isLeaf = section.questions.length > 0;
  const isInternal = section.children.length > 0;

  // All questions within a leaf section share the same type (enforced by the builder).
  const questionType = isLeaf ? (section.questions[0]?.type ?? "LIKERT_1_5") : "LIKERT_1_5";

  return (
    <div
      className={
        isChild ? "space-y-4 pl-4 sm:pl-6" : "space-y-4 rounded-2xl border bg-background p-4 sm:p-5"
      }
    >
      {/* Section header: title + weight badge (preview) or progress count (interactive) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-playfair text-lg font-semibold sm:text-xl">{section.title}</h3>
          {section.weight !== null && mode === "preview" && (
            <Badge variant="outline">Weight: {section.weight}%</Badge>
          )}
        </div>
        {mode === "interactive" && totalQuestions > 0 && !hideCounter && (
          <span className="text-xs text-muted-foreground">
            {answeredCount} / {totalQuestions}
          </span>
        )}
      </div>

      {/* Leaf section: show matrix table on desktop, stacked pills on mobile */}
      {isLeaf && (
        <>
          <div className="hidden md:block">
            <QuestionnaireFormMatrix
              questions={section.questions}
              questionType={questionType}
              mode={mode}
              answers={sectionAnswers}
              onAnswer={onAnswer}
            />
          </div>
          <div className="md:hidden">
            <QuestionnaireFormStacked
              questions={section.questions}
              questionType={questionType}
              mode={mode}
              answers={sectionAnswers}
              onAnswer={onAnswer}
            />
          </div>
        </>
      )}

      {/* Internal section: recursively render child sections */}
      {isInternal && (
        <div className="space-y-4">
          {section.children.map((child) => (
            <QuestionnaireFormSection
              key={child.id}
              section={child}
              mode={mode}
              answers={answers}
              onAnswer={onAnswer}
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
