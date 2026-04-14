"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPipeline } from "@/features/faculty-analytics/api/analysis-pipeline.requests";
import type { CreatePipelineRequest, PipelineSummary } from "@/features/faculty-analytics/types";

export function useCreatePipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPipeline,
    onSuccess: (createdPipeline: PipelineSummary, variables: CreatePipelineRequest) => {
      // Seed the same cache key as useLatestPipelineForScope so the trigger
      // card transitions Run → Awaiting Confirmation in a single render,
      // without waiting for a list refetch. Key + value shape MUST match
      // that hook's query exactly (`list-pipelines-for-scope`,
      // single-element array) or the seed is invisible to subscribers.
      queryClient.setQueryData(
        ["analysis", "list-pipelines-for-scope", variables],
        [createdPipeline]
      );
      // Background-refresh any other scoped listings that might exist.
      queryClient.invalidateQueries({
        queryKey: ["analysis", "list-pipelines-for-scope"],
      });
    },
  });
}
