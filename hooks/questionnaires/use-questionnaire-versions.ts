"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchQuestionnaireVersionById,
  fetchQuestionnaireVersionsByType,
} from "@/network/requests/questionnaires";
import { useAuthStore } from "@/stores/auth-store";
import type { QuestionnaireBuilderServerContext, QuestionnaireType } from "@/types/questionnaires";

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
    queryFn: async (): Promise<QuestionnaireBuilderServerContext> => {
      if (!type) {
        throw new Error("Questionnaire type is required.");
      }

      const versionsResponse = await fetchQuestionnaireVersionsByType(type);
      const draftVersionSummary = versionsResponse.versions.find((version) => version.status === "DRAFT");
      const draftVersion = draftVersionSummary
        ? await fetchQuestionnaireVersionById(draftVersionSummary.id)
        : null;

      return {
        ...versionsResponse,
        draftVersion,
      };
    },
  });
}
