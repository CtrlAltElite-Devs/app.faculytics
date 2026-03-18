"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createQuestionnaire } from "@/features/questionnaires/api/questionnaire.requests";

export function useCreateQuestionnaire() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestionnaire,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
    },
  });
}
