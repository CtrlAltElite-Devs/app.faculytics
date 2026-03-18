"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchQuestionnaireVersionById,
  fetchQuestionnaireVersionsByType,
} from "@/features/questionnaires/api/questionnaire.requests";
import { useAuthStore } from "@/stores/auth-store";
import type { QuestionnaireType } from "@/features/questionnaires/types";

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
    queryFn: async () => {
      if (!type) {
        throw new Error("Questionnaire type is required.");
      }

      return fetchQuestionnaireVersionsByType(type);
    },
  });
}

export function useQuestionnaireVersion(versionId: string | null, options?: UseQuestionnaireVersionsOptions) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["questionnaires", "versions", versionId, token],
    enabled: Boolean(token) && Boolean(versionId) && isEnabled,
    queryFn: async () => {
      if (!versionId) {
        throw new Error("Questionnaire version is required.");
      }

      return fetchQuestionnaireVersionById(versionId);
    },
  });
}
