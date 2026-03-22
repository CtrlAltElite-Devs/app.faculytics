"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { publishQuestionnaireVersion } from "@/features/questionnaires/api/questionnaire.requests";

export function usePublishQuestionnaireVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishQuestionnaireVersion,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
    },
  });
}
