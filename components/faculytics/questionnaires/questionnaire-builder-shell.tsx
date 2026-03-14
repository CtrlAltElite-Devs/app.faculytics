"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { QuestionnaireAddActionButton } from "@/components/faculytics/questionnaires/questionnaire-add-action-button";
import { QuestionnaireOutlinePanel } from "@/components/faculytics/questionnaires/questionnaire-outline-panel";
import { QuestionnaireQualitativeEditor } from "@/components/faculytics/questionnaires/questionnaire-qualitative-editor";
import { QuestionnaireSectionEditor } from "@/components/faculytics/questionnaires/questionnaire-section-editor";
import { QuestionnaireTypeButtonGroup } from "@/components/faculytics/questionnaires/questionnaire-type-button-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InlineEditInput } from "@/components/ui/inline-edit-input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { buildQuestionnairePreviewModel } from "@/lib/questionnaires/builder-serializer";
import {
  canConvertSectionToParent,
  findSectionById,
  getSectionLevel,
  validateQuestionnaireBuilderDraft,
} from "@/lib/questionnaires/builder-validator";
import { useSaveQuestionnaireBuilder } from "@/hooks/questionnaires/use-save-questionnaire-builder";
import { useQuestionnaireBuilderStore } from "@/stores/questionnaire-builder-store";
import type {
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderSectionNode,
  QuestionnaireType,
  QuestionnaireVersionsResponse,
} from "@/types/questionnaires";
import { MAX_SECTION_NESTING_LEVEL } from "@/types/questionnaires";

type QuestionnaireBuilderShellProps = {
  availableTypes: QuestionnaireType[];
  activeType: QuestionnaireType;
  onTypeChange: (type: QuestionnaireType) => void;
  serverContext: QuestionnaireVersionsResponse;
  isHydrated: boolean;
};

