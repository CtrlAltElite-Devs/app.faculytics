"use client";

import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import type { QuestionnaireTypeCode } from "@/features/questionnaires/types";

/**
 * Resolve a questionnaire type code to its UUID via the cached types query.
 * Returns `null` while types are loading or if the code is not found.
 */
export function useQuestionnaireTypeId(code: QuestionnaireTypeCode | null) {
  const typesQuery = useQuestionnaireTypes();
  if (!code || code.trim().length === 0) return null;
  return typesQuery.data?.find((t) => t.code === code)?.id ?? null;
}
