"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchReportStatus } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import { useAuthStore } from "@/stores/auth-store";

const TERMINAL_STATUSES = new Set(["completed", "failed", "skipped"]);

type UseReportStatusOptions = {
  enabled?: boolean;
};

export function useReportStatus(jobId: string | null, options?: UseReportStatusOptions) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["faculty-analytics", "report-status", jobId, token],
    enabled: Boolean(token) && Boolean(jobId) && isEnabled,
    queryFn: () => fetchReportStatus(jobId ?? ""),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return !status || !TERMINAL_STATUSES.has(status) ? 2000 : false;
    },
  });
}
