"use client";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { useQuestionnaireListPage } from "@/features/questionnaires/hooks/use-questionnaire-list-page";

import { QuestionnaireListScreen } from "./_components/questionnaire-list-screen";
import { QuestionnairePageHeader } from "./_components/questionnaire-page-header";

export default function SuperAdminQuestionnairesPage() {
  const page = useQuestionnaireListPage();

  return (
    <section className="space-y-6 px-4 py-5 sm:px-6 md:p-8">
      <QuestionnairePageHeader
        title="Questionnaires"
        description="Browse questionnaire types, search versions, and filter by lifecycle status."
      />

      <QuestionnaireListScreen
        availableTypes={page.availableTypes}
        activeType={page.activeType}
        hasDraftVersion={page.hasDraftVersion}
        hasQuestionnaire={page.hasQuestionnaire}
        rows={page.versionRows}
        onTypeChange={page.handleTypeChange}
        isLoading={page.isLoading}
        isError={page.isError}
        onRetry={page.handleRetry}
        onEditDraft={page.handleEditDraft}
        onViewVersion={page.handleViewVersion}
        onPublishVersion={(row) => page.setVersionAction({ type: "publish", row })}
        onDeprecateVersion={(row) => page.setVersionAction({ type: "deprecate", row })}
        disableActions={page.isVersionActionPending}
      />

      <ConfirmationDialog
        open={page.versionAction !== null}
        onOpenChange={(open) => {
          if (!open && !page.isVersionActionPending) {
            page.setVersionAction(null);
          }
        }}
        title={page.actionDialogConfig?.title ?? ""}
        description={page.actionDialogConfig?.description ?? ""}
        cancelLabel="Cancel"
        confirmLabel={page.actionDialogConfig?.confirmLabel ?? ""}
        confirmVariant={page.actionDialogConfig?.confirmVariant}
        isPending={page.isVersionActionPending}
        onConfirm={() => {
          void page.handleConfirmVersionAction();
        }}
      />
    </section>
  );
}
