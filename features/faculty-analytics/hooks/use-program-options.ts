"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchProgramOptions } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import type { ListProgramsQuery } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseProgramOptionsOptions = {
  enabled?: boolean;
};

export function useProgramOptions(params: ListProgramsQuery, options?: UseProgramOptionsOptions) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["curriculum", "program-options", params, token],
    enabled: Boolean(token) && Boolean(params.semesterId) && isEnabled,
    placeholderData: keepPreviousData,
    queryFn: () => fetchProgramOptions(params),
  });
}
