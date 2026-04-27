"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ActivityIcon,
  CheckCircle2,
  CircleAlert,
  FileText,
  Loader2,
  PlayIcon,
  RefreshCcw,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_ROLES, type AppRole } from "@/constants/roles";
import { useActiveRole } from "@/features/auth/hooks/use-active-role";
import { PipelineConfirmDialog } from "@/features/faculty-analytics/components/pipeline-confirm-dialog";
import { PipelineStatusDialog } from "@/features/faculty-analytics/components/pipeline-status-dialog";
import { useCancelPipeline } from "@/features/faculty-analytics/hooks/use-cancel-pipeline";
import { useConfirmPipeline } from "@/features/faculty-analytics/hooks/use-confirm-pipeline";
import { useCreatePipeline } from "@/features/faculty-analytics/hooks/use-create-pipeline";
import { usePipelineStatus } from "@/features/faculty-analytics/hooks/use-pipeline-status";
import {
  RUNNING_STATUSES,
  STATUS_HEADLINE,
  TERMINAL_STATUSES,
  STAGE_LABELS,
  STAGE_ORDER,
  activeStageIndex,
} from "@/features/faculty-analytics/lib/pipeline-formatting";
import { cn } from "@/lib/utils";
import type {
  PipelineScopeIds,
  PipelineStatus,
  PipelineSummary,
} from "@/features/faculty-analytics/types";

type FacultyAnalysisStatusStripProps = {
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

function formatExact(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function StatusIcon({ status }: { status: PipelineStatus | undefined }) {
  if (!status) {
    return (
      <div className="flex size-8 items-center justify-center rounded-lg border border-border/70 bg-muted/40 text-muted-foreground">
        <PlayIcon className="size-4" />
      </div>
    );
  }
  if (status === "COMPLETED") {
    return (
      <div className="flex size-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-4" />
      </div>
    );
  }
  if (status === "FAILED") {
    return (
      <div className="flex size-8 items-center justify-center rounded-lg border border-destructive/40 bg-destructive/10 text-destructive">
        <XCircle className="size-4" />
      </div>
    );
  }
  if (status === "CANCELLED") {
    return (
      <div className="flex size-8 items-center justify-center rounded-lg border border-border/70 bg-muted/40 text-muted-foreground">
        <CircleAlert className="size-4" />
      </div>
    );
  }
  if (RUNNING_STATUSES.has(status)) {
    return (
      <div className="flex size-8 items-center justify-center rounded-lg border border-brand-blue/30 bg-brand-blue/12 text-brand-blue">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex size-8 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400">
      <ActivityIcon className="size-4" />
    </div>
  );
}

function StatusPill({ status }: { status: PipelineStatus | undefined }) {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        Not run
      </span>
    );
  }
  const isCompleted = status === "COMPLETED";
  const isRunning = RUNNING_STATUSES.has(status);
  const isFailed = status === "FAILED";
  const isCancelled = status === "CANCELLED";
  const isAwaiting = status === "AWAITING_CONFIRMATION";

  const className = cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
    isCompleted && "bg-foreground text-background",
    isRunning && "bg-brand-blue/15 text-brand-blue",
    isFailed && "bg-destructive text-destructive-foreground",
    isCancelled && "border border-border bg-muted text-muted-foreground",
    isAwaiting && "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    !isCompleted &&
      !isRunning &&
      !isFailed &&
      !isCancelled &&
      !isAwaiting &&
      "bg-muted text-muted-foreground"
  );

  return <span className={className}>{STATUS_HEADLINE[status]}</span>;
}

function GradientBar() {
  return (
    <div className="h-1 w-full overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-brand-blue via-brand-blue/60 to-brand-yellow" />
    </div>
  );
}

