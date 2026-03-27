"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDimension } from "@/features/dimensions/api/dimension.requests";

export function useCreateDimension() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDimension,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["dimensions"],
      });
    },
  });
}
