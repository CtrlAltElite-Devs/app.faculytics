"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useQuestionnaireTypeResolution } from "@/features/questionnaires/hooks/use-questionnaire-type-resolution";
import { normalizeTypeSearchParam } from "@/features/questionnaires/lib/questionnaire-type-routing";

export function useQuestionnaireRouteState() {
  const router = useRouter();
  const routeState = useQuestionnaireTypeResolution();
  const { searchParams, questionnaireTypesQuery, activeType } = routeState;

  useEffect(() => {
    normalizeTypeSearchParam({
      isResolved: questionnaireTypesQuery.isSuccess,
      currentTypeParam: searchParams.get("type"),
      normalizedType: activeType,
      pathname: "/superadmin/questionnaires/new",
      searchParams,
      router,
    });
  }, [activeType, questionnaireTypesQuery.isSuccess, router, searchParams]);

  return {
    router,
    ...routeState,
  };
}
