"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import {
  buildQuestionnaireTypeOptions,
  resolveActiveQuestionnaireType,
} from "@/features/questionnaires/lib/questionnaire-type-options";
import {
  resolveQuestionnaireType,
  type QuestionnaireTypeSummary,
} from "@/features/questionnaires/types";

const EMPTY_TYPE_SUMMARIES: QuestionnaireTypeSummary[] = [];

type UseQuestionnaireTypeResolutionOptions = {
  enabled?: boolean;
};

export function useQuestionnaireTypeResolution(options?: UseQuestionnaireTypeResolutionOptions) {
  const searchParams = useSearchParams();
  const requestedType = resolveQuestionnaireType(searchParams.get("type"));
  const questionnaireTypesQuery = useQuestionnaireTypes({ enabled: options?.enabled });
  const typeSummaries = questionnaireTypesQuery.data ?? EMPTY_TYPE_SUMMARIES;

  const availableTypeOptions = useMemo(
    () => buildQuestionnaireTypeOptions(typeSummaries),
    [typeSummaries]
  );

  const fetchedCodes = useMemo(() => typeSummaries.map((summary) => summary.code), [typeSummaries]);

  const requestedTypeUnavailable =
    questionnaireTypesQuery.isSuccess &&
    fetchedCodes.length > 0 &&
    !fetchedCodes.includes(requestedType);

  const activeType = useMemo(
    () =>
      resolveActiveQuestionnaireType({
        requestedType,
        availableTypeOptions,
        isResolved: questionnaireTypesQuery.isSuccess,
      }),
    [availableTypeOptions, questionnaireTypesQuery.isSuccess, requestedType]
  );

  const activeTypeSummary = useMemo(
    () => availableTypeOptions.find((summary) => summary.code === activeType) ?? null,
    [activeType, availableTypeOptions]
  );

  const activeTypeId = useMemo(
    () => typeSummaries.find((summary) => summary.code === activeType)?.id ?? null,
    [activeType, typeSummaries]
  );

  const availableTypes = useMemo(
    () => availableTypeOptions.map((summary) => summary.code),
    [availableTypeOptions]
  );

  return {
    searchParams,
    questionnaireTypesQuery,
    requestedType,
    requestedTypeUnavailable,
    availableTypeOptions,
    availableTypes,
    activeType,
    activeTypeSummary,
    activeTypeId,
  };
}
