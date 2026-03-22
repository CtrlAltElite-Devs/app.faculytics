"use client";

import { memo } from "react";

import { cn } from "@/lib/utils";
import type {
  BuilderQuestionType,
  QuestionnaireBuilderPreviewQuestion,
  QuestionnaireFormAnswers,
  QuestionnaireFormMode,
} from "@/features/questionnaires/types";

const LIKERT_HEADERS = ["1", "2", "3", "4", "5"] as const;
const YES_NO_HEADERS = ["Yes", "No"] as const;
const YES_NO_VALUE_MAP: Record<string, number> = { Yes: 5, No: 1 };
const YES_NO_REVERSE_MAP: Record<number, string> = { 5: "Yes", 1: "No" };

type QuestionnaireFormMatrixProps = {
  questions: QuestionnaireBuilderPreviewQuestion[];
  questionType: BuilderQuestionType;
  mode: QuestionnaireFormMode;
  answers: QuestionnaireFormAnswers;
  onAnswer: (questionId: string, value: number) => void;
};

function MatrixRadio({
  checked,
  disabled,
  onClick,
  ariaLabel,
}: {
  checked: boolean;
  disabled: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-input shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        checked && "border-primary",
      )}
    >
      {checked && (
        <span className="block size-2 rounded-full bg-primary" />
      )}
    </button>
  );
}

function QuestionnaireFormMatrixBase({
  questions,
  questionType,
  mode,
  answers,
  onAnswer,
}: QuestionnaireFormMatrixProps) {
  const isLikert = questionType === "LIKERT_1_5";
  const headers = isLikert ? LIKERT_HEADERS : YES_NO_HEADERS;
  const disabled = mode === "preview";

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th
              scope="col"
              className="px-3 py-2 text-left text-sm font-medium text-muted-foreground"
            >
              <span className="sr-only">Question</span>
            </th>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="w-14 px-2 py-2 text-center text-sm font-medium text-muted-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => {
            const currentValue = answers[question.id];
            const selectedKey = isLikert
              ? currentValue?.toString() ?? ""
              : YES_NO_REVERSE_MAP[currentValue] ?? "";

            return (
              <tr
                key={question.id}
                role="radiogroup"
                aria-label={question.prompt || "Untitled question"}
                className="border-b last:border-b-0 transition-colors hover:bg-muted/50"
              >
                <th
                  scope="row"
                  className="px-3 py-3 text-left text-sm font-normal"
                >
                  {question.prompt || "Untitled question"}
                </th>
                {headers.map((option) => {
                  const checked = selectedKey === option;
                  const numericValue = isLikert
                    ? Number(option)
                    : YES_NO_VALUE_MAP[option];

                  return (
                    <td
                      key={option}
                      className="w-14 px-2 py-3 text-center"
                    >
                      <MatrixRadio
                        checked={checked}
                        disabled={disabled}
                        onClick={() => onAnswer(question.id, numericValue)}
                        ariaLabel={
                          isLikert ? `Rating ${option}` : option
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const QuestionnaireFormMatrix = memo(QuestionnaireFormMatrixBase);
