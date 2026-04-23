"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchFacultyOverview } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import type { FacultyOverviewQuery } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseFacultyOverviewOptions = {
  enabled?: boolean;
};

export function useFacultyOverview(
  params: FacultyOverviewQuery,
  options?: UseFacultyOverviewOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["faculty-analytics", "faculty-overview", params, token],
    enabled: Boolean(token) && Boolean(params.facultyId) && Boolean(params.semesterId) && isEnabled,
    queryFn: () => fetchFacultyOverview(params),
    staleTime: 60_000,
  });
}
