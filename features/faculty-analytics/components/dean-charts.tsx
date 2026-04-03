"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import type { LegendProps } from "recharts";

import type {
  DeanOverallSentimentDatum,
  DeanSemesterSentimentDatum,
} from "@/features/faculty-analytics/lib/dean-analytics-view-model";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-mobile";

const semesterChartConfig = {
  firstSemester: {
    label: "First Semester",
    color: "#5b8cff",
  },
  secondSemester: {
    label: "Second Semester",
    color: "#f2c200",
  },
  summerSemester: {
    label: "Summer Semester",
    color: "#9ca3af",
  },
} satisfies ChartConfig;

const overallSentimentChartConfig = {
  positive: {
    label: "Positive",
    color: "#5b8cff",
  },
  neutral: {
    label: "Neutral",
    color: "#d1d5db",
  },
  negative: {
    label: "Negative",
    color: "#facc15",
  },
} satisfies ChartConfig;

function resolveLegendLabel(dataKey: unknown, value: unknown) {
  if (typeof dataKey === "string") {
    const overallLabel = (overallSentimentChartConfig as Record<string, { label?: string }>)[
      dataKey
    ]?.label;
    if (overallLabel) {
      return overallLabel;
    }

    const semesterLabel = (semesterChartConfig as Record<string, { label?: string }>)[dataKey]
      ?.label;
    if (semesterLabel) {
      return semesterLabel;
    }

    return dataKey;
  }

  return typeof value === "string" ? value : "Legend item";
}

function FacultyAnalyticsLegendContent({
  payload,
  className,
}: Pick<LegendProps, "payload"> & {
  className?: string;
}) {
  if (!payload?.length) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center gap-4 pt-3", className)}>
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => (
          <div
            key={`${item.dataKey ?? item.value ?? "legend"}-${index}`}
            className="flex items-center gap-1.5"
          >
            <div
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-sans text-sm text-muted-foreground">
              {resolveLegendLabel(item.dataKey, item.value)}
            </span>
          </div>
        ))}
    </div>
  );
}

export function DeanSentimentBarChart({
  semesterSentiment,
}: {
  semesterSentiment: DeanSemesterSentimentDatum[];
}) {
  const isMobile = useIsMobile();

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          Semester Sentiment Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden pb-2">
        <ChartContainer
          config={semesterChartConfig}
          className="aspect-auto h-[16rem] min-h-[16rem] w-full items-stretch justify-start sm:h-[18rem] lg:h-[21rem] [&_.recharts-legend-wrapper]:bottom-0! [&_.recharts-default-legend]:flex-wrap [&_.recharts-default-legend]:justify-center [&_.recharts-default-legend]:gap-y-1 [&_.recharts-legend-item]:!mr-3"
        >
          <BarChart
            accessibilityLayer
            data={semesterSentiment}
            margin={{
              top: 12,
              right: isMobile ? 0 : 8,
              left: isMobile ? -8 : 8,
              bottom: 12,
            }}
            barCategoryGap={isMobile ? 10 : 18}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="sentiment"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              interval={0}
              tick={{ fontSize: isMobile ? 10 : 11 }}
              tickFormatter={(value: string) =>
                isMobile
                  ? value === "Positive"
                    ? "Pos"
                    : value === "Negative"
                      ? "Neg"
                      : "Neu"
                  : value
              }
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontSize: isMobile ? 10 : 11 }}
              width={isMobile ? 30 : 36}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <ChartLegend
              verticalAlign="bottom"
              content={<FacultyAnalyticsLegendContent className="pt-1" />}
            />
            <Bar
              dataKey="firstSemester"
              fill="var(--color-firstSemester)"
              radius={[6, 6, 0, 0]}
              maxBarSize={isMobile ? 24 : 40}
            />
            <Bar
              dataKey="secondSemester"
              fill="var(--color-secondSemester)"
              radius={[6, 6, 0, 0]}
              maxBarSize={isMobile ? 24 : 40}
            />
            <Bar
              dataKey="summerSemester"
              fill="var(--color-summerSemester)"
              radius={[6, 6, 0, 0]}
              maxBarSize={isMobile ? 24 : 40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function DeanOverallSentimentBarChart({
  overallSentiment,
}: {
  overallSentiment: DeanOverallSentimentDatum[];
}) {
  const isMobile = useIsMobile();
  const overallSentimentData = overallSentiment.map((item) => ({
    ...item,
    key: item.label.toLowerCase(),
  }));

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          Overall Sentiment Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden pb-2">
        <ChartContainer
          config={overallSentimentChartConfig}
          className="aspect-auto h-[18rem] min-h-[18rem] w-full items-stretch justify-start sm:h-[20rem] lg:h-[22rem]"
        >
          <BarChart
            accessibilityLayer
            data={overallSentimentData}
            margin={{
              top: 12,
              right: isMobile ? 0 : 8,
              left: isMobile ? -8 : 8,
              bottom: 12,
            }}
            barCategoryGap={isMobile ? 18 : 28}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              interval={0}
              tick={{ fontSize: isMobile ? 10 : 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              allowDecimals={false}
              tick={{ fontSize: isMobile ? 10 : 11 }}
              width={isMobile ? 30 : 36}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={isMobile ? 40 : 64}>
              {overallSentimentData.map((item) => (
                <Cell key={item.key} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
