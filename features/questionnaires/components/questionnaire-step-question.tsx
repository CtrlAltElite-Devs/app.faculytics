"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { QuestionnaireBuilderPreviewQuestion } from "@/features/questionnaires/types";

const LIKERT_OPTIONS = [
  { label: "1", description: "Strongly disagree" },
  { label: "2", description: "Disagree" },
  { label: "3", description: "Neutral" },
  { label: "4", description: "Agree" },
  { label: "5", description: "Strongly agree" },
] as const;

export type QuestionnaireStepQuestionProps = {
  question: QuestionnaireBuilderPreviewQuestion;
  disabled?: boolean;
};

export function QuestionnaireStepQuestion({
  question,
  disabled = true,
}: QuestionnaireStepQuestionProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="font-medium">{question.prompt || "Untitled question"}</p>
        <p className="text-sm text-muted-foreground">
          {question.type === "LIKERT_1_5"
            ? "Students will answer on a 1 to 5 scale."
            : "Students will answer yes or no."}
        </p>
      </div>

      {question.type === "LIKERT_1_5" ? (
        <RadioGroup className="grid gap-2 sm:grid-cols-5" value="">
          {LIKERT_OPTIONS.map((option) => (
            <Label
              key={option.label}
              className="flex items-center gap-3 rounded-xl border px-3 py-3"
            >
              <RadioGroupItem value={option.label} disabled={disabled} />
              <span className="text-sm">
                <span className="font-medium">{option.label}</span>
                <span className="ml-2 text-muted-foreground">{option.description}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>
      ) : (
        <RadioGroup className="grid gap-2 sm:grid-cols-2" value="">
          {["Yes", "No"].map((option) => (
            <Label key={option} className="flex items-center gap-3 rounded-xl border px-3 py-3">
              <RadioGroupItem value={option} disabled={disabled} />
              <span className="text-sm font-medium">{option}</span>
            </Label>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}
