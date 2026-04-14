"use client";

import { useQuery } from "@tanstack/react-query";

import { listPipelines } from "@/features/faculty-analytics/api/analysis-pipeline.requests";
import type { ListPipelinesQuery } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseLatestPipelineForScopeOptions = {
  enabled?: boolean;
};

// Caches the full array (not first-or-null) so that `useCreatePipeline`'s
// onSuccess can seed the same cache key with a single-element array,
// matching the shape `listPipelines` returns. Consumers derive
// `latestPipeline = data?.[0] ?? null`.
export function useLatestPipelineForScope(
  query: ListPipelinesQuery,
  options?: UseLatestPipelineForScopeOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  const result = useQuery({
    // Intentionally no token in queryKey — token is an Axios interceptor
    // header, not cache identity (diverges from use-faculty-report.ts which
    // includes the token). This ensures invalidation works consistently.
    queryKey: ["analysis", "list-pipelines-for-scope", query],
    enabled: Boolean(token) && Boolean(query.semesterId) && isEnabled,
    queryFn: () => listPipelines(query),
  });

  return {
    ...result,
    latestPipeline: result.data?.[0] ?? null,
  };
}
