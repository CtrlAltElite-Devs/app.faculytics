import type { Query } from "@tanstack/react-query";

/**
 * Predicate that matches all questionnaire version-related queries
 * (version details + type-specific version lists) without matching
 * the questionnaire types query.
 */
export function isVersionQuery(query: Query): boolean {
  return query.queryKey[0] === "questionnaires" && query.queryKey.includes("versions");
}
