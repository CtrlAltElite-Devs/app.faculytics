"use client";

import { Info } from "lucide-react";

import { AnimatedNumber } from "@/components/animated-number";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CompositeRatingBreakdownPopover } from "@/features/faculty-analytics/components/composite-rating-breakdown-popover";
import { getFacultyReportInterpretationTextClass } from "@/features/faculty-analytics/lib/faculty-report-detail";
import type { FacultyOverviewResponseDto } from "@/features/faculty-analytics/types";

type CompositeRatingSummaryStripProps = {
  data: FacultyOverviewResponseDto | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

function AmberDot() {
  return <span className="size-1.5 rounded-full bg-amber-500" aria-hidden />;
}

function LoadingRow() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-border/70 bg-card px-5 py-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Overall rating
        </p>
        <Skeleton className="mt-1 h-8 w-32" />
      </div>
    </div>
  );
}

function ErrorRow({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border border-border/70 bg-card px-5 py-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Overall rating
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Composite unavailable</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

export function CompositeRatingSummaryStrip({
  data,
  isLoading,
  isError,
  onRetry,
}: CompositeRatingSummaryStripProps) {
  if (isLoading) {
    return <LoadingRow />;
  }

  if (isError || !data) {
    return <ErrorRow onRetry={onRetry} />;
  }

  const { composite, contributions } = data;
  const isCoverageIncomplete = composite.coverageStatus !== "FULL";
  const hasRating = composite.rating !== null && composite.rating !== undefined;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-border/70 bg-card px-5 py-4">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Overall rating
        </p>
        <div className="mt-1 flex items-center gap-2">
          {hasRating && composite.rating !== null ? (
            <span className="font-playfair text-2xl font-semibold tabular-nums text-foreground">
              <AnimatedNumber value={composite.rating} decimals={2} />
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">Insufficient data</span>
          )}

          {hasRating && composite.interpretation !== null ? (
            <span
              className={cn(
                "text-xs font-medium",
                getFacultyReportInterpretationTextClass(composite.interpretation)
              )}
            >
              {composite.interpretation}
            </span>
          ) : null}

          {isCoverageIncomplete ? <AmberDot /> : null}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                aria-label="View rating breakdown"
              >
                <Info className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <CompositeRatingBreakdownPopover
                composite={composite}
                contributions={contributions}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
