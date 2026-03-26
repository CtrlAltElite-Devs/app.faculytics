"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  activateDimension,
  deactivateDimension,
} from "@/features/dimensions/api/dimension.requests";

export function useToggleDimensionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? deactivateDimension(id) : activateDimension(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["dimensions"] });
    },
  });
}
