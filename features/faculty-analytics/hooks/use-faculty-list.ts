"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchFacultyList } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import type { FacultyListQuery } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseFacultyListOptions = {
  enabled?: boolean;
};

export function useFacultyList(params: FacultyListQuery, options?: UseFacultyListOptions) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["faculty-analytics", "faculty-list", params, token],
    enabled: Boolean(token) && Boolean(params.semesterId) && isEnabled,
    placeholderData: keepPreviousData,
    queryFn: () => fetchFacultyList(params),
  });
}
