"use client";

import { useQuestionnaireBuilderNavigation } from "@/features/questionnaires/hooks/use-questionnaire-builder-navigation";
import { useQuestionnaireDraftHydration } from "@/features/questionnaires/hooks/use-questionnaire-draft-hydration";
import { useQuestionnaireRouteState } from "@/features/questionnaires/hooks/use-questionnaire-route-state";
import { useQuestionnaireBuilderStore } from "@/features/questionnaires/store/questionnaire-builder-store";

export function useQuestionnairePageState() {
  const {
    router,
    questionnaireTypesQuery,
    requestedType,
    requestedTypeUnavailable,
    availableTypes,
    activeType: activePageType,
    activeTypeSummary,
    activeTypeId,
    searchParams,
  } = useQuestionnaireRouteState();
  const requestedVersionId = searchParams.get("versionId");
  const hasUnsavedChanges = useQuestionnaireBuilderStore((state) => state.hasUnsavedChanges);
  const resetActiveDraft = useQuestionnaireBuilderStore((state) => state.resetActiveDraft);
  const {
    hydrated,
    currentDraft,
    resolvedVersionId,
    questionnaireVersionsQuery,
    questionnaireVersionQuery,
  } = useQuestionnaireDraftHydration({
    questionnaireTypesQuery,
    activeTypeId,
    activeType: activePageType,
    requestedType,
    requestedTypeUnavailable,
    requestedVersionId,
  });
  const hasLocalBuilderDraft = hydrated && Boolean(currentDraft);
  const {
    emptyState,
    discardDialogOpen,
    setDiscardDialogOpen,
    showBuilderLoading,
    showBuilderError,
    handleBackToQuestionnaires,
    handleRetry,
    handleConfirmDiscard,
  } = useQuestionnaireBuilderNavigation({
    activeType: activePageType,
    availableTypes,
    requestedTypeUnavailable,
    hasLocalBuilderDraft,
    resolvedVersionId,
    questionnaireTypesQuery,
    questionnaireVersionsQuery,
    questionnaireVersionQuery,
    hasUnsavedChanges,
    resetActiveDraft,
    router,
  });

  return {
    activePageType,
    activeTypeSummary,
    hydrated,
    resolvedVersionId,
    showBuilderLoading,
    showBuilderError,
    emptyState,
    discardDialogOpen,
    setDiscardDialogOpen,
    questionnaireTypesQuery,
    questionnaireVersionsQuery,
    questionnaireVersionQuery,
    resetActiveDraft,
    handleBackToQuestionnaires,
    handleRetry,
    handleConfirmDiscard,
  };
}
