"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { publishQuestionnaireVersion } from "@/features/questionnaires/api/questionnaire.requests";
import { isVersionQuery } from "@/features/questionnaires/lib/query-keys";

export function usePublishQuestionnaireVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishQuestionnaireVersion,
    onSuccess: () => {
      void queryClient.invalidateQueries({ predicate: isVersionQuery });
    },
  });
}
