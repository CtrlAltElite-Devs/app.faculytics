"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { QuestionnaireAddActionButton } from "@/components/faculytics/questionnaires/builder/questionnaire-add-action-button";
import { QuestionnaireOutlinePanel } from "@/components/faculytics/questionnaires/builder/questionnaire-outline-panel";
import { QuestionnaireQualitativeEditor } from "@/components/faculytics/questionnaires/builder/questionnaire-qualitative-editor";
import { QuestionnaireSectionEditor } from "@/components/faculytics/questionnaires/builder/questionnaire-section-editor";
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
} from "@/types/questionnaires";
import { MAX_SECTION_NESTING_LEVEL } from "@/types/questionnaires";

type QuestionnaireBuilderShellProps = {
  activeType: QuestionnaireType;
  isHydrated: boolean;
};

export function QuestionnaireBuilderShell({
  activeType,
  isHydrated,
}: QuestionnaireBuilderShellProps) {
  const router = useRouter();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
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
  const hasUnsavedChanges = useQuestionnaireBuilderStore((state) => state.hasUnsavedChanges);
  const { save, isPending } = useSaveQuestionnaireBuilder();
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [pendingParentId, setPendingParentId] = useState<string | null>(null);
  const [pendingScrollToSection, setPendingScrollToSection] = useState(false);

  useEffect(() => {
    if (!draft || draft.selectedSectionId || draft.sections.length === 0) {
      return;
    }

    selectSection(draft.sections[0]?.id ?? null);
  }, [draft, selectSection]);

  useEffect(() => {
    if (!draft?.selectedSectionId || !pendingScrollToSection) {
      return;
    }

    const targetId =
      draft.selectedSectionId === "qualitative"
        ? "qualitative-editor"
        : `section-editor-${draft.selectedSectionId}`;

    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingScrollToSection(false);
    });
  }, [draft?.selectedSectionId, pendingScrollToSection]);

  if (!isHydrated || !draft) {
    return <Card className="p-6 text-sm text-muted-foreground">Loading builder draft...</Card>;
  }

  const validation = validateQuestionnaireBuilderDraft(draft);
  const previewModel = buildQuestionnairePreviewModel(draft);
  const isDirty = hasUnsavedChanges();
  const isSaved = !isDirty && Boolean(draft.metadata.versionId);
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

    setPendingScrollToSection(true);
    addChildSection(sectionId);
  };

  const handleAddRootSection = () => {
    setPendingScrollToSection(true);
    addRootSection();
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

  const handleSave = async () => {
    const result = await save();

    if (result?.status === "saved") {
      setSaveDialogOpen(true);
    }
  };

  const renderStatusBadge = () => {
    if (isDirty) {
      return (
        <Badge variant="ghost" className="font-medium badge-status-draft">
          Unsaved Changes
        </Badge>
      );
    }

    if (isSaved) {
      return (
        <Badge variant="ghost" className="font-medium badge-status-active">
          Saved
        </Badge>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                {draft.metadata.titleLocked ? (
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="font-playfair text-xl">
                        {draft.metadata.questionnaireTitle || "Untitled questionnaire"}
                      </CardTitle>
                      {renderStatusBadge()}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This title is inherited from the questionnaire root and cannot be renamed
                      from the version builder.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <InlineEditInput
                      id="questionnaire-title"
                      value={draft.metadata.title}
                      placeholder="Enter the questionnaire title"
                      textClassName="min-h-11 bg-transparent px-0 text-xl font-semibold hover:bg-transparent"
                      inputClassName="h-11 px-0 text-xl font-semibold"
                      onChange={updateTitle}
                    />
                    {renderStatusBadge()}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 xl:items-end">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
                  <Button asChild variant="outline">
                    <Link href={`/superadmin/questionnaires/new/preview?type=${previewModel.type}`}>
                      Open preview
                    </Link>
                  </Button>
                  {isDirty ? (
                    <Button type="button" variant="outline" onClick={() => setDiscardDialogOpen(true)}>
                      Discard draft
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="brand"
                    disabled={isPending}
                    onClick={() => void handleSave()}
                  >
                    {isPending ? "Saving..." : "Save draft"}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
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

      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,2.2fr)]">
        <div className="min-w-0 lg:sticky lg:top-4">
          <QuestionnaireOutlinePanel
            sections={draft.sections}
            totalLeafWeight={validation.totalLeafWeight}
            selectedSectionId={draft.selectedSectionId}
            sectionIssues={validation.sectionIssues}
            qualitative={draft.qualitative}
            qualitativeIssues={validation.qualitativeIssues}
            onSelect={handleSelectSection}
            onAddRoot={handleAddRootSection}
            onAddChild={requestAddChild}
            onMove={moveSection}
            onRemove={removeSection}
          />
        </div>

        <div className="min-w-0 space-y-6">
          {draft.sections.length === 0 ? (
            <QuestionnaireAddActionButton
              label="Add Section"
              onClick={handleAddRootSection}
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
                onClick={handleAddRootSection}
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

      <Dialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogDescription>
              This discards changes that have not been saved to the backend and restores the last
              synced draft state for this questionnaire type.
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
                  setPendingScrollToSection(true);
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

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Questionnaire draft saved</DialogTitle>
            <DialogDescription>
              Your changes were saved successfully. You can keep editing here or go back to the questionnaire list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Keep editing
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSaveDialogOpen(false);
                router.push(`/superadmin/questionnaires?builder=saved&type=${activeType}`);
              }}
            >
              Go back to questionnaires
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
