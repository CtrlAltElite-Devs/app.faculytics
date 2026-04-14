"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFacultyReportScore } from "@/features/faculty-analytics/lib/faculty-report-detail";
import type { FacultyReportSectionDto } from "@/features/faculty-analytics/types";
import { useIsMobile } from "@/lib/use-mobile";

const sectionPerformanceChartConfig = {
  average: {
    label: "Average",
    color: "#5b8cff",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

type FacultyReportSectionPerformanceChartProps = {
  sections: FacultyReportSectionDto[];
};

function truncateLabel(label: string, maxLength: number) {
  if (label.length <= maxLength) {
    return label;
  }

  return `${label.slice(0, maxLength - 1)}…`;
}

export function FacultyReportSectionPerformanceChart({
  sections,
}: FacultyReportSectionPerformanceChartProps) {
  const isMobile = useIsMobile();

  if (sections.length === 0) {
    return null;
  }

  const chartData = sections.map((section) => ({
    id: section.sectionId,
    label: truncateLabel(section.title, isMobile ? 18 : 30),
    fullLabel: section.title,
    average: Number(section.sectionAverage.toFixed(2)),
    weight: section.weight,
  }));
  const rowHeight = isMobile ? 42 : 48;
  const chartHeight = Math.max(isMobile ? 280 : 320, chartData.length * rowHeight);

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          Section Performance
        </CardTitle>
        <CardDescription>
          Compare section averages for the current faculty evaluation report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={sectionPerformanceChartConfig}
          className="aspect-auto w-full items-stretch justify-start"
          style={{ height: chartHeight }}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              top: 8,
              bottom: 8,
              right: isMobile ? 18 : 24,
              left: 0,
            }}
            barCategoryGap={isMobile ? 10 : 12}
            maxBarSize={isMobile ? 24 : 28}
          >
            <CartesianGrid horizontal={false} />
            <XAxis dataKey="average" type="number" domain={[0, 5]} hide />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    const section = payload as unknown as (typeof chartData)[number];
                    return section.fullLabel;
                  }}
                  formatter={(_, __, item, ___, payload) => {
                    const section = payload as unknown as (typeof chartData)[number];

                    return (
                      <div className="flex min-w-[10rem] items-center justify-between gap-4">
                        <span className="text-muted-foreground">Average</span>
                        <span className="font-mono font-medium text-foreground">
                          {formatFacultyReportScore(item.value as number)} | {section.weight}%
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar dataKey="average" fill="var(--color-average)" radius={4}>
              <LabelList
                dataKey="label"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="average"
                position="right"
                offset={8}
                formatter={(value: number) => formatFacultyReportScore(value)}
                className="fill-foreground font-sans text-xs"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
