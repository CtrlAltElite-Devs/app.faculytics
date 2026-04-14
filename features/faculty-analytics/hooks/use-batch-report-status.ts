"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchBatchReportStatus } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import type { BatchReportStatusQuery } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";

type UseBatchReportStatusOptions = {
  enabled?: boolean;
};

export function useBatchReportStatus(
  params: BatchReportStatusQuery | null,
  options?: UseBatchReportStatusOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["faculty-analytics", "batch-report-status", params, token],
    enabled: Boolean(token) && Boolean(params?.batchId) && isEnabled,
    placeholderData: keepPreviousData,
    queryFn: () =>
      fetchBatchReportStatus({
        batchId: params?.batchId ?? "",
        page: params?.page,
        limit: params?.limit,
      }),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) {
        return 2000;
      }

      const terminalJobs = data.completed + data.failed + data.skipped;
      return terminalJobs < data.total ? 2000 : false;
    },
  });
}
