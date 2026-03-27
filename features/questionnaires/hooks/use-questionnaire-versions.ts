"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchQuestionnaireVersionById,
  fetchQuestionnaireVersionsByType,
} from "@/features/questionnaires/api/questionnaire.requests";
import { useAuthStore } from "@/stores/auth-store";

type UseQuestionnaireVersionsOptions = {
  enabled?: boolean;
};

export function useQuestionnaireVersions(
  typeId: string | null,
  options?: UseQuestionnaireVersionsOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["questionnaires", "types", typeId, "versions", token],
    enabled: Boolean(token) && Boolean(typeId) && isEnabled,
    queryFn: async () => {
      if (!typeId) {
        throw new Error("Questionnaire type ID is required.");
      }

      return fetchQuestionnaireVersionsByType(typeId);
    },
  });
}

export function useQuestionnaireVersion(
  versionId: string | null,
  options?: UseQuestionnaireVersionsOptions
) {
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
