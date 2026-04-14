"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchPipelineRecommendations } from "@/features/faculty-analytics/api/analysis-pipeline.requests";
import type { PipelineStatus } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

// Gate on PIPELINE status `'COMPLETED'` — NOT recommendations.status
// (that's RunStatus, a different enum). The recommendations run finishes
// before the pipeline transitions to COMPLETED, so pipeline.status is the
// correct readiness signal.
export function usePipelineRecommendations(
  pipelineId: string | null,
  pipelineStatus: PipelineStatus | undefined
) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["analysis", "pipeline-recommendations", pipelineId],
    enabled: Boolean(token) && Boolean(pipelineId) && pipelineStatus === "COMPLETED",
    queryFn: () => fetchPipelineRecommendations(pipelineId!),
  });
}
