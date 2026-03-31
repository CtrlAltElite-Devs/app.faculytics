"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteQuestionnaireTypeManagement } from "@/features/questionnaires/api/questionnaire.requests";
import { questionnaireManagementQueryKeys } from "@/features/questionnaires/lib/query-keys";

export function useDeleteQuestionnaireTypeManagement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuestionnaireTypeManagement,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: questionnaireManagementQueryKeys.all,
      });
    },
  });
}
