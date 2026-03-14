"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
        <div>
          <h3 className="font-medium">Questions</h3>
          <p className="text-sm text-muted-foreground">
            Leaf sections may contain only `LIKERT_1_5` or `YES_NO` questions.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAddQuestion}>
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
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveQuestion(question.id)}
                  >
                    Remove
                  </Button>
                </div>

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
                  <Label>Question type</Label>
                  <ButtonGroup>
                    {["LIKERT_1_5", "YES_NO"].map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={question.type === type ? "default" : "outline"}
                        onClick={() =>
                          onUpdateQuestion(question.id, {
                            type: type as QuestionnaireBuilderQuestionNode["type"],
                          })
                        }
                      >
                        {type === "LIKERT_1_5" ? "Likert 1-5" : "Yes / No"}
                      </Button>
                    ))}
                  </ButtonGroup>
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
