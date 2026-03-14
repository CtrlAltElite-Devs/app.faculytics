"use client";

import { AlertTriangle } from "lucide-react";

import { QuestionnaireQuestionEditor } from "@/components/faculytics/questionnaires/questionnaire-question-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderSectionNode,
  QuestionnaireBuilderValidationIssue,
} from "@/types/questionnaires";

type QuestionnaireSectionEditorProps = {
  section: QuestionnaireBuilderSectionNode | null;
  sectionIssues: QuestionnaireBuilderValidationIssue[];
  questionIssues: Record<string, QuestionnaireBuilderValidationIssue[]>;
  onUpdateSection: (
    sectionId: string,
    updates: Partial<Pick<QuestionnaireBuilderSectionNode, "title" | "weight">>
  ) => void;
  onAddChild: (sectionId: string) => void;
  onMove: (sectionId: string, direction: "up" | "down") => void;
  onRemove: (sectionId: string) => void;
  onAddQuestion: (sectionId: string) => void;
  onUpdateQuestion: (
    sectionId: string,
    questionId: string,
    updates: Partial<Pick<QuestionnaireBuilderQuestionNode, "prompt" | "type">>
  ) => void;
  onRemoveQuestion: (sectionId: string, questionId: string) => void;
};

export function QuestionnaireSectionEditor({
  section,
  sectionIssues,
  questionIssues,
  onUpdateSection,
  onAddChild,
  onMove,
  onRemove,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
}: QuestionnaireSectionEditorProps) {
  if (!section) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-lg">Section editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
            Select a section from the outline to edit its title, weight, and questions.
          </div>
        </CardContent>
      </Card>
    );
  }

  const isLeaf = section.children.length === 0;
  const titleIssue = sectionIssues.find(
    (issue) => issue.target.type === "section" && issue.target.field === "title"
  );
  const weightIssue = sectionIssues.find(
    (issue) => issue.target.type === "section" && issue.target.field === "weight"
  );
  const structureIssue = sectionIssues.find(
    (issue) => issue.target.type === "section" && issue.target.field === "structure"
  );

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="font-playfair text-lg">Section editor</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Parent sections organize subsections. Only leaf sections can keep weights and direct
              questions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{isLeaf ? "Leaf section" : "Parent section"}</Badge>
            <Button type="button" variant="outline" size="sm" onClick={() => onMove(section.id, "up")}>
              Move up
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onMove(section.id, "down")}
            >
              Move down
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => onAddChild(section.id)}>
              Add subsection
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={() => onRemove(section.id)}>
              Remove
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`section-title-${section.id}`}>Section title</Label>
          <Input
            id={`section-title-${section.id}`}
            value={section.title}
            aria-invalid={Boolean(titleIssue)}
            onChange={(event) =>
              onUpdateSection(section.id, {
                title: event.target.value,
              })
            }
          />
          {titleIssue && <p className="text-sm text-destructive">{titleIssue.message}</p>}
        </div>

        {isLeaf ? (
          <div className="space-y-2">
            <Label htmlFor={`section-weight-${section.id}`}>Weight</Label>
            <Input
              id={`section-weight-${section.id}`}
              type="number"
              min={1}
              max={100}
              step={1}
              value={section.weight ?? ""}
              aria-invalid={Boolean(weightIssue)}
              onChange={(event) =>
                onUpdateSection(section.id, {
                  weight: event.target.value === "" ? null : Number(event.target.value),
                })
              }
            />
            <p className="text-sm text-muted-foreground">
              Leaf section weights must total 100 across the questionnaire.
            </p>
            {weightIssue && <p className="text-sm text-destructive">{weightIssue.message}</p>}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed px-4 py-5 text-sm text-muted-foreground">
            Parent sections do not carry weights or direct questions. Add child sections instead.
          </div>
        )}

        {structureIssue && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>{structureIssue.message}</p>
          </div>
        )}

        {isLeaf ? (
          <QuestionnaireQuestionEditor
            questions={section.questions}
            questionIssues={questionIssues}
            onAddQuestion={() => onAddQuestion(section.id)}
            onUpdateQuestion={(questionId, updates) => onUpdateQuestion(section.id, questionId, updates)}
            onRemoveQuestion={(questionId) => onRemoveQuestion(section.id, questionId)}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
