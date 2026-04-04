"use client";

import { memo } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  LIKERT_OPTIONS,
  YES_NO_OPTIONS,
  YES_NO_VALUE_MAP,
  YES_NO_REVERSE_MAP,
} from "@/features/questionnaires/constants/builder";
import type {
  BuilderQuestionType,
  QuestionnaireBuilderPreviewQuestion,
  QuestionnaireFormAnswers,
  QuestionnaireFormMode,
} from "@/features/questionnaires/types";

type QuestionnaireFormStackedProps = {
  questions: QuestionnaireBuilderPreviewQuestion[];
  questionType: BuilderQuestionType;
  mode: QuestionnaireFormMode;
  answers: QuestionnaireFormAnswers;
  onAnswer: (questionId: string, value: number) => void;
};

/**
 * Converts a stored numeric answer back to the string key used by the RadioGroup.
 *
 * - Likert: numeric 4 → string "4"
 * - Yes/No: numeric 5 → string "Yes", numeric 1 → string "No"
 *
 * Returns "" if the question hasn't been answered yet.
 */
function getSelectedOptionKey(value: number | undefined, isLikert: boolean): string {
  if (value === undefined) return "";
  return isLikert ? value.toString() : YES_NO_REVERSE_MAP[value];
}

/**
 * Converts a display option string to the numeric value stored in answers.
 *
 * - Likert: "4" → 4
 * - Yes/No: "Yes" → 5, "No" → 1 (scale-aligned)
 */
function getNumericValue(option: string, isLikert: boolean): number {
  return isLikert ? Number(option) : YES_NO_VALUE_MAP[option];
}

/**
 * Mobile stacked layout for questionnaire questions.
 *
 * Renders each question as a card with selectable pill-style radio options.
 * This is the mobile counterpart to the desktop QuestionnaireFormMatrix table.
 */
function QuestionnaireFormStackedBase({
  questions,
  questionType,
  mode,
  answers,
  onAnswer,
}: QuestionnaireFormStackedProps) {
  const isLikert = questionType === "LIKERT_1_5";
  const options = isLikert ? LIKERT_OPTIONS : YES_NO_OPTIONS;
  const disabled = mode === "preview";

  return (
    <div className="space-y-5">
      {questions.map((question) => {
        const questionLabel = question.prompt || "Untitled question";
        const selectedKey = getSelectedOptionKey(answers[question.id], isLikert);

        return (
          <div key={question.id} className="space-y-2.5">
            <p className="text-sm font-medium">{questionLabel}</p>

            <RadioGroup
              value={selectedKey}
              onValueChange={(val) => {
                if (disabled) return;
                onAnswer(question.id, getNumericValue(val, isLikert));
              }}
              disabled={disabled}
              aria-label={questionLabel}
              className="flex flex-wrap justify-center gap-8"
            >
              {options.map((option) => (
                <Label
                  key={option}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
                >
                  <RadioGroupItem value={option} className="sr-only" />
                  <span className="font-medium">{option}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        );
      })}
    </div>
  );
}

export const QuestionnaireFormStacked = memo(QuestionnaireFormStackedBase);
