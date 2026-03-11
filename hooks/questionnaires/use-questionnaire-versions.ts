"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchQuestionnaireVersionsByType } from "@/network/requests/questionnaires";
import { useAuthStore } from "@/stores/auth-store";
import type { QuestionnaireType } from "@/types/questionnaires";

type UseQuestionnaireVersionsOptions = {
  enabled?: boolean;
};

export function useQuestionnaireVersions(
  type: QuestionnaireType | null,
  options?: UseQuestionnaireVersionsOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["questionnaires", "types", type, "versions", token],
    enabled: Boolean(token) && Boolean(type) && isEnabled,
    queryFn: () => {
      if (!type) {
        throw new Error("Questionnaire type is required.");
      }

      return fetchQuestionnaireVersionsByType(type);
    },
  });
}
