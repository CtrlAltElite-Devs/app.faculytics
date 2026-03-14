"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderValidationIssue,
} from "@/types/questionnaires";

type QuestionnaireQuestionEditorProps = {
  questions: QuestionnaireBuilderQuestionNode[];
  questionIssues: Record<string, QuestionnaireBuilderValidationIssue[]>;
  onAddQuestion: () => void;
  onUpdateQuestion: (
    questionId: string,
    updates: Partial<Pick<QuestionnaireBuilderQuestionNode, "prompt" | "type">>
  ) => void;
  onRemoveQuestion: (questionId: string) => void;
};

const QUESTION_TYPE_LABELS: Record<QuestionnaireBuilderQuestionNode["type"], string> = {
  LIKERT_1_5: "Likert Scale",
  YES_NO: "Yes / No",
};

export function QuestionnaireQuestionEditor({
  questions,
  questionIssues,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
}: QuestionnaireQuestionEditorProps) {
  return (
    <div className="space-y-4 rounded-2xl border bg-background/80 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-medium">Questions</h3>
        <Button
          type="button"
          size="sm"
          className="bg-brand-blue/80 text-white hover:bg-brand-blue/70"
          onClick={onAddQuestion}
        >
          Add question
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-5 text-sm text-muted-foreground">
          Add at least one question to this leaf section.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => {
            const issues = questionIssues[question.id] ?? [];

            return (
              <div key={question.id} className="space-y-3 rounded-xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Question {index + 1}</p>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveQuestion(question.id)}
                  >
                    Remove
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${question.id}`}>Prompt</Label>
                      <Input
                        id={`question-${question.id}`}
                        value={question.prompt}
                        aria-invalid={issues.some(
                          (issue) => issue.target.type === "question" && issue.target.field === "prompt"
                        )}
                        placeholder="Enter the statement that students will rate."
                        onChange={(event) =>
                          onUpdateQuestion(question.id, {
                            prompt: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`question-type-${question.id}`}>Question type</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            id={`question-type-${question.id}`}
                            type="button"
                            variant="outline"
                            className="w-full justify-between gap-3"
                          >
                            {QUESTION_TYPE_LABELS[question.type]}
                            <ChevronDown className="size-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="min-w-48">
                          <DropdownMenuRadioGroup
                            value={question.type}
                            onValueChange={(value) =>
                              onUpdateQuestion(question.id, {
                                type: value as QuestionnaireBuilderQuestionNode["type"],
                              })
                            }
                          >
                            <DropdownMenuRadioItem value="LIKERT_1_5">
                              {QUESTION_TYPE_LABELS.LIKERT_1_5}
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="YES_NO">
                              {QUESTION_TYPE_LABELS.YES_NO}
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {issues.length > 0 && (
                  <p className="text-sm text-destructive">{issues[0]?.message}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
