"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useQuestionnaireTypeResolution } from "@/features/questionnaires/hooks/use-questionnaire-type-resolution";
import {
  useQuestionnaireVersion,
  useQuestionnaireVersions,
} from "@/features/questionnaires/hooks/use-questionnaire-versions";
import { normalizeTypeSearchParam } from "@/features/questionnaires/lib/questionnaire-type-routing";
import { useQuestionnaireBuilderStore } from "@/features/questionnaires/store/questionnaire-builder-store";

export function useQuestionnairePageState() {
  const router = useRouter();
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const {
    searchParams,
    questionnaireTypesQuery,
    requestedType,
    requestedTypeUnavailable,
    availableTypes,
    activeType: activePageType,
    activeTypeSummary,
    activeTypeId,
  } = useQuestionnaireTypeResolution();
  const requestedVersionId = searchParams.get("versionId");
  const hydrated = useQuestionnaireBuilderStore((state) => state.hydrated);
  const activeType = useQuestionnaireBuilderStore((state) => state.activeType);
  const loadDraftFromServer = useQuestionnaireBuilderStore((state) => state.loadDraftFromServer);
  const clearDraftForType = useQuestionnaireBuilderStore((state) => state.clearDraftForType);
  const setActiveType = useQuestionnaireBuilderStore((state) => state.setActiveType);
  const hasUnsavedChanges = useQuestionnaireBuilderStore((state) => state.hasUnsavedChanges);
  const resetActiveDraft = useQuestionnaireBuilderStore((state) => state.resetActiveDraft);
  const currentDraft = useQuestionnaireBuilderStore(
    (state) => state.drafts[activePageType] ?? null
  );

  const questionnaireVersionsQuery = useQuestionnaireVersions(activeTypeId, {
    enabled:
      questionnaireTypesQuery.isSuccess && !requestedTypeUnavailable && activeTypeId !== null,
  });
  const defaultDraftVersionId =
    questionnaireVersionsQuery.data?.versions.find((version) => version.status === "DRAFT")?.id ??
    null;
  const resolvedVersionId = requestedVersionId ?? defaultDraftVersionId;
  const questionnaireVersionQuery = useQuestionnaireVersion(resolvedVersionId, {
    enabled:
      questionnaireTypesQuery.isSuccess && !requestedTypeUnavailable && Boolean(resolvedVersionId),
  });
  const shouldDelayDraftHydration =
    Boolean(resolvedVersionId) && questionnaireVersionQuery.isLoading;
  const draftVersion = questionnaireVersionQuery.data ?? null;

  useEffect(() => {
    normalizeTypeSearchParam({
      isResolved: questionnaireTypesQuery.isSuccess,
      currentTypeParam: searchParams.get("type"),
      normalizedType: activePageType,
      pathname: "/superadmin/questionnaires/new",
      searchParams,
      router,
    });
  }, [activePageType, questionnaireTypesQuery.isSuccess, router, searchParams]);

  useEffect(() => {
    if (!questionnaireVersionsQuery.data) {
      return;
    }

    if (shouldDelayDraftHydration) {
      return;
    }

    const { questionnaireId, questionnaireTitle, type, versions } = questionnaireVersionsQuery.data;
    const typeCode = type.code;
    loadDraftFromServer({
      type: typeCode,
      versions,
      draftVersion,
      ...(questionnaireId !== null
        ? {
            questionnaireId,
            questionnaireTitle: questionnaireTitle ?? questionnaireId,
          }
        : { questionnaireId: null, questionnaireTitle: null }),
    });
  }, [
    draftVersion,
    loadDraftFromServer,
    questionnaireVersionsQuery.data,
    shouldDelayDraftHydration,
  ]);

  useEffect(() => {
    if (!requestedTypeUnavailable) {
      return;
    }

    clearDraftForType(requestedType);

    if (activeType === requestedType) {
      setActiveType(null);
    }
  }, [activeType, clearDraftForType, requestedType, requestedTypeUnavailable, setActiveType]);

  const isLoading =
    questionnaireTypesQuery.isLoading ||
    questionnaireVersionsQuery.isLoading ||
    questionnaireVersionQuery.isLoading;
  const isError =
    questionnaireTypesQuery.isError ||
    questionnaireVersionsQuery.isError ||
    questionnaireVersionQuery.isError;
  const questionnaireListHref = `/superadmin/questionnaires?type=${activePageType}`;
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
  const hasLocalBuilderDraft = hydrated && Boolean(currentDraft);
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
    questionnaireListHref,
    questionnaireTypesQuery,
    questionnaireVersionsQuery,
    questionnaireVersionQuery,
    resetActiveDraft,
    handleBackToQuestionnaires,
    router,
  };
}
