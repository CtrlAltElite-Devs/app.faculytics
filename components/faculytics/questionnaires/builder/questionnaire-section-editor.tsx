"use client";

import { AlertTriangle, ArrowDown, ArrowUp, ChevronDown, MoreVertical, Trash2 } from "lucide-react";

import { QuestionnaireAddActionButton } from "@/components/faculytics/questionnaires/builder/questionnaire-add-action-button";
import { QuestionnaireQuestionEditor } from "@/components/faculytics/questionnaires/builder/questionnaire-question-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InlineEditInput } from "@/components/ui/inline-edit-input";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  BuilderQuestionType,
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderSectionNode,
  QuestionnaireBuilderValidationIssue,
} from "@/types/questionnaires";
import { MAX_SECTION_NESTING_LEVEL } from "@/types/questionnaires";

type QuestionnaireSectionEditorProps = {
  section: QuestionnaireBuilderSectionNode;
  sectionIssues: QuestionnaireBuilderValidationIssue[];
  questionIssues: Record<string, QuestionnaireBuilderValidationIssue[]>;
  allSectionIssues: Record<string, QuestionnaireBuilderValidationIssue[]>;
  selectedSectionId: string | null;
  isSelected?: boolean;
  depth?: number;
  onUpdateSection: (
    sectionId: string,
    updates: Partial<Pick<QuestionnaireBuilderSectionNode, "title" | "weight" | "questionType">>
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

const QUESTION_TYPE_LABELS: Record<BuilderQuestionType, string> = {
  LIKERT_1_5: "Likert Scale",
  YES_NO: "Yes / No",
};

export function QuestionnaireSectionEditor({
  section,
  sectionIssues,
  questionIssues,
  allSectionIssues,
  selectedSectionId,
  isSelected = false,
  depth = 0,
  onUpdateSection,
  onAddChild,
  onMove,
  onRemove,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
}: QuestionnaireSectionEditorProps) {
  const isLeaf = section.children.length === 0;
  const canAddChild = depth + 1 < MAX_SECTION_NESTING_LEVEL;
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
    <Card
      id={`section-editor-${section.id}`}
      className={cn(
        "scroll-mt-6 gap-4 min-w-0",
        isSelected && "border-brand-blue/60 ring-1 ring-brand-blue/30"
      )}
    >
      <CardHeader className="space-y-4">
        <div
          className={cn(
            "grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-4",
            isLeaf
              ? "md:grid-cols-[minmax(0,1fr)_minmax(112px,0.44fr)_88px_auto]"
              : "md:grid-cols-[minmax(0,1fr)_auto]"
          )}
        >
          <div className="min-w-0">
            <CardTitle className="font-playfair text-lg font-semibold">
              <InlineEditInput
                id={`section-title-${section.id}`}
                value={section.title}
                ariaInvalid={Boolean(titleIssue)}
                placeholder={depth > 0 ? "Enter subsection title" : "Enter section title"}
                textClassName="font-playfair text-lg font-semibold"
                inputClassName="text-lg font-semibold"
                onChange={(value) =>
                  onUpdateSection(section.id, {
                    title: value,
                  })
                }
              />
            </CardTitle>
          </div>

          {isLeaf ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  id={`section-question-type-${section.id}`}
                  type="button"
                  variant="outline"
                  className="col-span-2 min-w-0 w-full justify-between gap-3 md:col-span-1"
                  aria-label="Section question type"
                >
                  {QUESTION_TYPE_LABELS[section.questionType]}
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-48">
                <DropdownMenuRadioGroup
                  value={section.questionType}
                  onValueChange={(value) =>
                    onUpdateSection(section.id, {
                      questionType: value as BuilderQuestionType,
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
          ) : null}

          {isLeaf ? (
            <div className="col-span-2 min-w-0 space-y-2 md:col-span-1">
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
              <p className="text-xs text-muted-foreground">Weight</p>
            </div>
          ) : null}

          <div className="col-start-2 row-start-1 flex items-center justify-end md:col-start-auto md:row-start-auto">
            <div className="hidden items-center gap-1 lg:flex">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-9 p-0"
                onClick={() => onMove(section.id, "up")}
                aria-label="Move section up"
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-9 p-0"
                onClick={() => onMove(section.id, "down")}
                aria-label="Move section down"
              >
                <ArrowDown className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-9 p-0"
                onClick={() => onRemove(section.id)}
                aria-label="Delete section"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="size-9 shrink-0 p-0 lg:hidden"
                  aria-label="Section actions"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onMove(section.id, "up")}>
                  <ArrowUp className="size-4" />
                  Move Up
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMove(section.id, "down")}>
                  <ArrowDown className="size-4" />
                  Move Down
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onRemove(section.id)}
                >
                  <Trash2 className="size-4" />
                  Delete Section
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {titleIssue && <p className="text-sm text-destructive">{titleIssue.message}</p>}

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
            onUpdateQuestion={(questionId, updates) => onUpdateQuestion(section.id, questionId, updates)}
            onRemoveQuestion={(questionId) => onRemoveQuestion(section.id, questionId)}
          />
        ) : null}

        {section.children.length > 0 ? (
          <div className="space-y-4 border-t pt-6">
            {section.children.map((childSection) => (
              <QuestionnaireSectionEditor
                key={childSection.id}
                section={childSection}
                sectionIssues={allSectionIssues[childSection.id] ?? []}
                allSectionIssues={allSectionIssues}
                questionIssues={questionIssues}
                selectedSectionId={selectedSectionId}
                isSelected={childSection.id === selectedSectionId}
                depth={depth + 1}
                onUpdateSection={onUpdateSection}
                onAddChild={onAddChild}
                onMove={onMove}
                onRemove={onRemove}
                onAddQuestion={onAddQuestion}
                onUpdateQuestion={onUpdateQuestion}
                onRemoveQuestion={onRemoveQuestion}
              />
            ))}
          </div>
        ) : null}

        <div className={cn("grid gap-3", isLeaf ? "sm:grid-cols-2" : "grid-cols-1")}>
          {isLeaf ? (
            <QuestionnaireAddActionButton
              className="rounded-xl"
              label="Add Question"
              onClick={() => onAddQuestion(section.id)}
            />
          ) : null}

          <QuestionnaireAddActionButton
            className="rounded-xl"
            disabled={!canAddChild}
            label="Add Subsection"
            onClick={() => onAddChild(section.id)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
