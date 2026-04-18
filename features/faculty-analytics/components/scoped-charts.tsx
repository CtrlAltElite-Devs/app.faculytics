"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import type { ScopedOverallSentimentDatum } from "@/features/faculty-analytics/lib/scoped-analytics-view-model";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SENTIMENT_HEX } from "@/features/faculty-analytics/lib/sentiment-colors";
import { useIsMobile } from "@/lib/use-mobile";

const overallSentimentChartConfig = {
  positive: {
    label: "Positive",
    color: SENTIMENT_HEX.positive,
  },
  neutral: {
    label: "Neutral",
    color: SENTIMENT_HEX.neutral,
  },
  negative: {
    label: "Negative",
    color: SENTIMENT_HEX.negative,
  },
} satisfies ChartConfig;

export function ScopedOverallSentimentBarChart({
  overallSentiment,
}: {
  overallSentiment: ScopedOverallSentimentDatum[];
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
