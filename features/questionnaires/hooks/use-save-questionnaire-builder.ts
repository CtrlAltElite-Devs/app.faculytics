"use client";

import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { useCreateQuestionnaire } from "@/features/questionnaires/hooks/use-create-questionnaire";
import { useCreateQuestionnaireVersion } from "@/features/questionnaires/hooks/use-create-questionnaire-version";
import { serializeQuestionnaireBuilderDraft } from "@/features/questionnaires/lib/builder-serializer";
import { useUpdateQuestionnaireVersion } from "@/features/questionnaires/hooks/use-update-questionnaire-version";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import type { QuestionnaireVersionDetail } from "@/features/questionnaires/types";
import { useQuestionnaireBuilderStore } from "@/features/questionnaires/store/questionnaire-builder-store";
import { useAuthStore } from "@/stores/auth-store";

export function useSaveQuestionnaireBuilder() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const createQuestionnaireMutation = useCreateQuestionnaire();
  const typesQuery = useQuestionnaireTypes();
  const createQuestionnaireVersionMutation = useCreateQuestionnaireVersion();
  const updateQuestionnaireVersionMutation = useUpdateQuestionnaireVersion();
  const setQuestionnaireRootMetadata = useQuestionnaireBuilderStore(
    (state) => state.setQuestionnaireRootMetadata
  );
  const syncDraftVersion = useQuestionnaireBuilderStore((state) => state.syncDraftVersion);

  const save = async () => {
    const storeState = useQuestionnaireBuilderStore.getState();
    const activeType = storeState.activeType;

    if (!activeType) {
      toast.error("Select a questionnaire type before saving.");
      return;
    }

    const draft = storeState.drafts[activeType];
    if (!draft) {
      toast.error("There is no active draft to save.");
      return;
    }

    const trimmedTitle = draft.metadata.title.trim();
    const payload = serializeQuestionnaireBuilderDraft(draft);

    try {
      let questionnaireId = draft.metadata.questionnaireId;

      if (!questionnaireId) {
        const typeId = typesQuery.data?.find((t) => t.code === draft.metadata.type)?.id;
        if (!typeId) {
          toast.error("Unable to resolve questionnaire type. Please reload and try again.");
          return;
        }

        const createdQuestionnaire = await createQuestionnaireMutation.mutateAsync({
          title: trimmedTitle,
          typeId,
        });
        questionnaireId = createdQuestionnaire.id;
        setQuestionnaireRootMetadata(createdQuestionnaire.id, createdQuestionnaire.title);
      }

      let savedVersion: QuestionnaireVersionDetail;

      if (draft.metadata.versionId) {
        const shouldSendTitle =
          draft.metadata.questionnaireTitle === null ||
          trimmedTitle !== draft.metadata.questionnaireTitle.trim();
        savedVersion = await updateQuestionnaireVersionMutation.mutateAsync({
          versionId: draft.metadata.versionId,
          payload: {
            schema: payload,
            ...(shouldSendTitle ? { title: trimmedTitle } : {}),
          },
        });
      } else {
        savedVersion = await createQuestionnaireVersionMutation.mutateAsync({
          questionnaireId,
          payload: {
            schema: payload,
          },
        });
      }

      // Sync the builder store and seed the query cache with the response
      // so the page-state hook doesn't re-fetch the same version.
      syncDraftVersion(savedVersion);
      queryClient.setQueryData(
        ["questionnaires", "versions", savedVersion.id, token],
        savedVersion
      );

      toast.success("Questionnaire draft saved.");
      return { status: "saved" as const, type: draft.metadata.type };
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error("A draft version already exists for this questionnaire type.");
        return { status: "conflict" as const, type: draft.metadata.type };
      }

      toast.error("Unable to save the questionnaire draft right now.");
      return { status: "error" as const, type: draft.metadata.type };
    }
  };

  return {
    save,
    isPending:
      createQuestionnaireMutation.isPending ||
      createQuestionnaireVersionMutation.isPending ||
      updateQuestionnaireVersionMutation.isPending,
  };
}
