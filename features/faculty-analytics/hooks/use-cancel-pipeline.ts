"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelPipeline } from "@/features/faculty-analytics/api/analysis-pipeline.requests";

export function useCancelPipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelPipeline,
    onSuccess: (_pipeline, pipelineId) => {
      queryClient.invalidateQueries({
        queryKey: ["analysis", "pipeline-status", pipelineId],
      });
      queryClient.invalidateQueries({
        queryKey: ["analysis", "list-pipelines-for-scope"],
      });
    },
  });
}
