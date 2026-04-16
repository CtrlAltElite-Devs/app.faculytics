"use client";

import { memo } from "react";

import { cn } from "@/lib/utils";
import {
  LIKERT_OPTIONS,
  YES_NO_OPTIONS,
  YES_NO_VALUE_MAP,
  YES_NO_REVERSE_MAP,
} from "@/features/questionnaires/constants/builder";
import type {
  BuilderQuestionType,
  QuestionnaireBuilderPreviewQuestion,
  QuestionnaireFormMode,
} from "@/features/questionnaires/types";

import { useFormActions, useQuestionAnswer } from "./questionnaire-form-store";

type QuestionnaireFormMatrixProps = {
  questions: QuestionnaireBuilderPreviewQuestion[];
  questionType: BuilderQuestionType;
  mode: QuestionnaireFormMode;
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
        "relative aspect-square size-4 shrink-0 rounded-full border border-input shadow-xs transition-[color,box-shadow] outline-none cursor-pointer focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        checked && "border-blue-500"
      )}
    >
      {checked && (
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500" />
      )}
    </button>
  );
}

function getSelectedOptionKey(value: number | undefined, isLikert: boolean): string {
  if (value === undefined) return "";
  return isLikert ? value.toString() : YES_NO_REVERSE_MAP[value];
}

function getNumericValue(option: string, isLikert: boolean): number {
  return isLikert ? Number(option) : YES_NO_VALUE_MAP[option];
}

type MatrixRowProps = {
  question: QuestionnaireBuilderPreviewQuestion;
  isLikert: boolean;
  options: readonly string[];
  disabled: boolean;
  isInteractive: boolean;
};

function MatrixRowBase({ question, isLikert, options, disabled, isInteractive }: MatrixRowProps) {
  const value = useQuestionAnswer(question.id);
  const { setAnswer } = useFormActions();

  const selectedKey = getSelectedOptionKey(value, isLikert);
  const questionLabel = question.prompt || "Untitled question";

  return (
    <tr
      role="radiogroup"
      aria-label={questionLabel}
      className="border-b transition-colors last:border-b-0 hover:bg-muted/50"
    >
      <th scope="row" className="px-3 py-3 text-left text-sm font-normal">
        {questionLabel}
      </th>
      {options.map((option) => {
        const isSelected = selectedKey === option;
        return (
          <td key={option} className="w-14 px-2 py-3">
            <div className="flex justify-center">
              <MatrixRadio
                checked={isSelected}
                disabled={disabled}
                onClick={() => {
                  if (!isInteractive) return;
                  setAnswer(question.id, getNumericValue(option, isLikert));
                }}
                ariaLabel={isLikert ? `Rating ${option}` : option}
              />
            </div>
          </td>
        );
      })}
    </tr>
  );
}

const MatrixRow = memo(MatrixRowBase);

/**
 * Desktop Likert matrix table.
 *
 * Renders questions as rows and scale options (1-5 or Yes/No) as columns.
 * Each row is a radio group — selecting an option records the answer.
 */
function QuestionnaireFormMatrixBase({
  questions,
  questionType,
  mode,
}: QuestionnaireFormMatrixProps) {
  const isLikert = questionType === "LIKERT_1_5";
  const options = isLikert ? LIKERT_OPTIONS : YES_NO_OPTIONS;
  const disabled = mode === "preview";
  const isInteractive = mode === "interactive";

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
            {options.map((option) => (
              <th
                key={option}
                scope="col"
                className="w-14 px-2 py-2 text-center text-sm font-medium text-muted-foreground"
              >
                {option}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <MatrixRow
              key={question.id}
              question={question}
              isLikert={isLikert}
              options={options}
              disabled={disabled}
              isInteractive={isInteractive}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const QuestionnaireFormMatrix = memo(QuestionnaireFormMatrixBase);
