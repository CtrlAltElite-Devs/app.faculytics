"use client";

import { isAxiosError } from "axios";
import { toast } from "sonner";

import { fetchQuestionnaireVersionById } from "@/features/questionnaires/api/questionnaire.requests";
import { useCreateQuestionnaire } from "@/features/questionnaires/hooks/use-create-questionnaire";
import { useCreateQuestionnaireVersion } from "@/features/questionnaires/hooks/use-create-questionnaire-version";
import { serializeQuestionnaireBuilderDraft } from "@/features/questionnaires/lib/builder-serializer";
import { validateQuestionnaireBuilderDraft } from "@/features/questionnaires/lib/builder-validator";
import { useUpdateQuestionnaireVersion } from "@/features/questionnaires/hooks/use-update-questionnaire-version";
import { useQuestionnaireBuilderStore } from "@/features/questionnaires/store/questionnaire-builder-store";

export function useSaveQuestionnaireBuilder() {
  const createQuestionnaireMutation = useCreateQuestionnaire();
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

    const validation = validateQuestionnaireBuilderDraft(draft);
    if (!validation.isValid) {
      toast.error(validation.issues[0]?.message ?? "Fix the draft issues before saving.");
      return;
    }

    const payload = serializeQuestionnaireBuilderDraft(draft);

    try {
      let questionnaireId = draft.metadata.questionnaireId;
      let savedVersionId = draft.metadata.versionId;

      if (!questionnaireId) {
        const createdQuestionnaire = await createQuestionnaireMutation.mutateAsync({
          title: draft.metadata.title.trim(),
          type: draft.metadata.type,
        });
        questionnaireId = createdQuestionnaire.id;
        setQuestionnaireRootMetadata(createdQuestionnaire.id, createdQuestionnaire.title);
      }

      if (draft.metadata.versionId) {
        const updatedVersion = await updateQuestionnaireVersionMutation.mutateAsync({
          versionId: draft.metadata.versionId,
          payload: {
            schema: payload,
          },
        });
        savedVersionId = updatedVersion.id;
      } else {
        const createdVersion = await createQuestionnaireVersionMutation.mutateAsync({
          questionnaireId,
          payload: {
            schema: payload,
          },
        });
        savedVersionId = createdVersion.id;
      }

      if (savedVersionId) {
        const savedVersion = await fetchQuestionnaireVersionById(savedVersionId);
        syncDraftVersion(savedVersion);
      }

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
