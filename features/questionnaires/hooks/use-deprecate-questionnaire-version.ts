"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deprecateQuestionnaireVersion } from "@/features/questionnaires/api/questionnaire.requests";
import { isVersionQuery } from "@/features/questionnaires/lib/query-keys";

export function useDeprecateQuestionnaireVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deprecateQuestionnaireVersion,
    onSuccess: () => {
      void queryClient.invalidateQueries({ predicate: isVersionQuery });
    },
  });
}
