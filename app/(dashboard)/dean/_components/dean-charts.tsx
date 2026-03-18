"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { deanAnalyticsSampleData } from "@/app/(dashboard)/dean/_data/analytics-sample-data";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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

const semesterChartConfig = {
  firstSemester: {
    label: "First Semester",
    color: "#5b8cff",
  },
  secondSemester: {
    label: "Second Semester",
    color: "#f2c200",
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

const overallSentimentData = deanAnalyticsSampleData.overallSentiment.map((item) => ({
  ...item,
  key: item.label.toLowerCase(),
}));

const semesterSentimentData = deanAnalyticsSampleData.semesterSentiment.map((item) => ({
  ...item,
}));

export function DeanSentimentBarChart() {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Semester Sentiment Comparison</CardTitle>
        <CardDescription className="font-sans text-sm">
          Overall sentiment for both semesters, categorized by positive, neutral, and
          negative sentiment.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer
          config={semesterChartConfig}
          className="h-[21rem] w-full items-stretch justify-start [&_.recharts-legend-wrapper]:bottom-0!"
        >
          <BarChart
            accessibilityLayer
            data={semesterSentimentData}
            margin={{ top: 12, right: 16, left: 0, bottom: 12 }}
            barCategoryGap={28}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="sentiment"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
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
            />
            <Bar
              dataKey="secondSemester"
              fill="var(--color-secondSemester)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function DeanOverallSentimentPieChart() {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Overall Sentiment Distribution</CardTitle>
        <CardDescription className="font-sans text-sm">
          View of the combined sentiment across all faculties for this department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={overallSentimentChartConfig} className="mx-auto h-88 w-full max-w-md">
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
              innerRadius={72}
              outerRadius={108}
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
