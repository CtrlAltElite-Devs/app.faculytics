"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createQuestionnaireVersion } from "@/features/questionnaires/api/questionnaire.requests";

export function useCreateQuestionnaireVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestionnaireVersion,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "questionnaires" && query.queryKey.includes("versions"),
      });
    },
  });
}
