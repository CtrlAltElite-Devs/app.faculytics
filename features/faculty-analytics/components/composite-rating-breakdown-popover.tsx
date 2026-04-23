"use client";

import { cn } from "@/lib/utils";
import { getFacultyReportInterpretationTextClass } from "@/features/faculty-analytics/lib/faculty-report-detail";
import {
  COMPOSITE_TYPE_ORDER,
  type CompositeCoverageStatus,
  type FacultyOverviewCompositeDto,
  type FacultyOverviewContributionDto,
} from "@/features/faculty-analytics/types";

type CompositeRatingBreakdownPopoverProps = {
  composite: FacultyOverviewCompositeDto;
  contributions: FacultyOverviewContributionDto[];
};

const COVERAGE_BANNER_COPY: Record<CompositeCoverageStatus, string | null> = {
  FULL: null,
  PARTIAL: "Partial coverage — renormalized to available tracks.",
  PARTIAL_NO_FEEDBACK:
    "Feedback track missing — composite cannot be computed without the primary 50% track. Per-track ratings shown above for reference.",
  FEEDBACK_ONLY: "Only Faculty Feedback submissions available — composite equals Feedback rating.",
  INSUFFICIENT: "Insufficient data — need at least 50% coverage to compute composite.",
  NO_DATA: "No submissions yet for this semester.",
};

function formatWeightBadge(weight: number) {
  return `${Math.round(weight * 100)}%`;
}

function formatEffectiveWeight(effective: number) {
  return `${(effective * 100).toFixed(1)}%`;
}

function formatRating(rating: number | null) {
  if (rating === null) return null;
  return rating.toFixed(2);
}

function sortByCanonicalOrder(contributions: FacultyOverviewContributionDto[]) {
  const order = COMPOSITE_TYPE_ORDER as readonly string[];
  const rank = (code: string) => {
    const idx = order.indexOf(code);
    // Unknown codes go to the end, not the front — avoids visually
    // promoting contract-violation rows above the canonical tracks.
    return idx === -1 ? order.length : idx;
  };
  return [...contributions].sort(
    (a, b) => rank(a.questionnaireTypeCode) - rank(b.questionnaireTypeCode)
  );
}

export function CompositeRatingBreakdownPopover({
  composite,
  contributions,
}: CompositeRatingBreakdownPopoverProps) {
  const sorted = sortByCanonicalOrder(contributions);
  const banner = COVERAGE_BANNER_COPY[composite.coverageStatus];

  return (
    <div className="flex flex-col gap-3">
      <header className="space-y-1">
        <p className="font-playfair text-sm font-semibold text-foreground">Rating Breakdown</p>
        <p className="text-[11px] text-muted-foreground">
          50% Faculty Feedback · 25% Out-of-Classroom · 25% In-Classroom
        </p>
      </header>

      <ul className="flex flex-col divide-y divide-border/60">
        {sorted.map((row) => {
          const ratingLabel = formatRating(row.rating);
          const showEffective = row.effectiveWeight > 0 && row.effectiveWeight !== row.weight;
          const mutedRowLabel =
            row.rating === null
              ? row.submissionCount > 0
                ? "No scored data"
                : "No submissions"
              : null;

          return (
            <li
              key={row.questionnaireTypeCode}
              className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {row.questionnaireTypeName}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                  Weight {formatWeightBadge(row.weight)}
                  {showEffective ? (
                    <span className="ml-2 normal-case tracking-normal text-muted-foreground/90">
                      · effective {formatEffectiveWeight(row.effectiveWeight)}
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="flex flex-col items-end">
                {ratingLabel !== null ? (
                  <span className="font-playfair text-sm font-semibold tabular-nums text-foreground">
                    {ratingLabel}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">{mutedRowLabel}</span>
                )}
                {row.contribution !== null ? (
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    +{row.contribution.toFixed(2)}
                  </span>
                ) : ratingLabel !== null ? (
                  <span className="text-[11px] text-muted-foreground">—</span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {composite.rating !== null ? (
        <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Overall
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-playfair text-sm font-semibold tabular-nums text-foreground">
              {composite.rating.toFixed(2)}
            </span>
            {composite.interpretation ? (
              <span
                className={cn(
                  "text-[11px] font-medium",
                  getFacultyReportInterpretationTextClass(composite.interpretation)
                )}
              >
                {composite.interpretation}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {banner ? (
        <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200">
          {banner}
        </p>
      ) : null}
    </div>
  );
}
