"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchDimensions } from "@/features/dimensions/api/dimension.requests";
import type { QuestionnaireType } from "@/features/questionnaires/types";
import { useAuthStore } from "@/stores/auth-store";

type UseDimensionsOptions = {
  enabled?: boolean;
};

export function useDimensions(
  questionnaireType: QuestionnaireType | null,
  options?: UseDimensionsOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["dimensions", questionnaireType, "active", token],
    enabled: Boolean(token) && Boolean(questionnaireType) && isEnabled,
    queryFn: async () => {
      if (!questionnaireType) {
        throw new Error("Questionnaire type is required.");
      }

      return fetchDimensions({
        questionnaireType,
        active: true,
        limit: 100,
      });
    },
  });
}
