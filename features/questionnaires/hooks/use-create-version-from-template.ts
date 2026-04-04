"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createVersionFromTemplate } from "@/features/questionnaires/api/questionnaire.requests";

export function useCreateVersionFromTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVersionFromTemplate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
    },
  });
}
