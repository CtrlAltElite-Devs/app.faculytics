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
import { formatFacetLabel } from "@/features/faculty-analytics/lib/facet-filter";
import type { Facet, PipelineSummary, VoiceBreakdown } from "@/features/faculty-analytics/types";

type PipelineConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipeline: PipelineSummary | null;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming: boolean;
  isCancelling: boolean;
  // FAC-135 Phase C (Task C9): optional composition row derived from
  // coverage.voiceBreakdown. Hidden gracefully if absent.
  voiceBreakdown?: VoiceBreakdown | null;
};

// Keys on VoiceBreakdown (deliberately narrower than Facet — excludes
// `overall`, which is a UI-only aggregate label that has no coverage slice
// on its own).
type VoiceBreakdownKey = keyof VoiceBreakdown;

const COMPOSITION_KEYS: readonly VoiceBreakdownKey[] = [
  "facultyFeedback",
  "inClassroom",
  "outOfClassroom",
  "other",
];

function compositionLabel(key: VoiceBreakdownKey): string {
  if (key === "other") return "Other";
  // All non-`other` keys are valid Facet values (overall excluded by design).
  return formatFacetLabel(key as Facet);
}

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
  voiceBreakdown,
}: PipelineConfirmDialogProps) {
  if (!pipeline) return null;

  const coverage = pipeline.coverage;
  const warnings = pipeline.warnings ?? [];
  const busy = isConfirming || isCancelling;
  const breakdown = voiceBreakdown ?? coverage.voiceBreakdown ?? null;

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

        {breakdown ? (
          <div className="rounded-xl border border-border/70 bg-muted/10 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Voice composition
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {COMPOSITION_KEYS.map((key) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-2.5 py-1 font-sans text-[11px] text-muted-foreground"
                >
                  <span className="font-medium text-foreground">{compositionLabel(key)}</span>
                  <span className="tabular-nums">{breakdown[key].submissionCount}</span>
                </span>
              ))}
            </div>
          </div>
        ) : null}

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
