"use client";

import { memo } from "react";
import { Check } from "lucide-react";

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

const LIKERT_LABELS: Record<string, string> = {
  "1": "Strongly Disagree",
  "2": "Disagree",
  "3": "Neutral",
  "4": "Agree",
  "5": "Strongly Agree",
};

function getSelectedOptionKey(value: number | undefined, isLikert: boolean): string {
  if (value === undefined) return "";
  return isLikert ? value.toString() : YES_NO_REVERSE_MAP[value];
}

function getNumericValue(option: string, isLikert: boolean): number {
  return isLikert ? Number(option) : YES_NO_VALUE_MAP[option];
}

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
    <ol className="space-y-4">
      {questions.map((question, index) => {
        const questionLabel = question.prompt || "Untitled question";
        const selectedKey = getSelectedOptionKey(answers[question.id], isLikert);
        const isAnswered = selectedKey !== "";

        return (
          <li
            key={question.id}
            className={cn(
              "rounded-xl border bg-card/60 p-4 transition-colors",
              isAnswered ? "border-brand-blue/40 bg-brand-blue/[0.03]" : "border-border/70"
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold tabular-nums transition-colors",
                  isAnswered
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-border text-muted-foreground"
                )}
                aria-hidden="true"
              >
                {isAnswered ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
              </span>
              <p className="text-[0.95rem] leading-snug font-medium text-foreground">
                {questionLabel}
              </p>
            </div>

            <div
              role="radiogroup"
              aria-label={questionLabel}
              className="mt-4 flex flex-col gap-1.5"
            >
              {options.map((option) => {
                const isSelected = selectedKey === option;
                const label = isLikert ? LIKERT_LABELS[option] : option;
                const ariaLabel = isLikert ? `${option} ${label}` : option;

                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={ariaLabel}
                    disabled={disabled}
                    onClick={() => onAnswer(question.id, getNumericValue(option, isLikert))}
                    className={cn(
                      "group relative flex min-h-12 w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all outline-none",
                      "focus-visible:ring-2 focus-visible:ring-brand-blue/50 focus-visible:ring-offset-1",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      isSelected
                        ? "border-brand-blue bg-brand-blue text-white shadow-sm shadow-brand-blue/20"
                        : "border-border bg-background text-foreground hover:border-brand-blue/50 hover:bg-brand-blue/5 active:scale-[0.99]"
                    )}
                  >
                    {isLikert && (
                      <span
                        className={cn(
                          "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-sm font-semibold tabular-nums transition-colors",
                          isSelected
                            ? "bg-white/15 text-white"
                            : "bg-muted text-muted-foreground group-hover:bg-brand-blue/10 group-hover:text-brand-blue"
                        )}
                        aria-hidden="true"
                      >
                        {option}
                      </span>
                    )}
                    <span className="flex-1 font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export const QuestionnaireFormStacked = memo(QuestionnaireFormStackedBase);
