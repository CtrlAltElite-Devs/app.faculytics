"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDimension } from "@/features/dimensions/api/dimension.requests";
import type { UpdateDimensionRequest } from "@/features/dimensions/types";

export function useUpdateDimension() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDimensionRequest }) =>
      updateDimension(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["dimensions"] });
    },
  });
}
