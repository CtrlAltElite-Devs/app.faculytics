"use client";

import { useQuestionnairePageState } from "@/features/questionnaires/hooks/use-questionnaire-page-state";

import { QuestionnaireBuilderDiscardDialog } from "./_components/questionnaire-builder-discard-dialog";
import { QuestionnaireBuilderPageHeader } from "./_components/questionnaire-builder-page-header";
import { QuestionnaireBuilderScreen } from "./_components/questionnaire-builder-screen";

export default function QuestionnaireBuilderPage() {
  const {
    activePageType,
    hydrated,
    resolvedVersionId,
    showBuilderLoading,
    showBuilderError,
    emptyState,
    discardDialogOpen,
    setDiscardDialogOpen,
    questionnaireListHref,
    questionnaireTypesQuery,
    questionnaireVersionsQuery,
    questionnaireVersionQuery,
    resetActiveDraft,
    handleBackToQuestionnaires,
    router,
  } = useQuestionnairePageState();

  return (
    <section className="space-y-6 px-0 py-5 sm:px-6 md:p-8">
      <QuestionnaireBuilderPageHeader onBack={handleBackToQuestionnaires} />

      <QuestionnaireBuilderScreen
        activeType={activePageType}
        isHydrated={hydrated}
        isLoading={showBuilderLoading}
        isError={showBuilderError}
        emptyState={emptyState}
        onRetry={() => {
          void questionnaireTypesQuery.refetch();
          void questionnaireVersionsQuery.refetch();
          if (resolvedVersionId) {
            void questionnaireVersionQuery.refetch();
          }
        }}
      />

      <QuestionnaireBuilderDiscardDialog
        open={discardDialogOpen}
        onOpenChange={setDiscardDialogOpen}
        onConfirm={() => {
          resetActiveDraft();
          setDiscardDialogOpen(false);
          router.push(questionnaireListHref);
        }}
      />
    </section>
  );
}
