"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchSemesters } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import type { ListSemestersQuery } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseSemesterOptionsOptions = {
  enabled?: boolean;
};

export function useSemesterOptions(
  params?: ListSemestersQuery,
  options?: UseSemesterOptionsOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["semesters", params, token],
    enabled: Boolean(token) && isEnabled,
    queryFn: () => fetchSemesters(params),
  });
}
