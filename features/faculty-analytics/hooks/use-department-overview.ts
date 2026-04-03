"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchDepartmentOverview } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import type { DepartmentOverviewQuery } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseDepartmentOverviewOptions = {
  enabled?: boolean;
};

export function useDepartmentOverview(
  params: DepartmentOverviewQuery,
  options?: UseDepartmentOverviewOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["faculty-analytics", "department-overview", params, token],
    enabled: Boolean(token) && Boolean(params.semesterId) && isEnabled,
    placeholderData: keepPreviousData,
    queryFn: () => fetchDepartmentOverview(params),
  });
}