export function QuestionnaireBuilderShell({
  availableTypes,
  activeType,
  onTypeChange,
  serverContext,
  isHydrated,
}: QuestionnaireBuilderShellProps) {
  const draft = useQuestionnaireBuilderStore((state) => state.drafts[activeType] ?? null);
  const updateTitle = useQuestionnaireBuilderStore((state) => state.updateTitle);
  const selectSection = useQuestionnaireBuilderStore((state) => state.selectSection);
  const addRootSection = useQuestionnaireBuilderStore((state) => state.addRootSection);
  const addChildSection = useQuestionnaireBuilderStore((state) => state.addChildSection);
  const updateSection = useQuestionnaireBuilderStore((state) => state.updateSection);
  const removeSection = useQuestionnaireBuilderStore((state) => state.removeSection);
  const moveSection = useQuestionnaireBuilderStore((state) => state.moveSection);
  const addQuestion = useQuestionnaireBuilderStore((state) => state.addQuestion);
  const updateQuestion = useQuestionnaireBuilderStore((state) => state.updateQuestion);
  const removeQuestion = useQuestionnaireBuilderStore((state) => state.removeQuestion);
  const updateQualitative = useQuestionnaireBuilderStore((state) => state.updateQualitative);
  const resetActiveDraft = useQuestionnaireBuilderStore((state) => state.resetActiveDraft);
  const { save, isPending } = useSaveQuestionnaireBuilder();
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [pendingParentId, setPendingParentId] = useState<string | null>(null);

  useEffect(() => {
    if (!draft || draft.selectedSectionId || draft.sections.length === 0) {
      return;
    }

    selectSection(draft.sections[0]?.id ?? null);
  }, [draft, selectSection]);

  if (!isHydrated || !draft) {
    return <Card className="p-6 text-sm text-muted-foreground">Loading builder draft...</Card>;
  }

  const validation = validateQuestionnaireBuilderDraft(draft);
  const previewModel = buildQuestionnairePreviewModel(draft);
  const pendingConversionState = canConvertSectionToParent(
    pendingParentId ? findSectionById(draft.sections, pendingParentId) : null
  );

  const requestAddChild = (sectionId: string) => {
    const section = findSectionById(draft.sections, sectionId);
    const sectionLevel = getSectionLevel(draft.sections, sectionId);
    const conversionState = canConvertSectionToParent(section);

    if (sectionLevel === null || sectionLevel >= MAX_SECTION_NESTING_LEVEL) {
      return;
    }

    if (conversionState.requiresConfirmation) {
      setPendingParentId(sectionId);
      return;
    }

    addChildSection(sectionId);
  };

  const handleUpdateSection = (
    sectionId: string,
    updates: Partial<Pick<QuestionnaireBuilderSectionNode, "title" | "weight" | "questionType">>
  ) => {
    updateSection(sectionId, updates);
  };

  const handleUpdateQuestion = (
    sectionId: string,
    questionId: string,
    updates: Partial<Pick<QuestionnaireBuilderQuestionNode, "prompt" | "type">>
  ) => {
    updateQuestion(sectionId, questionId, updates);
  };

  const handleSelectSection = (sectionId: string) => {
    selectSection(sectionId);
    const targetId =
      sectionId === "qualitative" ? "qualitative-editor" : `section-editor-${sectionId}`;

    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <div>
                  <CardTitle className="font-playfair text-xl">Draft setup</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select a questionnaire type, edit the structure, and save a draft version.
                  </p>
                </div>
                <QuestionnaireTypeButtonGroup
                  types={availableTypes}
                  value={activeType}
                  onValueChange={onTypeChange}
                />
              </div>

              <div className="flex flex-col gap-3 xl:items-end">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
                  <Button asChild variant="outline">
                    <Link href={`/superadmin/questionnaires/new/preview?type=${previewModel.type}`}>
                      Open preview
                    </Link>
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDiscardDialogOpen(true)}>
                    Discard draft
                  </Button>
                  <Button
                    type="button"
                    className="bg-brand-blue/80 text-white hover:bg-brand-blue/70"
                    disabled={isPending}
                    onClick={() => void save()}
                  >
                    {isPending ? "Saving..." : "Save draft"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <Badge variant="outline">
                    {serverContext.versions.length} version{serverContext.versions.length === 1 ? "" : "s"}
                  </Badge>
                  <Badge variant="outline">Weight total {validation.totalLeafWeight}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              {draft.metadata.titleLocked ? (
                <>
                  <p className="text-sm font-medium leading-none">Questionnaire title</p>
                  <div className="rounded-xl border bg-muted/40 px-4 py-3">
                    <p className="font-medium">{draft.metadata.questionnaireTitle}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This title is inherited from the existing questionnaire root and cannot be
                      renamed from the version builder.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Label htmlFor="questionnaire-title">Questionnaire title</Label>
                  <InlineEditInput
                    id="questionnaire-title"
                    value={draft.metadata.title}
                    placeholder="Enter the questionnaire title"
                    textClassName="min-h-10 border border-input bg-background font-medium"
                    inputClassName="font-medium"
                    onChange={updateTitle}
                  />
                </>
              )}
            </div>

            {validation.issues.length > 0 ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {validation.issues[0]?.message}
              </div>
            ) : (
              <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 px-4 py-3 text-sm text-brand-blue">
                Draft is ready to save. Preview remains superadmin-only until a version is
                published through future lifecycle actions.
              </div>
            )}

          </CardContent>
        </Card>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,2.2fr)]">
          <div className="lg:sticky lg:top-4">
            <QuestionnaireOutlinePanel
              sections={draft.sections}
              selectedSectionId={draft.selectedSectionId}
              sectionIssues={validation.sectionIssues}
              qualitative={draft.qualitative}
              qualitativeIssues={validation.qualitativeIssues}
              onSelect={handleSelectSection}
              onAddRoot={addRootSection}
              onAddChild={requestAddChild}
              onMove={moveSection}
              onRemove={removeSection}
            />
          </div>

          <div className="space-y-6">
            {draft.sections.length === 0 ? (
              <QuestionnaireAddActionButton
                label="Add Section"
                onClick={addRootSection}
              />
            ) : (
              <>
                {draft.sections.map((section) => (
                  <QuestionnaireSectionEditor
                    key={section.id}
                    section={section}
                    sectionIssues={validation.sectionIssues[section.id] ?? []}
                    allSectionIssues={validation.sectionIssues}
                    questionIssues={validation.questionIssues}
                    selectedSectionId={draft.selectedSectionId}
                    isSelected={section.id === draft.selectedSectionId}
                    onUpdateSection={handleUpdateSection}
                    onAddChild={requestAddChild}
                    onMove={moveSection}
                    onRemove={removeSection}
                    onAddQuestion={addQuestion}
                    onUpdateQuestion={handleUpdateQuestion}
                    onRemoveQuestion={removeQuestion}
                  />
                ))}
                <QuestionnaireAddActionButton
                  label="Add Section"
                  onClick={addRootSection}
                />
              </>
            )}

            <div className="space-y-4 pt-2">
              <Separator />
              <QuestionnaireQualitativeEditor
                value={draft.qualitative}
                issues={validation.qualitativeIssues}
                onChange={updateQualitative}
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard this local draft?</DialogTitle>
            <DialogDescription>
              This clears the saved builder draft for the active questionnaire type and resets the
              authoring surface to a clean state.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDiscardDialogOpen(false)}>
              Keep editing
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                resetActiveDraft();
                setDiscardDialogOpen(false);
              }}
            >
              Discard draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(pendingParentId)} onOpenChange={(open) => !open && setPendingParentId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert this section into a parent section?</DialogTitle>
            <DialogDescription>
              Adding a subsection will remove the questions currently created in this section.
              {pendingConversionState.questionCount > 0
                ? ` ${pendingConversionState.questionCount} question${
                    pendingConversionState.questionCount === 1 ? "" : "s"
                  } will be removed.`
                : ""}
              {pendingConversionState.hasWeight
                ? " This section weight will also be cleared."
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPendingParentId(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (pendingParentId) {
                  addChildSection(pendingParentId);
                }
                setPendingParentId(null);
              }}
            >
              Convert section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
