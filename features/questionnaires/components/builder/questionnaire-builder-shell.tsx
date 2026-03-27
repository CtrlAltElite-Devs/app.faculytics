"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { QuestionnaireCallout } from "@/features/questionnaires/components/questionnaire-callout";
import { QuestionnaireAddActionButton } from "@/features/questionnaires/components/builder/questionnaire-add-action-button";
import { InlineEditInput } from "@/features/questionnaires/components/builder/inline-edit-input";
import { QuestionnaireOutlinePanel } from "@/features/questionnaires/components/builder/questionnaire-outline-panel";
import { QuestionnaireQualitativeEditor } from "@/features/questionnaires/components/builder/questionnaire-qualitative-editor";
import { QuestionnaireSectionEditor } from "@/features/questionnaires/components/builder/questionnaire-section-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Separator } from "@/components/ui/separator";
import { useQuestionnaireBuilderController } from "@/features/questionnaires/hooks/use-questionnaire-builder-controller";
import type { QuestionnaireTypeCode } from "@/features/questionnaires/types";

type QuestionnaireBuilderShellProps = {
  activeType: QuestionnaireTypeCode;
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
    totalLeafWeight,
  } = useQuestionnaireBuilderController({ activeType });

  if (!isHydrated || !draft || !previewModel) {
    return <Card className="p-6 text-sm text-muted-foreground">Loading builder draft...</Card>;
  }

  const hasExistingQuestionnaire = Boolean(draft.metadata.questionnaireId);
  const statusBadge = isDirty ? (
    <Badge variant="ghost" className="badge-status-draft">
      Unsaved Changes
    </Badge>
  ) : isSaved ? (
    <Badge variant="ghost" className="badge-status-active">
      Saved
    </Badge>
  ) : null;
  const validationMessages = validation
    ? [...new Set(validation.issues.map((issue) => issue.message))]
    : [];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 space-y-4">
              <div className="min-w-0">
                <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
                  <div className="w-full lg:min-w-0 lg:flex-1">
                    <InlineEditInput
                      id="questionnaire-title"
                      value={draft.metadata.title}
                      placeholder="Enter the questionnaire title"
                      ariaInvalid={Boolean(
                        validation?.issues.some((issue) => issue.code === "metadata.title.required")
                      )}
                      textClassName="min-h-11 text-xl font-semibold"
                      inputClassName="h-11 text-xl font-semibold"
                      onChange={updateTitle}
                    />
                  </div>
                  {statusBadge ? <div className="lg:shrink-0">{statusBadge}</div> : null}
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDiscardDialogOpen(true)}
                  >
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
          {validation && !validation.isValid && (
            <QuestionnaireCallout variant="danger">
              {validationMessages.length === 1 ? (
                validationMessages[0]
              ) : (
                <ul className="list-disc space-y-1 pl-5">
                  {validationMessages.slice(0, 3).map((message, index) => (
                    <li key={`${message}-${index}`}>{message}</li>
                  ))}
                </ul>
              )}
            </QuestionnaireCallout>
          )}
        </CardContent>
      </Card>

      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,2.2fr)]">
        <div className="min-w-0 lg:sticky lg:top-4">
          <QuestionnaireOutlinePanel
            sections={draft.sections}
            totalLeafWeight={totalLeafWeight}
            selectedSectionId={draft.selectedSectionId}
            sectionIssues={validation?.sectionIssues ?? {}}
            qualitative={draft.qualitative}
            qualitativeIssues={validation?.qualitativeIssues ?? []}
            onSelect={handleSelectSection}
            onAddRoot={handleAddRootSection}
            onAddChild={requestAddChild}
            onMove={moveSection}
            onRemove={removeSection}
          />
        </div>

        <div className="min-w-0 space-y-6">
          {draft.sections.length === 0 ? (
            <QuestionnaireAddActionButton label="Add Section" onClick={handleAddRootSection} />
          ) : (
            <>
              {draft.sections.map((section) => (
                <QuestionnaireSectionEditor
                  key={section.id}
                  questionnaireType={activeType}
                  section={section}
                  sectionIssues={validation?.sectionIssues[section.id] ?? []}
                  allSectionIssues={validation?.sectionIssues ?? {}}
                  questionIssues={validation?.questionIssues ?? {}}
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
              <QuestionnaireAddActionButton label="Add Section" onClick={handleAddRootSection} />
            </>
          )}

          <div className="space-y-4 pt-2">
            <Separator />
            <QuestionnaireQualitativeEditor
              value={draft.qualitative}
              issues={validation?.qualitativeIssues ?? []}
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
          router.push(`/superadmin/questionnaires?type=${activeType}`);
        }}
      />
    </div>
  );
}
