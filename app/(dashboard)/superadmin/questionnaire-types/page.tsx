"use client";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";

import {
  QuestionnaireTypeCreateDialog,
  QuestionnaireTypeEditDialog,
  useQuestionnaireTypeManagementPage,
} from "@/features/questionnaires";

import { QuestionnaireTypeListScreen } from "./_components/questionnaire-type-list-screen";

export default function SuperAdminQuestionnaireTypesPage() {
  const page = useQuestionnaireTypeManagementPage();
  const deleteTarget = page.deleteQuestionnaireType;

  return (
    <section className="space-y-6 px-4 py-5 sm:px-6 md:p-8">
      <div>
        <h1 className="font-playfair text-2xl font-semibold">Questionnaire Types</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the questionnaire type catalog used by Super Admin questionnaire flows.
        </p>
      </div>

      <QuestionnaireTypeListScreen
        rows={page.rows}
        isLoading={page.isLoading}
        isError={page.isError}
        onRetry={page.onRetry}
        onCreateClick={() => page.setCreateOpen(true)}
        onEdit={page.setEditQuestionnaireType}
        onDelete={page.setDeleteQuestionnaireType}
      />

      <QuestionnaireTypeCreateDialog open={page.createOpen} onOpenChange={page.setCreateOpen} />

      <QuestionnaireTypeEditDialog
        open={page.editQuestionnaireType !== null}
        onOpenChange={(open) => {
          if (!open) {
            page.setEditQuestionnaireType(null);
          }
        }}
        questionnaireType={page.editQuestionnaireType}
      />

      {deleteTarget && (
        <ConfirmationDialog
          open
          onOpenChange={(open) => {
            if (!open && !page.isDeletePending) {
              page.setDeleteQuestionnaireType(null);
            }
          }}
          title={`Delete "${deleteTarget.name}"?`}
          description="This will soft-delete the questionnaire type. System types cannot be deleted, and the backend may reject deletion if the type is already associated with a questionnaire."
          cancelLabel="Cancel"
          confirmLabel="Delete type"
          confirmVariant="destructive"
          isPending={page.isDeletePending}
          onConfirm={() => {
            void page.onConfirmDelete();
          }}
        />
      )}
    </section>
  );
}
