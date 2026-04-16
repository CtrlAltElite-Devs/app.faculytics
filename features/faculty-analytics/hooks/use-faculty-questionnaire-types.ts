"use client";

import { useQuery } from "@tanstack/react-query";

import { getFacultyQuestionnaireTypes } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import type {
  FacultyQuestionnaireTypesQuery,
  FacultyQuestionnaireTypesResponseDto,
} from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseFacultyQuestionnaireTypesOptions = {
  enabled?: boolean;
};

export function useFacultyQuestionnaireTypes(
  params: FacultyQuestionnaireTypesQuery,
  options?: UseFacultyQuestionnaireTypesOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery<FacultyQuestionnaireTypesResponseDto>({
    queryKey: ["faculty-analytics", "faculty-questionnaire-types", params, token],
    enabled: Boolean(token) && Boolean(params.facultyId) && Boolean(params.semesterId) && isEnabled,
    queryFn: () => getFacultyQuestionnaireTypes(params),
  });
}
