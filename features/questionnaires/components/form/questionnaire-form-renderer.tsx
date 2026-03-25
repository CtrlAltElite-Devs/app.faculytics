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
  /** The questionnaire data to render (sections, questions, qualitative config). */
  model: QuestionnaireBuilderPreviewModel;
  /** "preview" disables all inputs; "interactive" enables answering. */
  mode: QuestionnaireFormMode;
  /** Pre-fill the form with saved draft data. Only used in interactive mode. */
  defaultValues?: Partial<QuestionnaireFormValues>;
  /** Called whenever a form value changes. Only fires in interactive mode. */
  onChange?: (values: QuestionnaireFormValues) => void;
  /** Optional slot rendered beside the progress percentage (e.g. draft status badge). */
  progressTrailing?: React.ReactNode;
};

/**
 * Recursively collects IDs of all required questions across all sections.
 * Used to track completion progress (how many required questions are answered).
 */
function collectRequiredQuestionIds(sections: QuestionnaireBuilderPreviewSection[]): string[] {
  return sections.flatMap((section) => {
    // Leaf section: has questions directly
    if (section.questions.length > 0) {
      return section.questions.filter((q) => q.required).map((q) => q.id);
    }
    // Parent section: recurse into children
    return collectRequiredQuestionIds(section.children);
  });
}

export function QuestionnaireFormRenderer({
  model,
  mode,
  defaultValues,
  onChange,
  progressTrailing,
}: QuestionnaireFormRendererProps) {
  const isInteractive = mode === "interactive";

  // --- Form state ---
  const [answers, setAnswers] = useState<QuestionnaireFormAnswers>(defaultValues?.answers ?? {});
  const [qualitativeComment, setQualitativeComment] = useState<string>(
    defaultValues?.qualitativeComment ?? ""
  );

  // --- Completion tracking ---
  const requiredQuestionIds = useMemo(
    () => collectRequiredQuestionIds(model.sections),
    [model.sections]
  );

  const answeredCount = useMemo(
    () => requiredQuestionIds.filter((id) => id in answers).length,
    [requiredQuestionIds, answers]
  );

  const totalRequired = requiredQuestionIds.length;

  const hasAnsweredAllQuestions = answeredCount === totalRequired;
  const hasRequiredComment = !model.qualitative.required || qualitativeComment.trim().length > 0;
  const isComplete = hasAnsweredAllQuestions && hasRequiredComment;

  // --- Callbacks (stable references for memoized children) ---
  const handleAnswer = useCallback(
    (questionId: string, value: number) => {
      if (!isInteractive) return;
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    [isInteractive]
  );

  const handleCommentChange = useCallback(
    (value: string) => {
      if (!isInteractive) return;
      setQualitativeComment(value);
    },
    [isInteractive]
  );

  // Notify the parent whenever form values change
  useEffect(() => {
    if (!isInteractive || !onChange) return;
    onChange({ answers, qualitativeComment });
  }, [answers, qualitativeComment, isInteractive, onChange]);

  // --- Render ---
  return (
    <div className="space-y-5">
      {isInteractive && (
        <QuestionnaireFormProgress
          answeredCount={answeredCount}
          totalRequired={totalRequired}
          isComplete={isComplete}
          trailing={progressTrailing}
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
