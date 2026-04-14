"use client";

import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Circle,
  Loader2,
  MinusCircle,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PipelineStatusBadge } from "@/features/faculty-analytics/components/pipeline-status-badge";
import {
  RUNNING_STATUSES,
  STAGE_DESCRIPTIONS,
  STAGE_LABELS,
  STAGE_ORDER,
  STATUS_HEADLINE,
  TERMINAL_STATUSES,
  type StageKey,
  activeStageIndex,
  overallElapsedLabel,
  stageElapsedLabel,
} from "@/features/faculty-analytics/lib/pipeline-formatting";
import type {
  PipelineStageStatus,
  PipelineStatusResponse,
} from "@/features/faculty-analytics/types";
import { cn } from "@/lib/utils";

type PipelineStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: PipelineStatusResponse | undefined;
  isLoading?: boolean;
  onCancelPipeline: () => void;
  isCancelling: boolean;
};

type StageNodeProps = {
  stageKey: StageKey;
  stage: PipelineStageStatus;
  isActive: boolean;
  showConnector: boolean;
  extraDetail?: string;
};

function StageIcon({
  status,
  isActive,
  className,
}: {
  status: PipelineStageStatus["status"];
  isActive: boolean;
  className?: string;
}) {
  const map: Record<PipelineStageStatus["status"], { Icon: LucideIcon; tone: string }> = {
    completed: { Icon: CheckCircle2, tone: "text-emerald-500" },
    processing: { Icon: Loader2, tone: "text-primary" },
    failed: { Icon: XCircle, tone: "text-destructive" },
    skipped: { Icon: MinusCircle, tone: "text-muted-foreground" },
    pending: { Icon: Circle, tone: "text-muted-foreground/60" },
  };
  const { Icon, tone } = map[status];
  return (
    <Icon
      className={cn(
        "size-4",
        tone,
        status === "processing" && "animate-spin",
        isActive && "drop-shadow-[0_0_6px_currentColor]",
        className
      )}
    />
  );
}

