"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchScopedFacultyList } from "@/features/faculty-evaluation/api/faculty-evaluation.requests";
import type { FacultyEvaluationListQuery } from "@/features/faculty-evaluation/types";
import { useAuthStore } from "@/stores/auth-store";

type UseScopedFacultyListOptions = {
  enabled?: boolean;
};

export function useScopedFacultyList(
  params: FacultyEvaluationListQuery,
  options?: UseScopedFacultyListOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["faculty-evaluation", "faculty-list", params, token],
    enabled: Boolean(token) && Boolean(params.semesterId) && isEnabled,
    placeholderData: keepPreviousData,
    queryFn: () => fetchScopedFacultyList(params),
  });
}
