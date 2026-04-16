"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReportExportStateCard } from "@/features/faculty-analytics/components/report-export-state-card";
import { useGenerateSingleReport } from "@/features/faculty-analytics/hooks/use-generate-single-report";
import { useReportStatus } from "@/features/faculty-analytics/hooks/use-report-status";
import { isPresignedUrlExpired } from "@/features/faculty-analytics/lib/report-export";
import { resolveApiErrorMessage } from "@/lib/api-errors";
import { formatDateTime, formatRelativeTime } from "@/lib/date";

type ReportExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facultyId: string;
  facultyName: string;
  semesterId: string;
  semesterLabel: string;
  questionnaireTypeCode: string;
  questionnaireTypeLabel: string;
};

export function ReportExportDialog({
  open,
  onOpenChange,
  facultyId,
  facultyName,
  semesterId,
  semesterLabel,
  questionnaireTypeCode,
  questionnaireTypeLabel,
}: ReportExportDialogProps) {
  const [jobId, setJobId] = useState<string | null>(null);
  const generateReportMutation = useGenerateSingleReport();
  const statusQuery = useReportStatus(jobId, { enabled: open && Boolean(jobId) });
  const status = statusQuery.data;
  const urlExpired = isPresignedUrlExpired(status?.expiresAt);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setJobId(null);
      generateReportMutation.reset();
    }

    onOpenChange(nextOpen);
  }

  async function handleGenerate() {
    try {
      const response = await generateReportMutation.mutateAsync({
        facultyId,
        semesterId,
        questionnaireTypeCode,
      });

      setJobId(response.jobId);
    } catch (error) {
      toast.error(resolveApiErrorMessage(error, "Unable to queue the report export right now."));
    }
  }

  const isGenerating =
    generateReportMutation.isPending || status?.status === "waiting" || status?.status === "active";
  const isCompleted = status?.status === "completed";
  const isFailed = status?.status === "failed";
  const isSkipped = status?.status === "skipped";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export Faculty Report</DialogTitle>
          <DialogDescription>
            Generate a PDF report for the selected faculty analytics view.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
            <dl className="space-y-2 font-sans text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Faculty</dt>
                <dd className="text-right font-medium">{facultyName}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Semester</dt>
                <dd className="text-right font-medium">{semesterLabel}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Questionnaire Type</dt>
                <dd className="text-right font-medium">{questionnaireTypeLabel}</dd>
              </div>
            </dl>
          </div>

          {isGenerating ? (
            <div className="rounded-lg border border-border/70 bg-muted/20 px-4 py-5">
              <div className="flex items-center gap-3">
                <LoaderCircle className="size-5 animate-spin text-brand-blue" />
                <div className="space-y-1">
                  <p className="font-sans text-sm font-medium text-foreground">
                    Report generation in progress
                  </p>
                  <p className="font-sans text-sm text-muted-foreground">
                    Current status: {status?.status ?? "waiting"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {isCompleted ? (
            <ReportExportStateCard
              title="Report ready"
              badgeLabel="Completed"
              tone="success"
              message={
                urlExpired
                  ? "The secure PDF link has expired. Close this dialog and generate a new PDF to access the report again."
                  : `Secure link expires ${formatRelativeTime(status?.expiresAt ?? "")}.`
              }
              meta={
                status?.completedAt ? `Completed ${formatDateTime(status.completedAt)}` : undefined
              }
            />
          ) : null}

          {isFailed ? (
            <ReportExportStateCard
              title="Export failed"
              badgeLabel="Failed"
              tone="error"
              message={status?.error ?? "The backend could not generate the PDF for this report."}
            />
          ) : null}

          {isSkipped ? (
            <ReportExportStateCard
              title="No export generated"
              badgeLabel="Skipped"
              tone="warning"
              message="No evaluation data found"
            />
          ) : null}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={generateReportMutation.isPending}
            className="w-full sm:w-auto"
          >
            Close
          </Button>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
            {!jobId ? (
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={generateReportMutation.isPending}
                className="w-full sm:w-auto"
              >
                {generateReportMutation.isPending ? "Queueing..." : "Generate PDF"}
              </Button>
            ) : null}

            {isFailed || isSkipped ? (
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={generateReportMutation.isPending}
                className="w-full sm:w-auto"
              >
                Retry Export
              </Button>
            ) : null}

            {isCompleted ? (
              <Button
                asChild
                disabled={!status?.downloadUrl || urlExpired}
                className="w-full sm:w-auto"
              >
                <a href={status?.downloadUrl} target="_blank" rel="noreferrer">
                  View PDF
                </a>
              </Button>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