function StageNode({ stageKey, stage, isActive, showConnector, extraDetail }: StageNodeProps) {
  const status = stage.status;
  const isCompleted = status === "completed";
  const isFailed = status === "failed";
  const isPending = status === "pending";
  const progress = stage.progress;
  const elapsed = stageElapsedLabel(stage);

  return (
    <li className="relative pb-6 last:pb-0">
      {showConnector ? (
        <span
          aria-hidden
          className={cn(
            "absolute left-[9px] top-6 bottom-0 w-px",
            isCompleted ? "bg-emerald-500/40" : isActive ? "bg-primary/40" : "bg-border"
          )}
        />
      ) : null}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "relative mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border-2 bg-background transition-colors",
            isCompleted && "border-emerald-500/60",
            isActive && !isCompleted && "border-primary shadow-[0_0_0_4px_var(--color-primary)]/10",
            isFailed && "border-destructive/70",
            !isActive && !isCompleted && !isFailed && "border-border"
          )}
        >
          {isActive && !isCompleted && !isFailed ? (
            <span
              aria-hidden
              className="absolute inset-0 animate-ping rounded-full bg-primary/30"
            />
          ) : null}
          <StageIcon status={status} isActive={isActive} />
        </div>
        <div className="flex-1 pt-0.5">
          <div className="flex items-baseline justify-between gap-3">
            <p
              className={cn("font-sans text-sm font-medium", isPending && "text-muted-foreground")}
            >
              {STAGE_LABELS[stageKey]}
            </p>
            {elapsed ? (
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {elapsed}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 font-sans text-xs text-muted-foreground">
            {STAGE_DESCRIPTIONS[stageKey]}
          </p>
          {progress && progress.total > 0 ? (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width]",
                    isCompleted ? "bg-emerald-500" : "bg-primary"
                  )}
                  style={{
                    width: `${Math.min(100, (progress.current / progress.total) * 100)}%`,
                  }}
                />
              </div>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {progress.current}/{progress.total}
              </span>
            </div>
          ) : null}
          {extraDetail ? (
            <p className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
              {extraDetail}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusDialogSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
      <ul className="space-y-4 pt-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <li key={i} className="flex items-start gap-4">
            <div className="mt-0.5 size-5 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted/70" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PipelineStatusDialog({
  open,
  onOpenChange,
  status,
  isLoading,
  onCancelPipeline,
  isCancelling,
}: PipelineStatusDialogProps) {
  // Loading shim — the status query fires once on mount even for a cached
  // terminal pipeline, so briefly the dialog may open before data arrives.
  if (!status) {
    if (!open) return null;
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Loading run
            </p>
            <DialogTitle className="font-playfair text-2xl tracking-tight">
              Fetching pipeline record…
            </DialogTitle>
            <DialogDescription className="font-sans text-sm">
              {isLoading
                ? "Reading stages and timing from the analysis service."
                : "No data available yet."}
            </DialogDescription>
          </DialogHeader>
          <StatusDialogSkeleton />
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="font-sans">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const stages = status.stages;
  const active = activeStageIndex(stages);
  const elapsed = overallElapsedLabel(status.createdAt, status.completedAt);
  const isRunning = RUNNING_STATUSES.has(status.status);
  const isTerminal = TERMINAL_STATUSES.has(status.status);
  const isCompleted = status.status === "COMPLETED";
  const isFailed = status.status === "FAILED";
  const isCancelled = status.status === "CANCELLED";

  const eyebrow = isRunning ? "Live telemetry" : "Run record";

  const gateExtra =
    stages.sentimentGate.included != null || stages.sentimentGate.excluded != null
      ? `${stages.sentimentGate.included ?? 0} included · ${stages.sentimentGate.excluded ?? 0} excluded`
      : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {eyebrow}
              </p>
              <DialogTitle className="font-playfair text-2xl tracking-tight">
                {STATUS_HEADLINE[status.status]}
              </DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-sm">
                <span>
                  Started{" "}
                  <span className="font-mono tabular-nums">{formatClock(status.createdAt)}</span>
                </span>
                <span className="text-muted-foreground/50">·</span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {elapsed} {isTerminal ? "total" : "elapsed"}
                </span>
              </DialogDescription>
            </div>
            <PipelineStatusBadge status={status.status} />
          </div>
        </DialogHeader>

        {/* Terminal state summary rail — lives ABOVE the timeline, so the
            reader sees the final result first, then scans the record. */}
        {isTerminal ? (
          <div
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4 text-sm",
              isCompleted && "border-emerald-500/35 bg-emerald-50/60 dark:bg-emerald-950/20",
              isFailed && "border-destructive/40 bg-destructive/5",
              isCancelled && "border-border/70 bg-muted/30"
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : isFailed ? (
              <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
            ) : (
              <Ban className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p
                className={cn(
                  "font-sans font-medium",
                  isCompleted && "text-emerald-900 dark:text-emerald-200",
                  isFailed && "text-destructive",
                  isCancelled && "text-foreground"
                )}
              >
                {isCompleted
                  ? `Finished in ${elapsed}`
                  : isFailed
                    ? "Run ended in failure"
                    : "Run was cancelled"}
              </p>
              <p className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                {status.completedAt
                  ? `Closed ${formatClock(status.completedAt)} · ${new Date(status.completedAt).toLocaleDateString()}`
                  : `Last update ${formatClock(status.updatedAt)}`}
              </p>
            </div>
          </div>
        ) : null}

        <ol className="relative">
          {STAGE_ORDER.map((key, i) => (
            <StageNode
              key={key}
              stageKey={key}
              stage={stages[key]}
              isActive={i === active && isRunning}
              showConnector={i < STAGE_ORDER.length - 1}
              extraDetail={key === "sentimentGate" ? gateExtra : undefined}
            />
          ))}
        </ol>

        {status.warnings.length > 0 ? (
          <div className="rounded-xl border border-amber-500/40 bg-amber-50/70 p-3 text-sm dark:bg-amber-950/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="space-y-1">
                <p className="font-sans font-semibold text-amber-900 dark:text-amber-200">
                  Warnings
                </p>
                <ul className="ml-4 list-disc space-y-0.5 font-sans text-xs text-amber-900/90 dark:text-amber-100/90">
                  {status.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {status.errorMessage ? (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-sm">
            <div className="flex items-start gap-2">
              <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div>
                <p className="font-sans font-semibold text-destructive">Error</p>
                <p className="mt-0.5 font-sans text-xs text-destructive/90">
                  {status.errorMessage}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-2">
          {isRunning ? (
            <Button
              variant="outline"
              onClick={onCancelPipeline}
              disabled={isCancelling}
              className="font-sans"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Cancelling…
                </>
              ) : (
                "Cancel pipeline"
              )}
            </Button>
          ) : null}
          <Button
            variant={isRunning || isTerminal ? "default" : "outline"}
            onClick={() => onOpenChange(false)}
            className="font-sans"
          >
            {isTerminal ? "Close record" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
