"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchDimensions } from "@/features/dimensions/api/dimension.requests";
import { useAuthStore } from "@/stores/auth-store";

type UseDimensionsOptions = {
  enabled?: boolean;
};

export function useDimensions(questionnaireTypeId: string | null, options?: UseDimensionsOptions) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["dimensions", questionnaireTypeId, "active", token],
    enabled: Boolean(token) && Boolean(questionnaireTypeId) && isEnabled,
    queryFn: async () => {
      if (!questionnaireTypeId) {
        throw new Error("Questionnaire type ID is required.");
      }

      return fetchDimensions({
        questionnaireTypeId,
        active: true,
        limit: 100,
      });
    },
  });
}