export function FacultyAnalysisStatusStrip({
  scope,
  pipeline,
  onStatusChange,
}: FacultyAnalysisStatusStripProps) {
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

  const previousStatusRef = useRef<PipelineStatus | undefined>(undefined);

  useEffect(() => {
    const previous = previousStatusRef.current;
    previousStatusRef.current = liveStatus;
    if (
      liveStatus &&
      TERMINAL_STATUSES.has(liveStatus) &&
      previous !== undefined &&
      previous !== liveStatus
    ) {
      queryClient.invalidateQueries({
        queryKey: ["analysis", "list-pipelines-for-scope"],
      });
      if (liveStatus === "COMPLETED") {
        queryClient.invalidateQueries({
          queryKey: ["faculty-analytics", "qualitative-summary"],
        });
      }
    }
  }, [liveStatus, queryClient]);

  const createMutation = useCreatePipeline();
  const confirmMutation = useConfirmPipeline();
  const cancelMutation = useCancelPipeline();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const confirmPayload: PipelineSummary | null = useMemo(() => {
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
      onSuccess: () => setIsConfirmOpen(false),
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

  const isRunning = Boolean(liveStatus && RUNNING_STATUSES.has(liveStatus));
  const isAwaiting = liveStatus === "AWAITING_CONFIRMATION";
  const isTerminal = Boolean(liveStatus && TERMINAL_STATUSES.has(liveStatus));
  const hasNoPipeline = pipeline === null;

  const lastUpdated = formatExact(pipeline?.updatedAt);
  const completedAt = formatExact(statusQuery.data?.completedAt ?? pipeline?.completedAt);
  const nextScheduled = formatExact(statusQuery.data?.nextScheduledRunAt);

  const stagesView = statusQuery.data ? activeStageIndex(statusQuery.data.stages) : null;
  const activeStageLabel =
    isRunning && stagesView !== null && stagesView < STAGE_ORDER.length
      ? STAGE_LABELS[STAGE_ORDER[stagesView]]
      : null;

  const headline = liveStatus
    ? STATUS_HEADLINE[liveStatus]
    : hasNoPipeline
      ? "Analysis pending"
      : "Pipeline ready";

  let subline: string;
  if (isRunning && activeStageLabel) {
    subline = `Step ${(stagesView ?? 0) + 1} of ${STAGE_ORDER.length} · ${activeStageLabel}`;
  } else if (liveStatus === "COMPLETED") {
    const tail =
      lastUpdated && nextScheduled
        ? `Last updated ${lastUpdated}. Next refresh ${nextScheduled}.`
        : lastUpdated
          ? `Last updated ${lastUpdated}.`
          : "Themes and recommendations are ready below.";
    subline = `Themes and recommendations are ready below. ${tail}`.trim();
  } else if (liveStatus === "FAILED") {
    subline = statusQuery.data?.errorMessage ?? "The pipeline failed. Re-run when ready.";
  } else if (liveStatus === "CANCELLED") {
    subline = "The last run was cancelled. Re-run when ready.";
  } else if (isAwaiting) {
    subline = "Snapshot captured. Review coverage and confirm to run.";
  } else if (hasNoPipeline) {
    subline = canTrigger
      ? "Trigger the pipeline to surface themes and recommendations from feedback."
      : "Your analysis will run automatically once student feedback is available.";
  } else {
    subline = "Ready.";
  }

  return (
    <>
      <section
        aria-label="Analysis status"
        className={cn(
          "overflow-hidden rounded-2xl border bg-card shadow-sm",
          liveStatus === "COMPLETED" && "border-emerald-500/30",
          liveStatus === "FAILED" && "border-destructive/40",
          isRunning && "border-brand-blue/30",
          !liveStatus && "border-border/70",
          (liveStatus === "CANCELLED" || isAwaiting) && "border-border/70"
        )}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4">
          <StatusIcon status={liveStatus} />

          <div className="min-w-0 flex-1">
            <h3 className="font-sans text-sm font-semibold text-foreground">{headline}</h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {subline}
              {liveStatus === "COMPLETED" && completedAt ? (
                <>
                  {" "}
                  <span className="font-mono">· {completedAt}</span>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={liveStatus} />

            {canTrigger && pipeline && !isAwaiting ? (
              <Button
                variant="outline"
                size="sm"
                className="font-sans"
                onClick={() => setIsStatusOpen(true)}
              >
                <FileText className="mr-1.5 size-3.5" />
                {isRunning ? "Live status" : "Run details"}
              </Button>
            ) : null}

            {canTrigger && isAwaiting ? (
              <Button size="sm" className="font-sans" onClick={handleRun}>
                Review &amp; start
              </Button>
            ) : null}

            {canTrigger && (hasNoPipeline || isTerminal) && !isAwaiting ? (
              <Button
                size="sm"
                className="font-sans"
                onClick={handleRun}
                disabled={createMutation.isPending || !scope.semesterId}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    Preparing…
                  </>
                ) : isTerminal ? (
                  <>
                    <RefreshCcw className="mr-1.5 size-3.5" />
                    Re-run
                  </>
                ) : (
                  <>
                    <PlayIcon className="mr-1.5 size-3.5" />
                    Run analysis
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </div>
        <GradientBar />
      </section>

      <PipelineConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        pipeline={confirmPayload}
        onConfirm={handleConfirm}
        onCancel={handleCancelFromConfirm}
        isConfirming={confirmMutation.isPending}
        isCancelling={cancelMutation.isPending}
        voiceBreakdown={statusQuery.data?.coverage.voiceBreakdown ?? null}
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
