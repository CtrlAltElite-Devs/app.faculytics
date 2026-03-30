"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createQuestionnaireTypeManagement } from "@/features/questionnaires/api/questionnaire.requests";
import { questionnaireManagementQueryKeys } from "@/features/questionnaires/lib/query-keys";

export function useCreateQuestionnaireTypeManagement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestionnaireTypeManagement,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: questionnaireManagementQueryKeys.all,
      });
    },
  });
}
