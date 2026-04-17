"use client";

import {
  CartesianGrid,
  ReferenceLine,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFacultyReportScore } from "@/features/faculty-analytics/lib/faculty-report-detail";
import type { FacultyReportSectionDto } from "@/features/faculty-analytics/types";
import { useIsMobile } from "@/lib/use-mobile";

const impactChartConfig = {
  section: {
    label: "Section",
    color: "#5b8cff",
  },
} satisfies ChartConfig;

type FacultyReportImpactScatterChartProps = {
  sections: FacultyReportSectionDto[];
};

export function FacultyReportImpactScatterChart({
  sections,
}: FacultyReportImpactScatterChartProps) {
  const isMobile = useIsMobile();

  if (sections.length === 0) {
    return null;
  }

  const chartData = sections.map((section) => ({
    id: section.sectionId,
    title: section.title,
    weight: section.weight,
    sectionAverage: Number(section.sectionAverage.toFixed(2)),
    responseCount:
      section.responseCount ?? section.questions.reduce((sum, q) => sum + q.responseCount, 0),
    interpretation: section.sectionInterpretation,
  }));

  const chartHeight = isMobile ? 280 : 340;

  const maxResponses = chartData.reduce(
    (max, row) => (row.responseCount > max ? row.responseCount : max),
    0
  );
  const zRange: [number, number] = [80, Math.max(80, maxResponses > 0 ? 420 : 80)];

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          Weight × Score Impact
        </CardTitle>
        <CardDescription>
          Each bubble is a section — higher weight on the right, stronger performance toward the
          top. Bubble size reflects total ratings collected.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={impactChartConfig}
          className="aspect-auto w-full"
          style={{ height: chartHeight }}
        >
          <ScatterChart
            accessibilityLayer
            margin={{
              top: 12,
              right: isMobile ? 12 : 24,
              bottom: 24,
              left: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="weight"
              name="Weight"
              unit="%"
              domain={[0, "dataMax"]}
              tick={{ fontSize: 11 }}
              label={
                isMobile
                  ? undefined
                  : {
                      value: "Section weight (%)",
                      position: "insideBottom",
                      offset: -8,
                      fontSize: 11,
                    }
              }
            />
            <YAxis
              type="number"
              dataKey="sectionAverage"
              name="Average"
              domain={[0, 5]}
              tick={{ fontSize: 11 }}
              label={
                isMobile
                  ? undefined
                  : {
                      value: "Section average",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      fontSize: 11,
                    }
              }
            />
            <ZAxis type="number" dataKey="responseCount" name="Ratings" range={zRange} />
            <ReferenceLine y={3.5} strokeDasharray="4 4" stroke="var(--border)" />
            <RechartsTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const section = payload[0].payload as (typeof chartData)[number];
                return (
                  <div className="grid min-w-[12rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">{section.title}</div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Average</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatFacultyReportScore(section.sectionAverage)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-mono font-medium text-foreground">
                        {section.weight}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Ratings</span>
                      <span className="font-mono font-medium text-foreground">
                        {section.responseCount}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
            <Scatter
              name="Sections"
              data={chartData}
              fill="var(--color-section)"
              fillOpacity={0.75}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
