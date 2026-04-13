"use client";

import { useMutation } from "@tanstack/react-query";

import { generateBatchReport } from "@/features/faculty-analytics/api/faculty-analytics.requests";

export function useGenerateBatchReport() {
  return useMutation({
    mutationFn: generateBatchReport,
  });
}
