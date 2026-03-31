"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateQuestionnaireTypeManagement } from "@/features/questionnaires/api/questionnaire.requests";
import { questionnaireManagementQueryKeys } from "@/features/questionnaires/lib/query-keys";
import type { UpdateQuestionnaireTypeManagementRequest } from "@/features/questionnaires/types";

export function useUpdateQuestionnaireTypeManagement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateQuestionnaireTypeManagementRequest;
    }) => updateQuestionnaireTypeManagement({ id, payload }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: questionnaireManagementQueryKeys.all,
      });
    },
  });
}
