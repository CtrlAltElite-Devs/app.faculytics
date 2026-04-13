"use client";

import { useQuestionnairePageState } from "@/features/questionnaires/hooks/use-questionnaire-page-state";

import { QuestionnaireBuilderDiscardDialog } from "./_components/questionnaire-builder-discard-dialog";
import { QuestionnaireBuilderPageHeader } from "./_components/questionnaire-builder-page-header";
import { QuestionnaireBuilderScreen } from "./_components/questionnaire-builder-screen";

export default function QuestionnaireBuilderPage() {
  const {
    activePageType,
    hydrated,
    showBuilderLoading,
    showBuilderError,
    emptyState,
    discardDialogOpen,
    setDiscardDialogOpen,
    handleBackToQuestionnaires,
    handleRetry,
    handleConfirmDiscard,
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
        onRetry={handleRetry}
      />

      <QuestionnaireBuilderDiscardDialog
        open={discardDialogOpen}
        onOpenChange={setDiscardDialogOpen}
        onConfirm={handleConfirmDiscard}
      />
    </section>
  );
}
