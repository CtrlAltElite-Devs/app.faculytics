"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createQuestionnaire } from "@/network/requests/questionnaires";

export function useCreateQuestionnaire() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestionnaire,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
    },
  });
}
