"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createQuestionnaireVersion } from "@/features/questionnaires/api/questionnaire.requests";
import { isVersionQuery } from "@/features/questionnaires/lib/query-keys";

export function useCreateQuestionnaireVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestionnaireVersion,
    onSuccess: () => {
      void queryClient.invalidateQueries({ predicate: isVersionQuery });
    },
  });
}
