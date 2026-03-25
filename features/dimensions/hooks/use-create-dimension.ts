"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDimension } from "@/features/dimensions/api/dimension.requests";
import type { DimensionsListResponse } from "@/features/dimensions/types";
import { useAuthStore } from "@/stores/auth-store";

export function useCreateDimension() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: createDimension,
    onSuccess: (dimension) => {
      queryClient.setQueryData<DimensionsListResponse | undefined>(
        ["dimensions", dimension.questionnaireType, "active", token],
        (current) => {
          if (!current) {
            return {
              data: [dimension],
              meta: {
                page: 1,
                limit: 100,
                totalItems: 1,
                totalPages: 1,
                itemCount: 1,
              },
            };
          }

          const alreadyPresent = current.data.some((item) => item.code === dimension.code);
          if (alreadyPresent) {
            return current;
          }

          const nextData = [dimension, ...current.data];

          return {
            ...current,
            data: nextData,
            meta: {
              ...current.meta,
              totalItems: current.meta.totalItems + 1,
              itemCount: nextData.length,
              totalPages: Math.max(
                1,
                Math.ceil((current.meta.totalItems + 1) / current.meta.limit)
              ),
            },
          };
        }
      );

      void queryClient.invalidateQueries({
        queryKey: ["dimensions", dimension.questionnaireType],
      });
    },
  });
}
