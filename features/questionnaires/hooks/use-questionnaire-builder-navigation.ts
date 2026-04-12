"use client";

import { useState } from "react";

import type { QuestionnaireTypeCode } from "@/features/questionnaires/types";

type RefetchableQuery = {
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
  data?: unknown;
};

type UseQuestionnaireBuilderNavigationOptions = {
  activeType: QuestionnaireTypeCode;
  availableTypes: QuestionnaireTypeCode[];
  requestedTypeUnavailable: boolean;
  hasLocalBuilderDraft: boolean;
  resolvedVersionId: string | null;
  questionnaireTypesQuery: RefetchableQuery;
  questionnaireVersionsQuery: RefetchableQuery;
  questionnaireVersionQuery: RefetchableQuery;
  hasUnsavedChanges: () => boolean;
  resetActiveDraft: () => void;
  router: {
    push: (href: string) => void;
    replace: (href: string) => void;
  };
};

export function useQuestionnaireBuilderNavigation({
  activeType,
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
}: UseQuestionnaireBuilderNavigationOptions) {
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  const isLoading =
    questionnaireTypesQuery.isLoading ||
    questionnaireVersionsQuery.isLoading ||
    questionnaireVersionQuery.isLoading;
  const isError =
    questionnaireTypesQuery.isError ||
    questionnaireVersionsQuery.isError ||
    questionnaireVersionQuery.isError;
  const questionnaireListHref = `/superadmin/questionnaires?type=${activeType}`;
  const emptyState =
    availableTypes.length === 0
      ? { description: "No questionnaire types are available right now." }
      : requestedTypeUnavailable
        ? {
            description:
              "That questionnaire type is no longer available. The stale local draft for it was discarded.",
            actionLabel: "Open available type",
            onAction: () => {
              if (availableTypes[0]) {
                router.replace(`/superadmin/questionnaires/new?type=${availableTypes[0]}`);
              }
            },
          }
        : null;
  const showBuilderLoading =
    !hasLocalBuilderDraft &&
    (isLoading ||
      (!requestedTypeUnavailable && availableTypes.length > 0 && !questionnaireVersionsQuery.data));
  const showBuilderError = !hasLocalBuilderDraft && isError;

  const handleBackToQuestionnaires = () => {
    if (!hasUnsavedChanges()) {
      router.push(questionnaireListHref);
      return;
    }

    setDiscardDialogOpen(true);
  };

  const handleRetry = () => {
    void questionnaireTypesQuery.refetch();
    void questionnaireVersionsQuery.refetch();

    if (resolvedVersionId) {
      void questionnaireVersionQuery.refetch();
    }
  };

  const handleConfirmDiscard = () => {
    resetActiveDraft();
    setDiscardDialogOpen(false);
    router.push(questionnaireListHref);
  };

  return {
    emptyState,
    discardDialogOpen,
    setDiscardDialogOpen,
    questionnaireListHref,
    showBuilderLoading,
    showBuilderError,
    handleBackToQuestionnaires,
    handleRetry,
    handleConfirmDiscard,
  };
}
