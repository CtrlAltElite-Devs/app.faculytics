"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  QuestionnaireBuilderPreviewModel,
  QuestionnaireBuilderPreviewSection,
  QuestionnaireFormAnswers,
  QuestionnaireFormMode,
  QuestionnaireFormValues,
} from "@/features/questionnaires/types";

import { QuestionnaireFormProgress } from "./questionnaire-form-progress";
import { QuestionnaireFormQualitative } from "./questionnaire-form-qualitative";
import { QuestionnaireFormSection } from "./questionnaire-form-section";

type QuestionnaireFormRendererProps = {
  model: QuestionnaireBuilderPreviewModel;
  mode: QuestionnaireFormMode;
  defaultValues?: Partial<QuestionnaireFormValues>;
  onChange?: (values: QuestionnaireFormValues) => void;
};

function collectRequiredQuestionIds(
  sections: QuestionnaireBuilderPreviewSection[],
): string[] {
  return sections.flatMap((section) => {
    if (section.questions.length > 0) {
      return section.questions
        .filter((q) => q.required)
        .map((q) => q.id);
    }
    return collectRequiredQuestionIds(section.children);
  });
}

export function QuestionnaireFormRenderer({
  model,
  mode,
  defaultValues,
  onChange,
}: QuestionnaireFormRendererProps) {
  const [answers, setAnswers] = useState<QuestionnaireFormAnswers>(
    defaultValues?.answers ?? {},
  );
  const [qualitativeComment, setQualitativeComment] = useState<string>(
    defaultValues?.qualitativeComment ?? "",
  );

  const requiredQuestionIds = useMemo(
    () => collectRequiredQuestionIds(model.sections),
    [model.sections],
  );

  const answeredCount = useMemo(
    () => requiredQuestionIds.filter((id) => id in answers).length,
    [requiredQuestionIds, answers],
  );

  const totalRequired = requiredQuestionIds.length;

  const isComplete = useMemo(
    () =>
      answeredCount === totalRequired &&
      (!model.qualitative.required ||
        qualitativeComment.trim().length > 0),
    [answeredCount, totalRequired, model.qualitative.required, qualitativeComment],
  );

  const isInteractive = mode === "interactive";

  // Stable callback for child components
  const handleAnswer = useCallback(
    (questionId: string, value: number) => {
      if (!isInteractive) return;
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    [isInteractive],
  );

  const handleCommentChange = useCallback(
    (value: string) => {
      if (!isInteractive) return;
      setQualitativeComment(value);
    },
    [isInteractive],
  );

  // Fire onChange whenever values change (interactive mode only)
  useEffect(() => {
    if (!isInteractive || !onChange) return;
    onChange({ answers, qualitativeComment });
  }, [answers, qualitativeComment, isInteractive, onChange]);

  return (
    <div className="space-y-5">
      {isInteractive && (
        <QuestionnaireFormProgress
          answeredCount={answeredCount}
          totalRequired={totalRequired}
          isComplete={isComplete}
        />
      )}

      {model.sections.map((section) => (
        <QuestionnaireFormSection
          key={section.id}
          section={section}
          mode={mode}
          answers={answers}
          onAnswer={handleAnswer}
        />
      ))}

      {model.qualitative.enabled && (
        <QuestionnaireFormQualitative
          config={model.qualitative}
          mode={mode}
          value={qualitativeComment}
          onChangeComment={handleCommentChange}
        />
      )}
    </div>
  );
}
