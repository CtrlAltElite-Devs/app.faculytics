"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchFacultyReport } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import type { FacultyReportQuery } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseFacultyReportOptions = {
  enabled?: boolean;
};

export function useFacultyReport(params: FacultyReportQuery, options?: UseFacultyReportOptions) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["faculty-analytics", "faculty-report", params, token],
    enabled:
      Boolean(token) &&
      Boolean(params.facultyId) &&
      Boolean(params.semesterId) &&
      Boolean(params.questionnaireTypeCode) &&
      isEnabled,
    queryFn: () => fetchFacultyReport(params),
  });
}
