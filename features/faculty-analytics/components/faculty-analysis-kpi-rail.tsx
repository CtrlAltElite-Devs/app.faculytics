"use client";

import { Info } from "lucide-react";

import { AnimatedNumber } from "@/components/animated-number";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CompositeRatingBreakdownPopover } from "@/features/faculty-analytics/components/composite-rating-breakdown-popover";
import { FacultyAnalysisSpark } from "@/features/faculty-analytics/components/faculty-analysis-spark";
import { getFacultyReportInterpretationBadgeClass } from "@/features/faculty-analytics/lib/faculty-report-detail";
import { computePositiveSentimentRate } from "@/features/faculty-analytics/lib/sentiment-rate";
import {
  SENTIMENT_LABEL,
  SENTIMENT_SOLID_CLASS,
} from "@/features/faculty-analytics/lib/sentiment-colors";
import { cn } from "@/lib/utils";
import type {
  FacultyOverviewResponseDto,
  PipelineCoverage,
  SentimentDistributionDto,
  SentimentLabel,
} from "@/features/faculty-analytics/types";

type FacultyAnalysisKpiRailProps = {
  overview: FacultyOverviewResponseDto | undefined;
  isOverviewLoading: boolean;
  isOverviewError: boolean;
  onOverviewRetry: () => void;

  sentimentDistribution: SentimentDistributionDto | null;
  isSentimentLoading: boolean;
  isSentimentReady: boolean;

  coverage: PipelineCoverage | null;
  courseCount: number;
  lastAnalyzedAt: string | null;
};

const SENTIMENT_ORDER: SentimentLabel[] = ["positive", "neutral", "negative"];

function formatShortDate(iso: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function KpiCard({
  eyebrow,
  children,
  className,
}: {
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border/70 bg-card px-5 py-5 shadow-sm",
        className
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      {children}
    </article>
  );
}

function OverallRatingCard({
  overview,
  isLoading,
  isError,
  onRetry,
}: {
  overview: FacultyOverviewResponseDto | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <KpiCard eyebrow="Overall rating">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-5 w-40" />
      </KpiCard>
    );
  }

  if (isError || !overview) {
    return (
      <KpiCard eyebrow="Overall rating">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground">Composite unavailable</span>
        </div>
        <Button variant="outline" size="sm" className="w-fit" onClick={onRetry}>
          Retry
        </Button>
      </KpiCard>
    );
  }

  const { composite, contributions } = overview;
  const hasRating = composite.rating !== null && composite.rating !== undefined;
  const isCoverageIncomplete = composite.coverageStatus !== "FULL";

  return (
    <KpiCard eyebrow="Overall rating">
      <div className="flex flex-nowrap items-end gap-3">
        <div className="flex shrink-0 items-baseline gap-1.5">
          {hasRating ? (
            <span className="font-playfair text-4xl font-semibold leading-none tabular-nums text-foreground">
              <AnimatedNumber value={composite.rating ?? 0} decimals={2} />
            </span>
          ) : (
            <span className="font-playfair text-3xl font-semibold leading-none text-muted-foreground">
              N/A
            </span>
          )}
          <span className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
            / 5.00
          </span>
        </div>
        <div className="ml-auto shrink-0">
          {/* MISSING DATA: term-over-term rating history is not exposed by
              /analytics/faculty/:id/overview. Sparkline renders an
              "unavailable" placeholder until the endpoint adds a trend. */}
          <FacultyAnalysisSpark data={null} ariaLabel="Overall rating trend" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {composite.interpretation ? (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wider",
              getFacultyReportInterpretationBadgeClass(composite.interpretation)
            )}
          >
            {composite.interpretation}
          </Badge>
        ) : null}
        {isCoverageIncomplete ? (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-600 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500" aria-hidden />
            Partial coverage
          </span>
        ) : null}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 w-7 p-0"
              aria-label="View rating breakdown"
            >
              <Info className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <CompositeRatingBreakdownPopover composite={composite} contributions={contributions} />
          </PopoverContent>
        </Popover>
      </div>
    </KpiCard>
  );
}

