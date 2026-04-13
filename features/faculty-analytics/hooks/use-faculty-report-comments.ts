"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchFacultyReportComments } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import type { FacultyReportCommentsQuery } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseFacultyReportCommentsOptions = {
  enabled?: boolean;
};

export function useFacultyReportComments(
  params: FacultyReportCommentsQuery,
  options?: UseFacultyReportCommentsOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["faculty-analytics", "faculty-report-comments", params, token],
    enabled:
      Boolean(token) &&
      Boolean(params.facultyId) &&
      Boolean(params.semesterId) &&
      Boolean(params.questionnaireTypeCode) &&
      isEnabled,
    placeholderData: keepPreviousData,
    queryFn: () => fetchFacultyReportComments(params),
  });
}
