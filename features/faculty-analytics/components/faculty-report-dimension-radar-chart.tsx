"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFacultyReportScore } from "@/features/faculty-analytics/lib/faculty-report-detail";
import type { FacultyReportDimensionDto } from "@/features/faculty-analytics/types";
import { useIsMobile } from "@/lib/use-mobile";

const dimensionRadarChartConfig = {
  average: {
    label: "Average",
    color: "#5b8cff",
  },
} satisfies ChartConfig;

type FacultyReportDimensionRadarChartProps = {
  dimensions: FacultyReportDimensionDto[];
};

function truncateLabel(label: string, maxLength: number) {
  if (label.length <= maxLength) {
    return label;
  }

  return `${label.slice(0, maxLength - 1)}…`;
}

export function FacultyReportDimensionRadarChart({
  dimensions,
}: FacultyReportDimensionRadarChartProps) {
  const isMobile = useIsMobile();

  // A radar with fewer than 3 axes collapses into a line/point and is
  // misleading — fall back to rendering nothing and let the section bar
  // chart carry the load in that case.
  if (dimensions.length < 3) {
    return null;
  }

  const chartData = dimensions.map((dimension) => ({
    code: dimension.code,
    label: truncateLabel(dimension.displayName, isMobile ? 14 : 22),
    fullLabel: dimension.displayName,
    average: Number(dimension.average.toFixed(2)),
    responseCount: dimension.responseCount,
  }));

  const chartHeight = isMobile ? 300 : 360;

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          Dimension Profile
        </CardTitle>
        <CardDescription>
          Weighted averages grouped by competency dimension on a 0–5 scale.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={dimensionRadarChartConfig}
          className="aspect-auto w-full"
          style={{ height: chartHeight }}
        >
          <RadarChart data={chartData} outerRadius="72%">
            <PolarGrid />
            <PolarAngleAxis dataKey="label" tick={{ fontSize: isMobile ? 10 : 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(_, payload) => {
                    const first = payload?.[0]?.payload as (typeof chartData)[number] | undefined;
                    return first?.fullLabel ?? "";
                  }}
                  formatter={(_, __, item, ___, payload) => {
                    const dimension = payload as unknown as (typeof chartData)[number];
                    return (
                      <div className="flex min-w-[12rem] flex-col gap-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Average</span>
                          <span className="font-mono font-medium text-foreground">
                            {formatFacultyReportScore(item.value as number)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Responses</span>
                          <span className="font-mono font-medium text-foreground">
                            {dimension.responseCount}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />
            <Radar
              dataKey="average"
              fill="var(--color-average)"
              fillOpacity={0.35}
              stroke="var(--color-average)"
              strokeWidth={2}
              dot={{ r: 3, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
