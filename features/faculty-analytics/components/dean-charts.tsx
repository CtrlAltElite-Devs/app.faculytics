"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import type {
  DeanOverallSentimentDatum,
  DeanSemesterSentimentDatum,
} from "@/features/faculty-analytics/lib/dean-analytics-view-model";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
              content={<ChartLegendContent className="pt-1 font-sans" />}
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

export function DeanOverallSentimentPieChart({
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
      <CardContent className="overflow-hidden">
        <ChartContainer
          config={overallSentimentChartConfig}
          className="mx-auto aspect-auto h-[18rem] min-h-[18rem] w-full max-w-[20rem] [&_.recharts-default-legend]:flex-wrap [&_.recharts-default-legend]:justify-center [&_.recharts-default-legend]:gap-y-1 [&_.recharts-legend-item]:!mr-3 sm:h-[20rem] sm:max-w-md lg:h-[22rem]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
            <ChartLegend
              verticalAlign="bottom"
              content={<ChartLegendContent nameKey="key" className="font-sans" />}
            />
            <Pie
              data={overallSentimentData}
              dataKey="value"
              nameKey="key"
              innerRadius={isMobile ? 40 : 56}
              outerRadius={isMobile ? 64 : 88}
              strokeWidth={4}
            >
              {overallSentimentData.map((item) => (
                <Cell key={item.key} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
