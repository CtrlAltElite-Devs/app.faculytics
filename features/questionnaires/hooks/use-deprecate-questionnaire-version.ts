"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deprecateQuestionnaireVersion } from "@/features/questionnaires/api/questionnaire.requests";

export function useDeprecateQuestionnaireVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deprecateQuestionnaireVersion,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
    },
  });
}
