"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { serializeQuestionnaireBuilderDraft } from "@/lib/questionnaires/builder-serializer";
import { validateQuestionnaireBuilderDraft } from "@/lib/questionnaires/builder-validator";
import { useCreateQuestionnaire } from "@/hooks/questionnaires/use-create-questionnaire";
import { useCreateQuestionnaireVersion } from "@/hooks/questionnaires/use-create-questionnaire-version";
import { useUpdateQuestionnaireVersion } from "@/hooks/questionnaires/use-update-questionnaire-version";
import { useQuestionnaireBuilderStore } from "@/stores/questionnaire-builder-store";

export function useSaveQuestionnaireBuilder() {
  const router = useRouter();
  const createQuestionnaireMutation = useCreateQuestionnaire();
  const createQuestionnaireVersionMutation = useCreateQuestionnaireVersion();
  const updateQuestionnaireVersionMutation = useUpdateQuestionnaireVersion();
  const clearDraftForType = useQuestionnaireBuilderStore((state) => state.clearDraftForType);
  const setQuestionnaireRootMetadata = useQuestionnaireBuilderStore(
    (state) => state.setQuestionnaireRootMetadata
  );

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

      if (!questionnaireId) {
        const createdQuestionnaire = await createQuestionnaireMutation.mutateAsync({
          title: draft.metadata.title.trim(),
          type: draft.metadata.type,
        });
        questionnaireId = createdQuestionnaire.id;
        setQuestionnaireRootMetadata(createdQuestionnaire.id, createdQuestionnaire.title);
      }

      if (draft.metadata.versionId) {
        await updateQuestionnaireVersionMutation.mutateAsync({
          versionId: draft.metadata.versionId,
          payload: {
            schema: payload,
          },
        });
      } else {
        await createQuestionnaireVersionMutation.mutateAsync({
          questionnaireId,
          payload: {
            schema: payload,
          },
        });
      }

      clearDraftForType(draft.metadata.type);
      toast.success("Questionnaire draft saved.");
      router.push(`/superadmin/questionnaires?builder=saved&type=${draft.metadata.type}`);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error("A draft version already exists for this questionnaire type.");
        router.push(`/superadmin/questionnaires?builder=conflict&type=${draft.metadata.type}`);
        return;
      }

      toast.error("Unable to save the questionnaire draft right now.");
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
