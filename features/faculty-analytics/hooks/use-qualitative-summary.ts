"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchQualitativeSummary } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import type { QualitativeSummaryQuery } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseQualitativeSummaryOptions = {
  enabled?: boolean;
};

export function useQualitativeSummary(
  params: QualitativeSummaryQuery,
  options?: UseQualitativeSummaryOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: [
      "faculty-analytics",
      "qualitative-summary",
      params.facultyId,
      params.semesterId,
      params.questionnaireTypeCode,
      params.courseId ?? "all",
      token,
    ],
    enabled:
      Boolean(token) &&
      Boolean(params.facultyId) &&
      Boolean(params.semesterId) &&
      Boolean(params.questionnaireTypeCode) &&
      isEnabled,
    refetchOnWindowFocus: false,
    queryFn: () => fetchQualitativeSummary(params),
  });
}