function PositiveSentimentCard({
  distribution,
  isLoading,
  isReady,
}: {
  distribution: SentimentDistributionDto | null;
  isLoading: boolean;
  isReady: boolean;
}) {
  const rate = computePositiveSentimentRate(distribution);
  const total = distribution
    ? distribution.positive + distribution.neutral + distribution.negative
    : 0;

  if (!isReady) {
    return (
      <KpiCard eyebrow="Positive sentiment rate">
        <div className="flex items-baseline gap-2">
          <span className="font-playfair text-3xl font-semibold leading-none text-muted-foreground">
            —
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Awaiting qualitative analysis. Run the pipeline to compute sentiment.
        </p>
      </KpiCard>
    );
  }

  if (isLoading && !distribution) {
    return (
      <KpiCard eyebrow="Positive sentiment rate">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-3 w-full" />
      </KpiCard>
    );
  }

  return (
    <KpiCard eyebrow="Positive sentiment rate">
      <div className="flex flex-nowrap items-end gap-3">
        <div className="shrink-0 font-playfair text-4xl font-semibold leading-none tabular-nums text-foreground">
          {rate === null ? (
            <span className="text-muted-foreground">0</span>
          ) : (
            <AnimatedNumber value={rate} decimals={1} />
          )}
          <span className="ml-1 align-baseline text-xl font-semibold text-foreground">%</span>
        </div>
        <div className="ml-auto shrink-0">
          {/* MISSING DATA: positive-sentiment trend over time is not exposed.
              Placeholder until the qualitative-summary endpoint adds a
              term-over-term series. */}
          <FacultyAnalysisSpark data={null} ariaLabel="Positive sentiment trend" />
        </div>
      </div>

      <div
        className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label="Sentiment split"
      >
        {distribution && total > 0
          ? SENTIMENT_ORDER.map((s) => {
              const count = distribution[s];
              if (count === 0) return null;
              return (
                <span
                  key={s}
                  className={cn("h-full", SENTIMENT_SOLID_CLASS[s])}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              );
            })
          : null}
      </div>

      <dl className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
        {SENTIMENT_ORDER.map((s) => {
          const count = distribution?.[s] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <span key={s} className="flex items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full", SENTIMENT_SOLID_CLASS[s])} />
              <span>{SENTIMENT_LABEL[s]}</span>
              <span className="text-foreground">
                {count} ({pct}%)
              </span>
            </span>
          );
        })}
      </dl>
    </KpiCard>
  );
}

function CoverageCard({
  coverage,
  courseCount,
  lastAnalyzedAt,
}: {
  coverage: PipelineCoverage | null;
  courseCount: number;
  lastAnalyzedAt: string | null;
}) {
  const responseCount = coverage?.commentCount ?? coverage?.submissionCount ?? null;
  const responseRate =
    coverage?.responseRate !== undefined && coverage?.responseRate !== null
      ? Math.round(coverage.responseRate * 100)
      : null;
  const lastAnalyzed = formatShortDate(lastAnalyzedAt);

  return (
    <KpiCard eyebrow="Coverage">
      <div className="flex items-baseline gap-2">
        {responseCount === null ? (
          <span className="font-playfair text-3xl font-semibold leading-none text-muted-foreground">
            —
          </span>
        ) : (
          <span className="font-playfair text-4xl font-semibold leading-none tabular-nums text-foreground">
            <AnimatedNumber value={responseCount} decimals={0} />
          </span>
        )}
        <span className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          responses
        </span>
      </div>

      <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 text-[12px]">
        <dt className="text-muted-foreground">Across courses</dt>
        <dd className="text-right font-mono tabular-nums">{courseCount}</dd>

        <dt className="text-muted-foreground">Response rate</dt>
        <dd className="text-right font-mono tabular-nums">
          {responseRate === null ? "—" : `${responseRate}%`}
        </dd>

        <dt className="text-muted-foreground">Last analyzed</dt>
        <dd className="whitespace-nowrap text-right font-mono tabular-nums">
          {lastAnalyzed ?? "—"}
        </dd>
      </dl>
    </KpiCard>
  );
}

export function FacultyAnalysisKpiRail({
  overview,
  isOverviewLoading,
  isOverviewError,
  onOverviewRetry,
  sentimentDistribution,
  isSentimentLoading,
  isSentimentReady,
  coverage,
  courseCount,
  lastAnalyzedAt,
}: FacultyAnalysisKpiRailProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1.1fr_1.1fr_1fr]">
      <OverallRatingCard
        overview={overview}
        isLoading={isOverviewLoading}
        isError={isOverviewError}
        onRetry={onOverviewRetry}
      />
      <PositiveSentimentCard
        distribution={sentimentDistribution}
        isLoading={isSentimentLoading}
        isReady={isSentimentReady}
      />
      <CoverageCard coverage={coverage} courseCount={courseCount} lastAnalyzedAt={lastAnalyzedAt} />
    </div>
  );
}
