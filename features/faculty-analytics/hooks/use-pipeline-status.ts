"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchPipelineStatus } from "@/features/faculty-analytics/api/analysis-pipeline.requests";
import type { PipelineStatus } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

const TERMINAL_STATUSES: ReadonlySet<PipelineStatus> = new Set<PipelineStatus>([
  "COMPLETED",
  "FAILED",
  "CANCELLED",
]);

type UsePipelineStatusOptions = {
  enabled?: boolean;
};

export function usePipelineStatus(pipelineId: string | null, options?: UsePipelineStatusOptions) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    // No token in queryKey — see use-latest-pipeline-for-scope comment.
    queryKey: ["analysis", "pipeline-status", pipelineId],
    enabled: Boolean(token) && Boolean(pipelineId) && isEnabled,
    queryFn: () => fetchPipelineStatus(pipelineId!),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && TERMINAL_STATUSES.has(status) ? false : 3000;
    },
  });
}
