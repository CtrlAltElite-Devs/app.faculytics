"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { confirmPipeline } from "@/features/faculty-analytics/api/analysis-pipeline.requests";

export function useConfirmPipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmPipeline,
    onSuccess: (_pipeline, pipelineId) => {
      queryClient.invalidateQueries({
        queryKey: ["analysis", "pipeline-status", pipelineId],
      });
      // Also refresh scoped list caches so any subscriber rendering the
      // summary's `status` field (not just the live status hook) sees the
      // new running state.
      queryClient.invalidateQueries({
        queryKey: ["analysis", "list-pipelines-for-scope"],
      });
    },
  });
}
