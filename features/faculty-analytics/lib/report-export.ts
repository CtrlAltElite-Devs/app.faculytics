import type { ReportJobStatus } from "@/features/faculty-analytics/types";

export function isPresignedUrlExpired(expiresAt?: string) {
  return Boolean(expiresAt) && new Date(expiresAt ?? "").getTime() <= Date.now();
}

export function getBatchProgressValue(
  total: number,
  completed: number,
  failed: number,
  skipped: number
) {
  if (total <= 0) {
    return 0;
  }

  return Math.round(((completed + failed + skipped) / total) * 100);
}

export function formatReportJobStatusLabel(status: ReportJobStatus) {
  return status
    .split("_")
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

export function resolveBatchSetupMessage(jobCount: number, skippedCount: number) {
  if (jobCount > 0) {
    return null;
  }

  if (skippedCount > 0) {
    return "No new batch exports were queued because matching reports are already pending for this selection.";
  }

  return "No eligible faculty report submissions were found for the selected semester, program, and questionnaire type.";
}
