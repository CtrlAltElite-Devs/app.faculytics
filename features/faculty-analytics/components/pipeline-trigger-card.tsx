"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ActivityIcon,
  CheckCircle2,
  Loader2,
  PlayIcon,
  RefreshCcw,
  ScrollTextIcon,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_ROLES, type AppRole } from "@/constants/roles";
import { useActiveRole } from "@/features/auth/hooks/use-active-role";
import { PipelineConfirmDialog } from "@/features/faculty-analytics/components/pipeline-confirm-dialog";
import { PipelineStatusDialog } from "@/features/faculty-analytics/components/pipeline-status-dialog";
import { PipelineStatusBadge } from "@/features/faculty-analytics/components/pipeline-status-badge";
import { useCancelPipeline } from "@/features/faculty-analytics/hooks/use-cancel-pipeline";
import { useConfirmPipeline } from "@/features/faculty-analytics/hooks/use-confirm-pipeline";
import { useCreatePipeline } from "@/features/faculty-analytics/hooks/use-create-pipeline";
import { usePipelineStatus } from "@/features/faculty-analytics/hooks/use-pipeline-status";
import {
  RUNNING_STATUSES,
  STATUS_HEADLINE,
  TERMINAL_STATUSES,
  activeStageIndex,
  overallElapsedLabel,
  STAGE_LABELS,
  STAGE_ORDER,
} from "@/features/faculty-analytics/lib/pipeline-formatting";
import type {
  PipelineScopeIds,
  PipelineStatus,
  PipelineSummary,
} from "@/features/faculty-analytics/types";
import { cn } from "@/lib/utils";

type PipelineTriggerCardProps = {
  scope: PipelineScopeIds;
  pipeline: PipelineSummary | null;
  onStatusChange?: (status: PipelineStatus) => void;
};

const TRIGGER_ROLES: ReadonlySet<AppRole> = new Set<AppRole>([
  APP_ROLES.DEAN,
  APP_ROLES.CHAIRPERSON,
  APP_ROLES.CAMPUS_HEAD,
  APP_ROLES.SUPER_ADMIN,
]);

