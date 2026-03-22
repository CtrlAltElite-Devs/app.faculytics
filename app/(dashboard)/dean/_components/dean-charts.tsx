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
import { useIsMobile } from "@/hooks/use-mobile";

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

const overallSentimentData = deanAnalyticsSampleData.overallSentiment.map((item) => ({
  ...item,
  key: item.label.toLowerCase(),
}));

const semesterSentimentData = deanAnalyticsSampleData.semesterSentiment.map((item) => ({
  ...item,
}));

export function DeanSentimentBarChart() {
  const isMobile = useIsMobile();

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          Semester Sentiment Comparison
        </CardTitle>
        <CardDescription className="font-sans text-sm">
          Overall sentiment across semesters, categorized by positive, neutral, and
          negative sentiment.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer
          config={semesterChartConfig}
          className="h-[18rem] w-full items-stretch justify-start sm:h-[21rem] [&_.recharts-legend-wrapper]:bottom-0! [&_.recharts-default-legend]:flex-wrap [&_.recharts-default-legend]:justify-center [&_.recharts-legend-item]:!mr-3"
        >
          <BarChart
            accessibilityLayer
            data={semesterSentimentData}
            margin={{ top: 12, right: 8, left: 8, bottom: 12 }}
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

export function DeanOverallSentimentPieChart() {
  const isMobile = useIsMobile();

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          Overall Sentiment Distribution
        </CardTitle>
        <CardDescription className="font-sans text-sm">
          View of the combined sentiment across all faculties for this department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={overallSentimentChartConfig}
          className="mx-auto h-72 w-full max-w-md [&_.recharts-default-legend]:flex-wrap [&_.recharts-default-legend]:justify-center [&_.recharts-legend-item]:!mr-3 sm:h-88"
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
              innerRadius={isMobile ? 44 : 56}
              outerRadius={isMobile ? 72 : 88}
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
