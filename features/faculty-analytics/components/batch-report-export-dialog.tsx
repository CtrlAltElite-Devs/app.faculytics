"use client";

import { useState } from "react";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { PaginationFooter } from "@/components/shared/pagination-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBatchReportStatus } from "@/features/faculty-analytics/hooks/use-batch-report-status";
import { ReportExportStateCard } from "@/features/faculty-analytics/components/report-export-state-card";
import { useGenerateBatchReport } from "@/features/faculty-analytics/hooks/use-generate-batch-report";
import { ALL_PROGRAMS_VALUE } from "@/features/faculty-analytics/constants/filters";
import {
  formatReportJobStatusLabel,
  getBatchProgressValue,
  isPresignedUrlExpired,
  resolveBatchSetupMessage,
} from "@/features/faculty-analytics/lib/report-export";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import { resolveQuestionnaireTypeLabel } from "@/features/questionnaires/types";
import { resolveApiErrorMessage } from "@/lib/api-errors";
import { formatDateTime, formatRelativeTime } from "@/lib/date";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";

type BatchReportExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semesterId: string | null;
  semesterLabel: string;
  programId: string | null;
  programs: Array<{
    id: string | null;
    label: string;
  }>;
};

export function BatchReportExportDialog({
  open,
  onOpenChange,
  semesterId,
  semesterLabel,
  programId,
  programs,
}: BatchReportExportDialogProps) {
  const [selectedQuestionnaireTypeCode, setSelectedQuestionnaireTypeCode] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(programId);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(DEFAULT_PAGE_SIZE);
  const [setupMessage, setSetupMessage] = useState<string | null>(null);
  const [batchSummary, setBatchSummary] = useState<{
    jobCount: number;
    skippedCount: number;
  } | null>(null);
  const questionnaireTypesQuery = useQuestionnaireTypes({ enabled: open });
  const questionnaireTypes = questionnaireTypesQuery.data ?? [];
  const generateBatchReportMutation = useGenerateBatchReport();
  const batchStatusQuery = useBatchReportStatus(
    batchId
      ? {
          batchId,
          page: currentPage,
          limit: rowsPerPage,
        }
      : null,
    { enabled: open && Boolean(batchId) }
  );

  const effectiveQuestionnaireTypeCode =
    selectedQuestionnaireTypeCode || questionnaireTypes[0]?.code || "";

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setBatchId(null);
      setCurrentPage(1);
      setRowsPerPage(DEFAULT_PAGE_SIZE);
      setSetupMessage(null);
      setBatchSummary(null);
      setSelectedProgramId(programId);
      setSelectedQuestionnaireTypeCode("");
      generateBatchReportMutation.reset();
    }

    onOpenChange(nextOpen);
  }

  async function handleGenerate() {
    if (!semesterId) {
      toast.error("Select a semester before generating batch exports.");
      return;
    }

    if (!effectiveQuestionnaireTypeCode) {
      toast.error("Select a questionnaire type for the batch export.");
      return;
    }

    try {
      const response = await generateBatchReportMutation.mutateAsync({
        semesterId,
        questionnaireTypeCode: effectiveQuestionnaireTypeCode,
        programId: selectedProgramId ?? undefined,
      });

      if (response.jobCount === 0) {
        setBatchId(null);
        setBatchSummary(null);
        setCurrentPage(1);
        setSetupMessage(resolveBatchSetupMessage(response.jobCount, response.skippedCount));
        return;
      }

      setBatchId(response.batchId);
      setBatchSummary({
        jobCount: response.jobCount,
        skippedCount: response.skippedCount,
      });
      setSetupMessage(null);
      setCurrentPage(1);
    } catch (error) {
      toast.error(resolveApiErrorMessage(error, "Unable to queue the batch export right now."));
    }
  }

  const batchStatus = batchStatusQuery.data;
  const selectedQuestionnaireTypeLabel =
    questionnaireTypes.find((type) => type.code === effectiveQuestionnaireTypeCode)?.name ?? null;
  const selectedProgramLabel =
    programs.find((program) => program.id === selectedProgramId)?.label ??
    programs[0]?.label ??
    "All Programs";
  const progressValue = getBatchProgressValue(
    batchStatus?.total ?? 0,
    batchStatus?.completed ?? 0,
    batchStatus?.failed ?? 0,
    batchStatus?.skipped ?? 0
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Batch Report Export</DialogTitle>
          <DialogDescription>
            Generate faculty report PDFs for the currently selected semester and program scope.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 space-y-5 overflow-hidden">
          <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
            <dl className="space-y-2 font-sans text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Semester</dt>
                <dd className="text-right font-medium">{semesterLabel}</dd>
              </div>
              {batchId ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Program</dt>
                    <dd className="text-right font-medium">{selectedProgramLabel}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Questionnaire Type</dt>
                    <dd className="text-right font-medium">
                      {selectedQuestionnaireTypeCode
                        ? resolveQuestionnaireTypeLabel(
                            selectedQuestionnaireTypeCode,
                            selectedQuestionnaireTypeLabel
                          )
                        : "Not selected"}
                    </dd>
                  </div>
                </>
              ) : null}
            </dl>
          </div>

          {!batchId ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="font-sans text-sm font-medium text-foreground">Program</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between px-4 py-2.5 font-sans text-sm"
                      >
                        <span className="truncate">{selectedProgramLabel}</span>
                        <ChevronDown className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
                    >
                      <DropdownMenuRadioGroup
                        value={selectedProgramId ?? ALL_PROGRAMS_VALUE}
                        onValueChange={(value) => {
                          setSelectedProgramId(value === ALL_PROGRAMS_VALUE ? null : value);
                        }}
                      >
                        {programs.map((program) => (
                          <DropdownMenuRadioItem
                            key={program.id ?? ALL_PROGRAMS_VALUE}
                            value={program.id ?? ALL_PROGRAMS_VALUE}
                            className="font-sans text-sm"
                          >
                            {program.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <p className="font-sans text-sm font-medium text-foreground">
                    Questionnaire type
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between px-4 py-2.5 font-sans text-sm"
                        disabled={
                          questionnaireTypesQuery.isLoading || questionnaireTypes.length === 0
                        }
                      >
                        <span className="truncate">
                          {effectiveQuestionnaireTypeCode
                            ? resolveQuestionnaireTypeLabel(
                                effectiveQuestionnaireTypeCode,
                                selectedQuestionnaireTypeLabel
                              )
                            : "Select questionnaire type"}
                        </span>
                        <ChevronDown className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
                    >
                      <DropdownMenuRadioGroup
                        value={effectiveQuestionnaireTypeCode}
                        onValueChange={setSelectedQuestionnaireTypeCode}
                      >
                        {questionnaireTypes.map((type) => (
                          <DropdownMenuRadioItem
                            key={type.code}
                            value={type.code}
                            className="font-sans text-sm"
                          >
                            {resolveQuestionnaireTypeLabel(type.code, type.name)}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {setupMessage ? (
                <ReportExportStateCard
                  title="No export generated"
                  badgeLabel="Skipped"
                  tone="warning"
                  message={setupMessage}
                />
              ) : null}
            </>
          ) : null}

          {batchId ? (
            <>
              <div className="space-y-4 rounded-lg border border-border/70 bg-muted/20 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-sans text-sm font-medium text-foreground">Batch progress</p>
                    <p className="font-sans text-sm text-muted-foreground">Batch ID: {batchId}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void batchStatusQuery.refetch()}
                  >
                    Refresh Status
                  </Button>
                </div>

                <Progress value={progressValue} className="h-2" />

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <div className="rounded-md border border-border/70 px-3 py-2">
                    <p className="font-sans text-xs text-muted-foreground">Total</p>
                    <p className="font-sans text-lg font-semibold">{batchStatus?.total ?? 0}</p>
                  </div>
                  <div className="rounded-md border border-border/70 px-3 py-2">
                    <p className="font-sans text-xs text-muted-foreground">Completed</p>
                    <p className="font-sans text-lg font-semibold">{batchStatus?.completed ?? 0}</p>
                  </div>
                  <div className="rounded-md border border-border/70 px-3 py-2">
                    <p className="font-sans text-xs text-muted-foreground">Failed</p>
                    <p className="font-sans text-lg font-semibold">{batchStatus?.failed ?? 0}</p>
                  </div>
                  <div className="rounded-md border border-border/70 px-3 py-2">
                    <p className="font-sans text-xs text-muted-foreground">Skipped</p>
                    <p className="font-sans text-lg font-semibold">{batchStatus?.skipped ?? 0}</p>
                  </div>
                  <div className="rounded-md border border-border/70 px-3 py-2">
                    <p className="font-sans text-xs text-muted-foreground">Active</p>
                    <p className="font-sans text-lg font-semibold">{batchStatus?.active ?? 0}</p>
                  </div>
                  <div className="rounded-md border border-border/70 px-3 py-2">
                    <p className="font-sans text-xs text-muted-foreground">Waiting</p>
                    <p className="font-sans text-lg font-semibold">{batchStatus?.waiting ?? 0}</p>
                  </div>
                </div>

                {batchSummary ? (
                  <p className="font-sans text-sm text-muted-foreground">
                    Queued {batchSummary.jobCount} report job
                    {batchSummary.jobCount === 1 ? "" : "s"}.
                    {batchSummary.skippedCount > 0
                      ? ` ${batchSummary.skippedCount} entr${
                          batchSummary.skippedCount === 1 ? "y was" : "ies were"
                        } skipped before queueing.`
                      : null}
                  </p>
                ) : null}
              </div>

              <Separator />

              {generateBatchReportMutation.isPending || batchStatusQuery.isLoading ? (
                <div className="rounded-lg border border-border/70 bg-muted/20 px-4 py-5">
                  <div className="flex items-center gap-3">
                    <LoaderCircle className="size-5 animate-spin text-brand-blue" />
                    <p className="font-sans text-sm text-muted-foreground">
                      Loading batch export progress...
                    </p>
                  </div>
                </div>
              ) : null}

              {!batchStatusQuery.isLoading && batchStatus && batchStatus.jobs.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/70 px-4 py-5">
                  <p className="font-sans text-sm text-muted-foreground">
                    No report jobs were queued for this batch scope.
                  </p>
                </div>
              ) : null}

              {!batchStatusQuery.isLoading && batchStatus && batchStatus.jobs.length > 0 ? (
                <div className="space-y-4">
                  <div className="scrollbar-hidden max-h-[24rem] overflow-y-auto pr-1">
                    <div className="data-table-wrapper">
                      <Table className="w-full table-fixed [&_td]:whitespace-normal [&_th]:whitespace-normal">
                        <TableHeader className="data-table-header">
                          <TableRow>
                            <TableHead className="data-table-head w-[24%]">Faculty</TableHead>
                            <TableHead className="data-table-head w-[18%]">Status</TableHead>
                            <TableHead className="data-table-head w-[38%]">Details</TableHead>
                            <TableHead className="data-table-head w-[20%] text-right">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {batchStatus.jobs.map((job) => {
                            const expired = isPresignedUrlExpired(job.expiresAt);

                            return (
                              <TableRow key={job.jobId} className="data-table-row">
                                <TableCell className="data-table-cell align-top">
                                  <div>
                                    <p className="font-sans text-sm font-semibold text-foreground">
                                      {job.facultyName}
                                    </p>
                                    <p className="mt-1 font-sans text-xs text-muted-foreground">
                                      Created {formatRelativeTime(job.createdAt)}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="data-table-cell align-top">
                                  <Badge variant="outline">
                                    {formatReportJobStatusLabel(job.status)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="data-table-cell align-top">
                                  <div className="space-y-1 font-sans text-sm text-muted-foreground">
                                    {job.status === "completed" ? (
                                      <>
                                        <p>
                                          {expired
                                            ? "Secure link expired. Refresh status to get a new URL."
                                            : `Secure link expires ${formatRelativeTime(job.expiresAt ?? "")}.`}
                                        </p>
                                        {job.completedAt ? (
                                          <p className="text-xs">
                                            Completed {formatDateTime(job.completedAt)}
                                          </p>
                                        ) : null}
                                      </>
                                    ) : null}
                                    {job.status === "failed" ? (
                                      <p>{job.error ?? "Export failed."}</p>
                                    ) : null}
                                    {job.status === "skipped" ? (
                                      <p>{job.message ?? "Export skipped for this faculty."}</p>
                                    ) : null}
                                    {(job.status === "waiting" || job.status === "active") && (
                                      <p>Report generation is still in progress.</p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="data-table-cell align-top text-right">
                                  {job.status === "completed" ? (
                                    <div className="flex flex-wrap justify-end gap-2">
                                      <Button
                                        asChild
                                        size="sm"
                                        disabled={!job.downloadUrl || expired}
                                      >
                                        <a href={job.downloadUrl} target="_blank" rel="noreferrer">
                                          View
                                        </a>
                                      </Button>
                                    </div>
                                  ) : (
                                    <span className="font-sans text-xs text-muted-foreground">
                                      No action
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <PaginationFooter
                    itemCount={batchStatus.meta.itemCount}
                    totalItems={batchStatus.meta.totalItems}
                    currentPage={batchStatus.meta.currentPage}
                    totalPages={batchStatus.meta.totalPages}
                    itemLabel="report jobs"
                    rowsPerPage={batchStatus.meta.itemsPerPage}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={setRowsPerPage}
                  />
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <DialogFooter className="gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={generateBatchReportMutation.isPending}
          >
            Close
          </Button>

          {!batchId ? (
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={
                generateBatchReportMutation.isPending ||
                !semesterId ||
                !effectiveQuestionnaireTypeCode ||
                questionnaireTypesQuery.isLoading
              }
            >
              {generateBatchReportMutation.isPending ? "Queueing..." : "Generate Batch"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
