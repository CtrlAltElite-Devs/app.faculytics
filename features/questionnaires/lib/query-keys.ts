import type { Query } from "@tanstack/react-query";

import type { ListQuestionnaireTypeManagementRequest } from "@/features/questionnaires/types";

export const questionnaireManagementQueryKeys = {
  all: ["questionnaire-types"] as const,
  lists: () => [...questionnaireManagementQueryKeys.all, "list"] as const,
  list: (filters: ListQuestionnaireTypeManagementRequest | undefined, token: string | null) =>
    [...questionnaireManagementQueryKeys.lists(), filters, token] as const,
  details: () => [...questionnaireManagementQueryKeys.all, "detail"] as const,
  detail: (id: string | null, token: string | null) =>
    [...questionnaireManagementQueryKeys.details(), id, token] as const,
};

/**
 * Predicate that matches all questionnaire version-related queries
 * (version details + type-specific version lists) without matching
 * the questionnaire types query.
 */
export function isVersionQuery(query: Query): boolean {
  return query.queryKey[0] === "questionnaires" && query.queryKey.includes("versions");
}

export function isQuestionnaireTypeManagementQuery(query: Query): boolean {
  return query.queryKey[0] === questionnaireManagementQueryKeys.all[0];
}
