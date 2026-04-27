import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ScopedFacultyRankingRow } from "@/features/faculty-analytics/lib/scoped-analytics-view-model";
import { cn } from "@/lib/utils";

type ScopedFacultyRankingsTableProps = {
  facultyRankings: readonly ScopedFacultyRankingRow[];
};

const UNAVAILABLE = "--";

type HeaderTooltipProps = {
  label: string;
  description: string;
  align?: "left" | "right";
};

const POSITIVE_TONE = "text-emerald-700 dark:text-emerald-300";
const NEGATIVE_TONE = "text-red-700 dark:text-red-300";
const NEUTRAL_TONE = "text-foreground";

function formatScore(value: number) {
  return value.toFixed(2);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatSignedValue(value: number | null, formatter: (value: number) => string) {
  if (value === null) {
    return UNAVAILABLE;
  }

  return `${value >= 0 ? "+" : ""}${formatter(value)}`;
}

function formatSignedScore(value: number | null) {
  return formatSignedValue(value, (score) => score.toFixed(2));
}

function formatSignedPercentagePoint(value: number | null) {
  return formatSignedValue(value, (sentiment) => `${(sentiment * 100).toFixed(1)} pts`);
}

function getFacultyInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getScoreTone(score: number) {
  if (score >= 80) {
    return POSITIVE_TONE;
  }

  if (score < 60) {
    return NEGATIVE_TONE;
  }

  return NEUTRAL_TONE;
}

function getSentimentTone(row: ScopedFacultyRankingRow) {
  if (row.positiveCount > row.negativeCount && row.positiveCount >= row.neutralCount) {
    return POSITIVE_TONE;
  }

  if (row.negativeCount > row.positiveCount && row.negativeCount >= row.neutralCount) {
    return NEGATIVE_TONE;
  }

  return NEUTRAL_TONE;
}

function getDeltaTone(value: number | null) {
  if (value === null || value === 0) {
    return NEUTRAL_TONE;
  }

  return value > 0 ? POSITIVE_TONE : NEGATIVE_TONE;
}

function HeaderTooltip({ label, description, align = "left" }: HeaderTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex cursor-help items-center gap-1 border-b border-dotted border-muted-foreground/60",
            align === "right" && "justify-end"
          )}
        >
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-56 font-sans text-xs">
        {description}
      </TooltipContent>
    </Tooltip>
  );
}

export function ScopedFacultyRankingsTable({ facultyRankings }: ScopedFacultyRankingsTableProps) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Faculty Rankings</CardTitle>
        <CardDescription>
          Sorted by percentile and normalized score for the selected filters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {facultyRankings.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 text-center">
            <p className="max-w-sm font-sans text-sm text-muted-foreground">
              Faculty rankings will appear once analyzed faculty data is available for this
              selection.
            </p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <Table className="min-w-[1120px] table-fixed">
              <TableHeader className="data-table-header">
                <TableRow>
                  <TableHead className="data-table-head w-[6%] text-right">Rank</TableHead>
                  <TableHead className="data-table-head w-[20%]">Faculty</TableHead>
                  <TableHead className="data-table-head w-[7%]">Dept</TableHead>
                  <TableHead className="data-table-head w-[8%] text-right">
                    <HeaderTooltip
                      label="Score"
                      description="The faculty member's average rating based on submitted evaluations."
                      align="right"
                    />
                  </TableHead>
                  <TableHead className="data-table-head w-[7%] text-right">
                    <HeaderTooltip
                      label="Rating"
                      description="How much the faculty member's rating went up or down compared with the previous period."
                      align="right"
                    />
                  </TableHead>
                  <TableHead className="data-table-head w-[14%]">
                    <HeaderTooltip
                      label="Sentiment"
                      description="The percentage of comments that were positive. The smaller text shows positive, neutral, and negative comment counts."
                    />
                  </TableHead>
                  <TableHead className="data-table-head w-[8%] text-right">
                    <HeaderTooltip
                      label="Positive Sentiment"
                      description="How much the share of positive comments went up or down compared with the previous period."
                      align="right"
                    />
                  </TableHead>
                  <TableHead className="data-table-head w-[8%] text-right">
                    <HeaderTooltip
                      label="Percentile"
                      description="Shows how this faculty member compares with others in the selected view. A higher percentile means a stronger relative result."
                      align="right"
                    />
                  </TableHead>
                  <TableHead className="data-table-head w-[9%] text-right">
                    <HeaderTooltip
                      label="Submissions"
                      description="The number of evaluations submitted. The smaller text shows how many included comments."
                      align="right"
                    />
                  </TableHead>
                  <TableHead className="data-table-head w-[8%] text-right">
                    <HeaderTooltip
                      label="Analyzed"
                      description="The number of submitted evaluations that were included in the analytics results."
                      align="right"
                    />
                  </TableHead>
                  <TableHead className="data-table-head w-[5%] text-right">
                    <HeaderTooltip
                      label="Topics"
                      description="The number of common feedback themes found in the comments for this faculty member."
                      align="right"
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facultyRankings.map((row) => (
                  <TableRow
                    key={row.facultyId}
                    className="data-table-row hover:bg-zinc-100/40 dark:hover:bg-zinc-900/40"
                  >
                    <TableCell className="data-table-cell text-right font-medium tabular-nums">
                      {row.displayRank}
                    </TableCell>
                    <TableCell className="data-table-cell">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar size="default" className="border border-border/70">
                          <AvatarFallback className="bg-slate-100 font-sans text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {getFacultyInitials(row.facultyName)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="min-w-0 truncate font-medium text-foreground">
                          {row.facultyName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="data-table-cell font-mono text-xs text-muted-foreground">
                      {row.departmentCode}
                    </TableCell>
                    <TableCell className="data-table-cell text-right tabular-nums">
                      <span className={cn("font-medium", getScoreTone(row.avgNormalizedScore))}>
                        {formatScore(row.avgNormalizedScore)}
                      </span>
                    </TableCell>
                    <TableCell className="data-table-cell text-right tabular-nums">
                      <span className={cn("font-medium", getDeltaTone(row.scoreDelta))}>
                        {formatSignedScore(row.scoreDelta)}
                      </span>
                    </TableCell>
                    <TableCell className="data-table-cell">
                      <div className={cn("font-medium tabular-nums", getSentimentTone(row))}>
                        {row.positiveSentimentRate.toFixed(1)}% positive
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {row.positiveCount} pos / {row.neutralCount} neu / {row.negativeCount} neg
                      </div>
                    </TableCell>
                    <TableCell className="data-table-cell text-right tabular-nums">
                      <span className={cn("font-medium", getDeltaTone(row.sentimentDelta))}>
                        {formatSignedPercentagePoint(row.sentimentDelta)}
                      </span>
                    </TableCell>
                    <TableCell className="data-table-cell text-right tabular-nums">
                      {formatPercent(row.percentileRank)}
                    </TableCell>
                    <TableCell className="data-table-cell text-right tabular-nums">
                      <div>{row.submissionCount}</div>
                      <div className="text-xs text-muted-foreground">{row.commentCount} cmts</div>
                    </TableCell>
                    <TableCell className="data-table-cell text-right tabular-nums">
                      {row.analyzedCount}
                    </TableCell>
                    <TableCell className="data-table-cell text-right tabular-nums">
                      {row.topicCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
