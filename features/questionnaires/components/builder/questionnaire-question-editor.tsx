"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderValidationIssue,
} from "@/features/questionnaires/types";

type QuestionnaireQuestionEditorProps = {
  questions: QuestionnaireBuilderQuestionNode[];
  questionIssues: Record<string, QuestionnaireBuilderValidationIssue[]>;
  onUpdateQuestion: (
    questionId: string,
    updates: Partial<Pick<QuestionnaireBuilderQuestionNode, "prompt">>
  ) => void;
  onRemoveQuestion: (questionId: string) => void;
};

export function QuestionnaireQuestionEditor({
  questions,
  questionIssues,
  onUpdateQuestion,
  onRemoveQuestion,
}: QuestionnaireQuestionEditorProps) {
  return (
    <div className="space-y-4">
      {questions.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-5 text-sm text-muted-foreground">
          Add at least one question to this leaf section.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => {
            const issues = questionIssues[question.id] ?? [];

            return (
              <div key={question.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="shrink-0 text-sm font-medium text-muted-foreground">
                        {index + 1}.
                      </p>
                      <Input
                        id={`question-${question.id}`}
                        className="min-w-0"
                        value={question.prompt}
                        aria-invalid={issues.some(
                          (issue) => issue.target.type === "question" && issue.target.field === "prompt"
                        )}
                        placeholder="Enter the statement that students will rate."
                        aria-label={`Question ${index + 1} prompt`}
                        onChange={(event) =>
                          onUpdateQuestion(question.id, {
                            prompt: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-9 shrink-0 p-0"
                    onClick={() => onRemoveQuestion(question.id)}
                    aria-label={`Remove question ${index + 1}`}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
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
