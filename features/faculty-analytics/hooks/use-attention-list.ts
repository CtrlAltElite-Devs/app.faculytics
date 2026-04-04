"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchAttentionList } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import type { AttentionListQuery } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseAttentionListOptions = {
  enabled?: boolean;
};

export function useAttentionList(params: AttentionListQuery, options?: UseAttentionListOptions) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["faculty-analytics", "attention-list", params, token],
    enabled: Boolean(token) && Boolean(params.semesterId) && isEnabled,
    placeholderData: keepPreviousData,
    queryFn: () => fetchAttentionList(params),
  });
}
