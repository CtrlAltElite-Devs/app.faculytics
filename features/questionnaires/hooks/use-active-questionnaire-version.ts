"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchLatestActiveVersion,
  fetchQuestionnaireVersionsByType,
} from "@/features/questionnaires/api/questionnaire.requests";
import { useAuthStore } from "@/stores/auth-store";
import type { QuestionnaireType } from "@/features/questionnaires/types";

/**
 * Fetches the full active version detail (with schema) for a questionnaire type.
 *
 * Uses a two-step approach:
 * 1. GET /types/:type/versions → get questionnaireId
 * 2. GET /:id/latest-active-version → get full version with schemaSnapshot
 *
 * This avoids the role-restricted GET /versions/:versionId endpoint.
 */
export function useActiveQuestionnaireVersion(
  type: QuestionnaireType | null,
  options?: { enabled?: boolean }
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["questionnaires", "active-version", type, token],
    enabled: Boolean(token) && Boolean(type) && isEnabled,
    queryFn: async () => {
      if (!type) throw new Error("Questionnaire type is required.");

      const typeSummary = await fetchQuestionnaireVersionsByType(type);
      const questionnaireId = typeSummary.questionnaireId;

      if (!questionnaireId) return null;

      return fetchLatestActiveVersion(questionnaireId);
    },
  });
}
