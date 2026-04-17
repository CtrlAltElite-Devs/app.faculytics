"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FacultyReportSectionDto } from "@/features/faculty-analytics/types";
import { useIsMobile } from "@/lib/use-mobile";

// Diverging 5-step palette (low → high). Also covers YES_NO ("0" / "1")
// by mapping 0 → low and 1 → high.
const RATING_COLORS: Record<string, string> = {
  "1": "#dc2626",
  "2": "#f97316",
  "3": "#eab308",
  "4": "#84cc16",
  "5": "#16a34a",
  "0": "#dc2626",
};

const RATING_LABELS: Record<string, string> = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "0": "No",
};

type FacultyReportRatingDistributionChartProps = {
  sections: FacultyReportSectionDto[];
};

function truncateLabel(label: string, maxLength: number) {
  if (label.length <= maxLength) {
    return label;
  }
  return `${label.slice(0, maxLength - 1)}…`;
}

export function FacultyReportRatingDistributionChart({
  sections,
}: FacultyReportRatingDistributionChartProps) {
  const isMobile = useIsMobile();

  // Aggregate per-question ratingCounts up to the section level so the chart
  // stays readable even when a questionnaire has 30+ questions. The table
  // below the chart already exposes per-question detail.
  const rows = sections
    .map((section) => {
      const totals: Record<string, number> = {};
      for (const question of section.questions) {
        const ratingCounts = question.ratingCounts ?? {};
        for (const [rating, count] of Object.entries(ratingCounts)) {
          totals[rating] = (totals[rating] ?? 0) + count;
        }
      }
      const total = Object.values(totals).reduce((sum, n) => sum + n, 0);
      return {
        sectionId: section.sectionId,
        title: section.title,
        label: truncateLabel(section.title, isMobile ? 18 : 30),
        total,
        totals,
      };
    })
    .filter((row) => row.total > 0);

  if (rows.length === 0) {
    return null;
  }

  // Determine which rating keys actually appear, in a consistent low→high
  // order. We support "0"/"1" (YES_NO) and "1".."5" (Likert).
  const presentKeys = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row.totals)) {
      presentKeys.add(key);
    }
  }
  const orderedKeys = ["0", "1", "2", "3", "4", "5"].filter((k) =>
    presentKeys.has(k),
  );

  // Convert to percentages so small-N sections stay visually comparable,
  // while raw counts remain in the tooltip.
  const chartData = rows.map((row) => {
    const entry: Record<string, number | string> = {
      label: row.label,
      fullLabel: row.title,
      total: row.total,
    };
    for (const key of orderedKeys) {
      const count = row.totals[key] ?? 0;
      entry[`pct_${key}`] = row.total > 0 ? (count / row.total) * 100 : 0;
      entry[`count_${key}`] = count;
    }
    return entry;
  });

  const chartConfig: ChartConfig = {};
  for (const key of orderedKeys) {
    chartConfig[`pct_${key}`] = {
      label: `Rating ${RATING_LABELS[key] ?? key}`,
      color: RATING_COLORS[key] ?? "#94a3b8",
    };
  }

  const rowHeight = isMobile ? 36 : 44;
  const chartHeight = Math.max(isMobile ? 260 : 300, chartData.length * rowHeight);

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          Rating Distribution
        </CardTitle>
        <CardDescription>
          Share of responses at each rating level, aggregated per section. Raw
          counts appear in the tooltip.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto w-full"
          style={{ height: chartHeight }}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ top: 8, bottom: 8, right: isMobile ? 8 : 16, left: 0 }}
            barCategoryGap={isMobile ? 8 : 10}
            maxBarSize={isMobile ? 22 : 28}
            stackOffset="expand"
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value: number) => `${Math.round(value)}%`}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={isMobile ? 110 : 170}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(_, payload) => {
                    const row = payload as unknown as (typeof chartData)[number];
                    return `${row.fullLabel} · ${row.total} responses`;
                  }}
                  formatter={(value, _name, item, __, payload) => {
                    const row = payload as unknown as (typeof chartData)[number];
                    const key = String(item.dataKey).replace("pct_", "");
                    const count = Number(row[`count_${key}`] ?? 0);
                    return (
                      <div className="flex min-w-[10rem] items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          Rating {RATING_LABELS[key] ?? key}
                        </span>
                        <span className="font-mono font-medium text-foreground">
                          {count} ({(value as number).toFixed(0)}%)
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            {orderedKeys.map((key) => (
              <Bar
                key={key}
                dataKey={`pct_${key}`}
                stackId="rating"
                fill={`var(--color-pct_${key})`}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
