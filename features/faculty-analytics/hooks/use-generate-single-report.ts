"use client";

import { useMutation } from "@tanstack/react-query";

import { generateSingleReport } from "@/features/faculty-analytics/api/faculty-analytics.requests";

export function useGenerateSingleReport() {
  return useMutation({
    mutationFn: generateSingleReport,
  });
}
