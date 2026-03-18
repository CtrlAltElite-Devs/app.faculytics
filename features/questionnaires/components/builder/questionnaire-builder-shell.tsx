"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { QuestionnaireCallout } from "@/features/questionnaires/components/questionnaire-callout";
import { QuestionnaireAddActionButton } from "@/features/questionnaires/components/builder/questionnaire-add-action-button";
import { QuestionnaireOutlinePanel } from "@/features/questionnaires/components/builder/questionnaire-outline-panel";
import { QuestionnaireQualitativeEditor } from "@/features/questionnaires/components/builder/questionnaire-qualitative-editor";
import { QuestionnaireSectionEditor } from "@/features/questionnaires/components/builder/questionnaire-section-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { InlineEditInput } from "@/components/ui/inline-edit-input";
import { Separator } from "@/components/ui/separator";
import { useQuestionnaireBuilderController } from "@/features/questionnaires/hooks/use-questionnaire-builder-controller";
import type { QuestionnaireType } from "@/features/questionnaires/types";

type QuestionnaireBuilderShellProps = {
  activeType: QuestionnaireType;
  isHydrated: boolean;
};

export function QuestionnaireBuilderShell({
  activeType,
  isHydrated,
}: QuestionnaireBuilderShellProps) {
  const router = useRouter();
  const {
    addQuestion,
    discardDialogOpen,
    draft,
    handleAddRootSection,
    handleConfirmParentConversion,
    handleDiscardDraft,
    handleSave,
    handleSelectSection,
    handleUpdateQuestion,
    handleUpdateSection,
    isDirty,
    isPending,
    isSaved,
    moveSection,
    pendingConversionState,
    pendingParentId,
    previewModel,
    removeQuestion,
    removeSection,
    requestAddChild,
    saveDialogOpen,
    setDiscardDialogOpen,
    setPendingParentId,
    setSaveDialogOpen,
    updateQualitative,
    updateTitle,
    validation,
  } = useQuestionnaireBuilderController({ activeType });

  if (!isHydrated || !draft || !validation || !previewModel) {
    return <Card className="p-6 text-sm text-muted-foreground">Loading builder draft...</Card>;
  }

  const hasExistingQuestionnaire = Boolean(draft.metadata.questionnaireId);

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
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <InlineEditInput
                        id="questionnaire-title"
                        value={draft.metadata.title}
                        placeholder="Enter the questionnaire title"
                        ariaInvalid={Boolean(
                          validation.issues.some((issue) => issue.code === "metadata.title.required")
                        )}
                        textClassName="min-h-11 bg-transparent px-0 text-xl font-semibold hover:bg-transparent"
                        inputClassName="h-11 px-0 text-xl font-semibold"
                        onChange={updateTitle}
                      />
                    </div>
                    {renderStatusBadge()}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {hasExistingQuestionnaire
                      ? "Changes to the questionnaire title will be saved to the parent questionnaire."
                      : "Set the questionnaire title before creating the first draft version."}
                  </p>
                </div>
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
                      Discard changes
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
              <QuestionnaireCallout variant="danger">
                {validation.issues[0]?.message}
              </QuestionnaireCallout>
            ) : (
              <QuestionnaireCallout>
                Draft is ready to save. Preview remains superadmin-only until a version is
                published through future lifecycle actions.
              </QuestionnaireCallout>
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

      <ConfirmationDialog
        open={discardDialogOpen}
        onOpenChange={setDiscardDialogOpen}
        title="Discard unsaved changes?"
        description="This discards changes that have not been saved to the backend and restores the last synced draft state for this questionnaire type."
        cancelLabel="Keep editing"
        confirmLabel="Discard changes"
        confirmVariant="destructive"
        onConfirm={handleDiscardDraft}
      />

      <ConfirmationDialog
        open={Boolean(pendingParentId)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingParentId(null);
          }
        }}
        title="Convert this section into a parent section?"
        description={`Adding a subsection will remove the questions currently created in this section.${
          pendingConversionState.questionCount > 0
            ? ` ${pendingConversionState.questionCount} question${
                pendingConversionState.questionCount === 1 ? "" : "s"
              } will be removed.`
            : ""
        }${pendingConversionState.hasWeight ? " This section weight will also be cleared." : ""}`}
        cancelLabel="Cancel"
        confirmLabel="Convert section"
        onConfirm={handleConfirmParentConversion}
      />

      <ConfirmationDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        title="Questionnaire draft saved"
        description="Your changes were saved successfully. You can keep editing here or go back to the questionnaire list."
        cancelLabel="Keep editing"
        confirmLabel="Go back to questionnaires"
        onConfirm={() => {
          setSaveDialogOpen(false);
          router.push(`/superadmin/questionnaires?builder=saved&type=${activeType}`);
        }}
      />
    </div>
  );
}
