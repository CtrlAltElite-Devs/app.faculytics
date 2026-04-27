import { ChevronRight, FileText, MessageSquare, Sparkles, Tags } from "lucide-react";
import { Fragment } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  formatPercent,
  formatScore,
  formatSignedPercentagePoint,
  formatSignedScore,
  getDeltaTone,
  getFacultyInitials,
} from "@/features/faculty-analytics/lib/faculty-ranking-formatters";
import { bandForScore } from "@/features/faculty-analytics/lib/score-bands";
import type { ScopedFacultyRankingRow } from "@/features/faculty-analytics/lib/scoped-analytics-view-model";
import { cn } from "@/lib/utils";

type ScopedFacultyRankingsCardGridProps = {
  facultyRankings: readonly ScopedFacultyRankingRow[];
};

type SentimentSlice = { pos: number; neu: number; neg: number };

function getSentimentSlices(row: ScopedFacultyRankingRow): SentimentSlice {
  if (row.analyzedCount <= 0) {
    return { pos: 0, neu: 0, neg: 0 };
  }
  return {
    pos: (row.positiveCount / row.analyzedCount) * 100,
    neu: (row.neutralCount / row.analyzedCount) * 100,
    neg: (row.negativeCount / row.analyzedCount) * 100,
  };
}

function SentimentBar({ slices }: { slices: SentimentSlice }) {
  const empty = slices.pos === 0 && slices.neu === 0 && slices.neg === 0;

  if (empty) {
    return <div className="h-2.5 w-full overflow-hidden rounded-full bg-border/60" />;
  }

  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-border/60">
      <div className="h-full bg-sentiment-positive" style={{ width: `${slices.pos}%` }} />
      <div className="h-full bg-sentiment-neutral" style={{ width: `${slices.neu}%` }} />
      <div className="h-full bg-sentiment-negative" style={{ width: `${slices.neg}%` }} />
    </div>
  );
}

type LegendChipProps = {
  swatch: string;
  fg: string;
  pct: number;
  label: string;
};

function LegendChip({ swatch, fg, pct, label }: LegendChipProps) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("inline-block size-2 rounded-sm", swatch)} aria-hidden />
      <span className={cn("font-mono text-[11px] font-semibold tabular-nums", fg)}>
        {pct.toFixed(1)}%
      </span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </span>
  );
}

type FunnelMetricProps = {
  icon: typeof FileText;
  label: string;
  value: number;
};

function FunnelMetric({ icon: Icon, label, value }: FunnelMetricProps) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-0.5">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3" aria-hidden />
        <span className="text-[9.5px] font-bold uppercase tracking-wider">{label}</span>
      </span>
      <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

const FUNNEL_STAGES = [
  { icon: FileText, label: "Submissions", key: "submissionCount" },
  { icon: MessageSquare, label: "Comments", key: "commentCount" },
  { icon: Sparkles, label: "Analyzed", key: "analyzedCount" },
  { icon: Tags, label: "Topics", key: "topicCount" },
] as const;

function FacultyRankingCard({ row }: { row: ScopedFacultyRankingRow }) {
  const band = bandForScore(row.avgNormalizedScore);
  const isFirstTerm = row.scoreDelta === null && row.sentimentDelta === null;
  const slices = getSentimentSlices(row);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className={cn("relative border-b px-5 pb-5 pt-4", band.hero, band.border)}>
        <div
          className={cn(
            "absolute right-4 top-3.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide",
            band.text
          )}
        >
          <span className="font-mono text-[13px] font-bold tracking-tight">#{row.displayRank}</span>
          <span className="opacity-50" aria-hidden>
            ·
          </span>
          <span>{band.label}</span>
        </div>

        <div className="mb-3 flex items-center gap-2.5">
          <Avatar size="default" className="border border-border/70">
            <AvatarFallback className="bg-blue-100 font-sans text-[11px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {getFacultyInitials(row.facultyName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold leading-tight text-foreground">
              {row.facultyName}
            </p>
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              {row.departmentCode}
            </p>
          </div>
        </div>

        <div className="flex items-end gap-3.5">
          <div
            className={cn(
              "shrink-0 font-playfair text-[52px] font-semibold leading-[0.95] tracking-tight tabular-nums",
              band.text
            )}
          >
            {formatScore(row.avgNormalizedScore)}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1 pb-1.5">
            <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Avg score
            </span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-foreground">
              {isFirstTerm ? (
                <span className="italic text-muted-foreground">Current term</span>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={cn(
                          "cursor-help font-mono font-medium tabular-nums",
                          getDeltaTone(row.scoreDelta)
                        )}
                      >
                        {formatSignedScore(row.scoreDelta)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-56 font-sans text-xs">
                      How much the faculty member&rsquo;s rating went up or down compared with the
                      previous period.
                    </TooltipContent>
                  </Tooltip>{" "}
                  <span className="text-muted-foreground">vs last term</span>
                </>
              )}
            </span>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 pb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Percentile
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-56 font-sans text-xs">
                How this faculty member compares with others in the selected view. A higher
                percentile means a stronger relative result.
              </TooltipContent>
            </Tooltip>
            <span className={cn("font-mono text-[13px] font-semibold tabular-nums", band.text)}>
              {formatPercent(row.percentileRank)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-5 pb-3.5 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Sentiment
          </span>
          {isFirstTerm ? (
            <span className="text-[11px] italic text-muted-foreground">No prior comparison</span>
          ) : (
            <span className="text-[11px] text-muted-foreground">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "cursor-help font-mono font-medium tabular-nums",
                      getDeltaTone(row.sentimentDelta)
                    )}
                  >
                    {formatSignedPercentagePoint(row.sentimentDelta)}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-56 font-sans text-xs">
                  How much the share of positive comments went up or down compared with the previous
                  period.
                </TooltipContent>
              </Tooltip>{" "}
              vs last term
            </span>
          )}
        </div>
        <SentimentBar slices={slices} />
        <div className="flex items-center justify-between gap-2">
          <LegendChip
            swatch="bg-sentiment-positive"
            fg="text-sentiment-positive-fg"
            pct={slices.pos}
            label="positive"
          />
          <LegendChip
            swatch="bg-sentiment-neutral"
            fg="text-sentiment-neutral-fg"
            pct={slices.neu}
            label="neutral"
          />
          <LegendChip
            swatch="bg-sentiment-negative"
            fg="text-sentiment-negative-fg"
            pct={slices.neg}
            label="negative"
          />
        </div>
      </div>

      <div className="flex items-end justify-between gap-1 border-t border-border/60 bg-muted/40 px-5 py-3">
        {FUNNEL_STAGES.map((stage, index) => (
          <Fragment key={stage.label}>
            <FunnelMetric icon={stage.icon} label={stage.label} value={row[stage.key]} />
            {index < FUNNEL_STAGES.length - 1 ? (
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/40" aria-hidden />
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function ScopedFacultyRankingsCardGrid({
  facultyRankings,
}: ScopedFacultyRankingsCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {facultyRankings.map((row) => (
        <FacultyRankingCard key={row.facultyId} row={row} />
      ))}
    </div>
  );
}
