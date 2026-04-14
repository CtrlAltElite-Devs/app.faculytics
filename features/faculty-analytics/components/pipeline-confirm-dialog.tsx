"use client";

import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PipelineSummary } from "@/features/faculty-analytics/types";

type PipelineConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipeline: PipelineSummary | null;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming: boolean;
  isCancelling: boolean;
};

function formatPercent(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${Math.round(n * 100)}`;
}

export function PipelineConfirmDialog({
  open,
  onOpenChange,
  pipeline,
  onConfirm,
  onCancel,
  isConfirming,
  isCancelling,
}: PipelineConfirmDialogProps) {
  if (!pipeline) return null;

  const coverage = pipeline.coverage;
  const warnings = pipeline.warnings ?? [];
  const busy = isConfirming || isCancelling;

  return (
    <Dialog open={open} onOpenChange={busy ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Review analysis snapshot
          </p>
          <DialogTitle className="font-playfair text-2xl tracking-tight">
            Start analysis pipeline?
          </DialogTitle>
          <DialogDescription className="font-sans text-sm">
            These numbers lock when you confirm. The run typically takes a few minutes and cannot be
            edited once it starts.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border/70 bg-muted/20">
          <div className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Response rate
            </p>
            <p className="mt-1.5 font-playfair text-3xl leading-none tabular-nums">
              {formatPercent(coverage.responseRate)}
              <span className="ml-0.5 text-lg text-muted-foreground">%</span>
            </p>
            <p className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
              {coverage.submissionCount}/{coverage.totalEnrolled} enrolled
            </p>
          </div>
          <div className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Submissions
            </p>
            <p className="mt-1.5 font-playfair text-3xl leading-none tabular-nums">
              {coverage.submissionCount}
            </p>
            <p className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
              received
            </p>
          </div>
          <div className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Comments
            </p>
            <p className="mt-1.5 font-playfair text-3xl leading-none tabular-nums">
              {coverage.commentCount}
            </p>
            <p className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
              with qualitative text
            </p>
          </div>
        </div>

        {warnings.length > 0 ? (
          <div className="rounded-xl border border-amber-500/40 bg-amber-50/70 p-4 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="flex-1 space-y-2">
                <p className="font-sans text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Coverage warnings · {warnings.length}
                </p>
                <ul className="ml-5 list-disc space-y-1 font-sans text-sm text-amber-900/90 dark:text-amber-100/90">
                  {warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-50/70 p-4 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="font-sans text-sm font-medium text-emerald-900 dark:text-emerald-200">
                No coverage warnings — the snapshot looks healthy.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onCancel} disabled={busy} className="font-sans">
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Cancelling…
              </>
            ) : (
              "Cancel this run"
            )}
          </Button>
          <Button onClick={onConfirm} disabled={busy} className="font-sans">
            {isConfirming ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Starting…
              </>
            ) : (
              "Start analysis"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
