"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateQuestionnaireVersion } from "@/features/questionnaires/api/questionnaire.requests";
import { isVersionQuery } from "@/features/questionnaires/lib/query-keys";

export function useUpdateQuestionnaireVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuestionnaireVersion,
    onSuccess: () => {
      void queryClient.invalidateQueries({ predicate: isVersionQuery });
    },
  });
}
