"use client";

import React from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export const QuestionnaireFormMatrix = React.memo(
  function QuestionnaireFormMatrix({
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
              const radioValue = isLikert
                ? currentValue?.toString() ?? ""
                : YES_NO_REVERSE_MAP[currentValue] ?? "";

              return (
                <tr
                  key={question.id}
                  className="border-b last:border-b-0 transition-colors hover:bg-muted/50"
                >
                  <th
                    scope="row"
                    className="px-3 py-3 text-left text-sm font-normal"
                  >
                    {question.prompt || "Untitled question"}
                  </th>
                  <RadioGroup
                    asChild
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
                  >
                    <>
                      {isLikert
                        ? LIKERT_HEADERS.map((option) => (
                            <td
                              key={option}
                              className="w-14 px-2 py-3 text-center"
                            >
                              <RadioGroupItem
                                value={option}
                                aria-label={`Rating ${option}`}
                              />
                            </td>
                          ))
                        : YES_NO_HEADERS.map((option) => (
                            <td
                              key={option}
                              className="w-14 px-2 py-3 text-center"
                            >
                              <RadioGroupItem
                                value={option}
                                aria-label={option}
                              />
                            </td>
                          ))}
                    </>
                  </RadioGroup>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  },
);
