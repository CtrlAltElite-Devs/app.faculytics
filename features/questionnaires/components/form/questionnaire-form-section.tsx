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
};

function collectQuestionIds(
  section: QuestionnaireBuilderPreviewSection,
): string[] {
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
}: QuestionnaireFormSectionProps) {
    const questionIds = useMemo(() => collectQuestionIds(section), [section]);

    const sectionAnswers = useMemo(() => {
      const slice: QuestionnaireFormAnswers = {};
      for (const id of questionIds) {
        if (id in answers) {
          slice[id] = answers[id];
        }
      }
      return slice;
    }, [questionIds, answers]);

    const answeredCount = Object.keys(sectionAnswers).length;
    const totalQuestions = questionIds.length;
    const isLeaf = section.questions.length > 0;
    const isInternal = section.children.length > 0;

    // Determine question type — leaf sections have a consistent type from the first question
    const questionType = isLeaf
      ? section.questions[0]?.type ?? "LIKERT_1_5"
      : "LIKERT_1_5";

    return (
      <div className="space-y-4 rounded-2xl border bg-background p-4 sm:p-5">
        {/* Section header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-playfair text-lg font-semibold sm:text-xl">
              {section.title}
            </h3>
            {section.weight !== null && mode === "preview" && (
              <Badge variant="outline">Weight: {section.weight}%</Badge>
            )}
          </div>
          {mode === "interactive" && totalQuestions > 0 && (
            <span className="text-xs text-muted-foreground">
              {answeredCount} / {totalQuestions}
            </span>
          )}
        </div>

        {/* Content: leaf renders matrix/stacked, internal recurses */}
        {isLeaf && (
          <>
            {/* Desktop: matrix table */}
            <div className="hidden md:block">
              <QuestionnaireFormMatrix
                questions={section.questions}
                questionType={questionType}
                mode={mode}
                answers={sectionAnswers}
                onAnswer={onAnswer}
              />
            </div>
            {/* Mobile: stacked pills */}
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

        {isInternal && (
          <div className="space-y-4">
            {section.children.map((child) => (
              <QuestionnaireFormSection
                key={child.id}
                section={child}
                mode={mode}
                answers={answers}
                onAnswer={onAnswer}
              />
            ))}
          </div>
        )}
      </div>
    );
}

export const QuestionnaireFormSection = memo(QuestionnaireFormSectionBase);
