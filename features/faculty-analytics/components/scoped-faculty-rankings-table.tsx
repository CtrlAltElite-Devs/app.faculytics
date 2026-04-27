import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ScopeLabel } from "@/features/faculty-analytics/components/scoped-dashboard-section-types";
import { buildScopedFacultyAnalysisHref } from "@/features/faculty-analytics/lib/faculty-analysis-routes";
import {
  formatPercent,
  formatScore,
  formatSignedPercentagePoint,
  formatSignedScore,
  getDeltaTone,
  getFacultyInitials,
  getScoreTone,
  getSentimentTone,
} from "@/features/faculty-analytics/lib/faculty-ranking-formatters";
import type { ScopedFacultyRankingRow } from "@/features/faculty-analytics/lib/scoped-analytics-view-model";
import { cn } from "@/lib/utils";

type ScopedFacultyRankingsTableProps = {
  facultyRankings: readonly ScopedFacultyRankingRow[];
  scopeLabel: ScopeLabel;
  selectedSemesterId: string;
  selectedSemesterLabel: string;
};

type HeaderTooltipProps = {
  label: string;
  description: string;
  align?: "left" | "right";
};

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

export function ScopedFacultyRankingsTable({
  facultyRankings,
  scopeLabel,
  selectedSemesterId,
  selectedSemesterLabel,
}: ScopedFacultyRankingsTableProps) {
  return (
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
                  <Link
                    href={buildScopedFacultyAnalysisHref({
                      facultyId: row.facultyId,
                      facultyName: row.facultyName,
                      semesterId: selectedSemesterId,
                      semesterLabel: selectedSemesterLabel,
                      scopeLabel,
                    })}
                    aria-label={`View analysis for ${row.facultyName}`}
                    className="min-w-0 truncate font-medium text-foreground decoration-brand-blue/40 underline-offset-4 outline-none hover:text-brand-blue hover:underline focus-visible:underline focus-visible:text-brand-blue"
                  >
                    {row.facultyName}
                  </Link>
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
  );
}
