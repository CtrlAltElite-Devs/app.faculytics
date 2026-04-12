"use client";

import { useEffect } from "react";

import {
  useQuestionnaireVersion,
  useQuestionnaireVersions,
} from "@/features/questionnaires/hooks/use-questionnaire-versions";
import { useQuestionnaireBuilderStore } from "@/features/questionnaires/store/questionnaire-builder-store";
import type { UseQuestionnaireTypesResult } from "@/features/questionnaires/hooks/use-questionnaire-types";
import type { QuestionnaireTypeCode } from "@/features/questionnaires/types";

type UseQuestionnaireDraftHydrationOptions = {
  questionnaireTypesQuery: UseQuestionnaireTypesResult;
  activeTypeId: string | null;
  activeType: QuestionnaireTypeCode;
  requestedType: QuestionnaireTypeCode;
  requestedTypeUnavailable: boolean;
  requestedVersionId: string | null;
};

export function useQuestionnaireDraftHydration({
  questionnaireTypesQuery,
  activeTypeId,
  activeType,
  requestedType,
  requestedTypeUnavailable,
  requestedVersionId,
}: UseQuestionnaireDraftHydrationOptions) {
  const hydrated = useQuestionnaireBuilderStore((state) => state.hydrated);
  const storeActiveType = useQuestionnaireBuilderStore((state) => state.activeType);
  const loadDraftFromServer = useQuestionnaireBuilderStore((state) => state.loadDraftFromServer);
  const clearDraftForType = useQuestionnaireBuilderStore((state) => state.clearDraftForType);
  const setActiveType = useQuestionnaireBuilderStore((state) => state.setActiveType);
  const currentDraft = useQuestionnaireBuilderStore((state) => state.drafts[activeType] ?? null);

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
    if (!questionnaireVersionsQuery.data || shouldDelayDraftHydration) {
      return;
    }

    const { questionnaireId, questionnaireTitle, type, versions } = questionnaireVersionsQuery.data;
    loadDraftFromServer({
      type: type.code,
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

    if (storeActiveType === requestedType) {
      setActiveType(null);
    }
  }, [clearDraftForType, requestedType, requestedTypeUnavailable, setActiveType, storeActiveType]);

  return {
    hydrated,
    currentDraft,
    resolvedVersionId,
    questionnaireVersionsQuery,
    questionnaireVersionQuery,
  };
}
