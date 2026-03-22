"use client";

import { memo } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type {
  BuilderQuestionType,
  QuestionnaireBuilderPreviewQuestion,
  QuestionnaireFormAnswers,
  QuestionnaireFormMode,
} from "@/features/questionnaires/types";

const LIKERT_OPTIONS = ["1", "2", "3", "4", "5"] as const;
const YES_NO_OPTIONS = ["Yes", "No"] as const;
const YES_NO_VALUE_MAP: Record<string, number> = { Yes: 5, No: 1 };
const YES_NO_REVERSE_MAP: Record<number, string> = { 5: "Yes", 1: "No" };

type QuestionnaireFormStackedProps = {
  questions: QuestionnaireBuilderPreviewQuestion[];
  questionType: BuilderQuestionType;
  mode: QuestionnaireFormMode;
  answers: QuestionnaireFormAnswers;
  onAnswer: (questionId: string, value: number) => void;
};

function QuestionnaireFormStackedBase({
  questions,
  questionType,
  mode,
  answers,
  onAnswer,
}: QuestionnaireFormStackedProps) {
    const isLikert = questionType === "LIKERT_1_5";
    const disabled = mode === "preview";

    return (
      <div className="space-y-5">
        {questions.map((question) => {
          const currentValue = answers[question.id];
          const radioValue = isLikert
            ? currentValue?.toString() ?? ""
            : YES_NO_REVERSE_MAP[currentValue] ?? "";

          return (
            <div key={question.id} className="space-y-2.5 text-center">
              <p className="text-sm font-medium">
                {question.prompt || "Untitled question"}
              </p>

              <RadioGroup
                value={radioValue}
                onValueChange={(val) => {
                  if (disabled) return;
                  const numericValue = isLikert
                    ? Number(val)
                    : YES_NO_VALUE_MAP[val];
                  onAnswer(question.id, numericValue);
                }}
                disabled={disabled}
                aria-label={question.prompt || "Untitled question"}
                className="flex flex-wrap justify-center gap-2"
              >
                {isLikert
                  ? LIKERT_OPTIONS.map((option) => (
                      <Label
                        key={option}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
                      >
                        <RadioGroupItem value={option} className="sr-only" />
                        <span className="font-medium">{option}</span>
                      </Label>
                    ))
                  : YES_NO_OPTIONS.map((option) => (
                      <Label
                        key={option}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
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