function extractErrorMessage(err: unknown): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object" &&
    (err as { response?: { data?: unknown } }).response !== null
  ) {
    const data = (err as { response: { data?: { message?: unknown } } }).response.data;
    if (typeof data?.message === "string") return data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

export function PipelineTriggerCard({ scope, pipeline, onStatusChange }: PipelineTriggerCardProps) {
  const queryClient = useQueryClient();
  const { activeRole } = useActiveRole();
  const canTrigger = activeRole ? TRIGGER_ROLES.has(activeRole) : false;

  const statusQuery = usePipelineStatus(pipeline?.id ?? null, {
    enabled: Boolean(pipeline?.id),
  });
  const liveStatus: PipelineStatus | undefined = statusQuery.data?.status ?? pipeline?.status;

  useEffect(() => {
    if (liveStatus) onStatusChange?.(liveStatus);
  }, [liveStatus, onStatusChange]);

  // Reactivity fix: when polling detects a terminal transition, refresh the
  // list-pipelines-for-scope cache so `latestPipeline.status` in the parent
  // screen becomes COMPLETED/FAILED/CANCELLED — which in turn unlocks the
  // recommendations query gate so themes + recs render without refresh.
  useEffect(() => {
    if (liveStatus && TERMINAL_STATUSES.has(liveStatus)) {
      queryClient.invalidateQueries({
        queryKey: ["analysis", "list-pipelines-for-scope"],
      });
    }
  }, [liveStatus, queryClient]);

  const createMutation = useCreatePipeline();
  const confirmMutation = useConfirmPipeline();
  const cancelMutation = useCancelPipeline();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const confirmPipelinePayload: PipelineSummary | null = useMemo(() => {
    // If polling has fresher coverage/warnings than the list summary, prefer
    // those. We shape the status-response fields into the summary contract
    // for the confirm dialog which expects PipelineSummary.
    if (statusQuery.data && pipeline) {
      return {
        ...pipeline,
        status: statusQuery.data.status,
        coverage: statusQuery.data.coverage,
        warnings: statusQuery.data.warnings,
        updatedAt: statusQuery.data.updatedAt,
      };
    }
    return pipeline;
  }, [statusQuery.data, pipeline]);

  const handleRun = () => {
    // If there's an existing AWAITING pipeline, don't recreate — just open
    // the dialog against it. Backend is idempotent via the unique index.
    if (pipeline && pipeline.status === "AWAITING_CONFIRMATION") {
      setIsConfirmOpen(true);
      return;
    }
    createMutation.mutate(scope, {
      onSuccess: () => setIsConfirmOpen(true),
    });
  };

  const handleConfirm = () => {
    if (!pipeline?.id) return;
    confirmMutation.mutate(pipeline.id, {
      onSuccess: () => {
        setIsConfirmOpen(false);
      },
    });
  };

  const handleCancelFromConfirm = () => {
    if (!pipeline?.id) return;
    cancelMutation.mutate(pipeline.id, {
      onSuccess: () => setIsConfirmOpen(false),
    });
  };

  const handleCancelFromStatus = () => {
    if (!pipeline?.id) return;
    cancelMutation.mutate(pipeline.id, {
      onSuccess: () => setIsStatusOpen(false),
    });
  };

  // ─── Faculty view ───────────────────────────────────────────────────────
  if (!canTrigger) {
    if (!pipeline || !liveStatus) return null;
    return (
      <section className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-sm">
        <ActivityIcon className="size-4 text-muted-foreground" />
        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Analysis
          </p>
          <p className="font-sans text-sm">
            Last updated{" "}
            <span className="font-mono tabular-nums">
              {new Date(pipeline.updatedAt).toLocaleString()}
            </span>
          </p>
        </div>
        <PipelineStatusBadge status={liveStatus} />
      </section>
    );
  }

  // ─── Scoped-role view ───────────────────────────────────────────────────
  const isRunning = Boolean(liveStatus && RUNNING_STATUSES.has(liveStatus));
  const isTerminal = Boolean(liveStatus && TERMINAL_STATUSES.has(liveStatus));
  const isAwaiting = liveStatus === "AWAITING_CONFIRMATION";
  const hasNoPipeline = pipeline === null;

  const mutationError = createMutation.error ?? confirmMutation.error ?? cancelMutation.error;

  const stagesView = statusQuery.data ? activeStageIndex(statusQuery.data.stages) : null;

  const activeStageLabel =
    isRunning && stagesView !== null && stagesView < STAGE_ORDER.length
      ? STAGE_LABELS[STAGE_ORDER[stagesView]]
      : null;

  return (
    <>
      <section
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-colors",
          isRunning
            ? "border-primary/30"
            : isTerminal && liveStatus === "COMPLETED"
              ? "border-emerald-500/30"
              : isTerminal && liveStatus === "FAILED"
                ? "border-destructive/40"
                : "border-border/70"
        )}
      >
        {isRunning ? (
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-[2px] animate-[pulse_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        ) : null}

        <div className="flex items-start justify-between gap-6 px-6 pt-5">
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Faculty feedback analysis
            </p>
            <h2 className="font-playfair text-xl tracking-tight">
              {liveStatus ? STATUS_HEADLINE[liveStatus] : "Pipeline ready"}
            </h2>
            <p className="font-sans text-sm text-muted-foreground">
              {hasNoPipeline
                ? "Trigger the pipeline to generate themes and recommendations from qualitative feedback."
                : isAwaiting
                  ? "Snapshot captured. Review coverage and confirm to run."
                  : isRunning && activeStageLabel
                    ? `Step ${stagesView! + 1} of ${STAGE_ORDER.length} · ${activeStageLabel}`
                    : liveStatus === "COMPLETED"
                      ? "Analysis complete. Themes and recommendations are surfaced below."
                      : liveStatus === "FAILED"
                        ? "The pipeline failed. Review the error and re-run when ready."
                        : liveStatus === "CANCELLED"
                          ? "The last run was cancelled. Re-run when ready."
                          : "Ready."}
            </p>
          </div>
          {liveStatus ? <PipelineStatusBadge status={liveStatus} /> : null}
        </div>

        {/* Live progress track for running pipelines */}
        {isRunning && statusQuery.data ? (
          <div className="mx-6 mt-5 rounded-xl border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                In progress
              </p>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {overallElapsedLabel(statusQuery.data.createdAt, statusQuery.data.completedAt)}{" "}
                elapsed
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1">
              {STAGE_ORDER.map((key) => {
                const s = statusQuery.data!.stages[key];
                const done = s.status === "completed";
                const active = s.status === "processing";
                const failed = s.status === "failed";
                return (
                  <div
                    key={key}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      done
                        ? "bg-emerald-500"
                        : active
                          ? "bg-primary"
                          : failed
                            ? "bg-destructive"
                            : "bg-muted"
                    )}
                    title={STAGE_LABELS[key]}
                  />
                );
              })}
            </div>
            <p className="mt-2 font-sans text-xs text-muted-foreground">
              {activeStageLabel ?? "Waiting"}
            </p>
          </div>
        ) : null}

        {/* Terminal completion summary */}
        {liveStatus === "COMPLETED" && statusQuery.data ? (
          <div className="mx-6 mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-50/60 p-4 text-sm dark:bg-emerald-950/20">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="flex-1">
              <p className="font-sans font-medium text-emerald-900 dark:text-emerald-200">
                Analysis completed in{" "}
                <span className="font-mono tabular-nums">
                  {overallElapsedLabel(statusQuery.data.createdAt, statusQuery.data.completedAt)}
                </span>
              </p>
              <p className="mt-0.5 font-sans text-xs text-emerald-800/80 dark:text-emerald-100/70">
                Themes and recommendations are ready below.
              </p>
            </div>
          </div>
        ) : null}

        {liveStatus === "FAILED" && statusQuery.data?.errorMessage ? (
          <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="font-sans font-medium text-destructive">Pipeline failed</p>
              <p className="mt-0.5 font-sans text-xs text-destructive/90">
                {statusQuery.data.errorMessage}
              </p>
            </div>
          </div>
        ) : null}

        {mutationError ? (
          <div className="mx-6 mt-5 rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {extractErrorMessage(mutationError)}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 pb-5 pt-5">
          <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {pipeline
              ? `Last updated ${new Date(pipeline.updatedAt).toLocaleString()}`
              : "No previous run"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {/* Status dialog entry — available whenever a pipeline exists
                (running OR terminal). Muted ghost style so it doesn't
                compete with the primary Run / Re-run action. */}
            {pipeline && !isAwaiting ? (
              <Button
                variant="ghost"
                onClick={() => setIsStatusOpen(true)}
                className="font-sans text-muted-foreground hover:text-foreground"
              >
                {isRunning ? (
                  <>
                    <ActivityIcon className="mr-2 size-4" />
                    View live status
                  </>
                ) : (
                  <>
                    <ScrollTextIcon className="mr-2 size-4" />
                    View run details
                  </>
                )}
              </Button>
            ) : null}
            {isAwaiting ? (
              <Button onClick={handleRun} className="font-sans">
                Review &amp; start
              </Button>
            ) : null}
            {(hasNoPipeline || isTerminal) && !isAwaiting ? (
              <Button
                onClick={handleRun}
                disabled={createMutation.isPending || !scope.semesterId}
                className="font-sans"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Preparing snapshot…
                  </>
                ) : isTerminal ? (
                  <>
                    <RefreshCcw className="mr-2 size-4" />
                    Re-run analysis
                  </>
                ) : (
                  <>
                    <PlayIcon className="mr-2 size-4" />
                    Run analysis
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <PipelineConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        pipeline={confirmPipelinePayload}
        onConfirm={handleConfirm}
        onCancel={handleCancelFromConfirm}
        isConfirming={confirmMutation.isPending}
        isCancelling={cancelMutation.isPending}
      />

      <PipelineStatusDialog
        open={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        status={statusQuery.data}
        isLoading={statusQuery.isLoading || statusQuery.isFetching}
        onCancelPipeline={handleCancelFromStatus}
        isCancelling={cancelMutation.isPending}
      />
    </>
  );
}
