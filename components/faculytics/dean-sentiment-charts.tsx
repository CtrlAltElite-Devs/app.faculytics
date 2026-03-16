"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SentimentBarDatum = {
  sentiment: string;
  firstSemester: number;
  secondSemester: number;
};

type SentimentPieDatum = {
  label: string;
  value: number;
  fill: string;
};

type DeanSentimentChartsProps = {
  barChartData: SentimentBarDatum[];
  pieChartData: SentimentPieDatum[];
};

const barChartConfig = {
  firstSemester: {
    label: "First Semester",
    color: "var(--color-brand-blue)",
  },
  secondSemester: {
    label: "Second Semester",
    color: "var(--color-brand-yellow)",
  },
} satisfies ChartConfig;

const pieChartConfig = {
  Positive: {
    label: "Positive",
    color: "var(--color-brand-blue)",
  },
  Neutral: {
    label: "Neutral",
    color: "#B8BDC7",
  },
  Negative: {
    label: "Negative",
    color: "var(--color-brand-yellow)",
  },
} satisfies ChartConfig;

export function DeanSentimentCharts({
  barChartData,
  pieChartData,
}: DeanSentimentChartsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <Card className="gap-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">Semester Sentiment Comparison</CardTitle>
          <CardDescription>
            Overall sentiment for both semesters, categorized by positive, neutral, and negative sentiment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig} className="mt-8 h-[320px] w-full">
            <BarChart data={barChartData} barGap={10}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="sentiment" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
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

      <Card className="gap-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">Overall Sentiment Distribution</CardTitle>
          <CardDescription>
            View of the combined sentiment across all faculties for this department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieChartConfig} className="mx-auto h-[320px] w-full max-w-[320px]">
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="label" formatter={(value) => `${value}%`} />}
              />
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="label"
                innerRadius={68}
                outerRadius={108}
                paddingAngle={3}
              >
                {pieChartData.map((entry) => (
                  <Cell key={entry.label} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="label" className="flex-wrap" />}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
