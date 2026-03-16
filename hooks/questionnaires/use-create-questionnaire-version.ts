"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createQuestionnaireVersion } from "@/network/requests/questionnaires";

export function useCreateQuestionnaireVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestionnaireVersion,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
    },
  });
}
