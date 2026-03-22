"use client";

import { useState } from "react";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

import type { DeanFacultyAnalysisRecord } from "@/app/(dashboard)/dean/_data/analytics-sample-data";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

const metricViewLabels = {
  classroom: "In Classroom",
  outOfClassroom: "Out of Classroom",
  studentEvaluation: "Student Evaluation",
} as const;

const quantitativeMetricsChartConfig = {
  score: {
    label: "Average Score",
    color: "#5b8cff",
  },
} satisfies ChartConfig;

function formatScore(score: number) {
  return score.toFixed(2);
}

function getInterpretation(score: number) {
  if (score >= 4.5) {
    return "Excellent Performance";
  }

  if (score >= 3.5) {
    return "Very Good Performance";
  }

  if (score >= 2.5) {
    return "Good Performance";
  }

  if (score >= 1.5) {
    return "Fair Performance";
  }

  return "Poor Performance";
}

export function FacultyAnalysisRadarChart({
  faculty,
}: {
  faculty: DeanFacultyAnalysisRecord;
}) {
  const [selectedView, setSelectedView] =
    useState<keyof typeof metricViewLabels>("classroom");
  const metricView = faculty.quantitativeMetrics[selectedView];
  const radarData = metricView.metrics.map((metric) => ({
    metric: metric.metric,
    score: metric.score,
  }));
  const overallRating =
    radarData.reduce((sum, metric) => sum + metric.score, 0) / radarData.length;

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
            Quantitative Metric Analysis
          </CardTitle>
          <CardDescription className="font-sans text-sm">
            Multi-metric snapshot of faculty performance based on quantitative student
            evaluation scores.
          </CardDescription>
        </div>
        <ButtonGroup className="w-fit">
          {(Object.entries(metricViewLabels) as Array<
            [keyof typeof metricViewLabels, string]
          >).map(([view, label]) => (
            <Button
              key={view}
              type="button"
              variant={selectedView === view ? "default" : "outline"}
              size="sm"
              className={cn(
                "font-sans",
                selectedView === view && "bg-brand-blue/80 text-white hover:bg-brand-blue/70"
              )}
              onClick={() => setSelectedView(view)}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
          <ChartContainer
            config={quantitativeMetricsChartConfig}
            className="h-[18rem] w-full items-stretch justify-start sm:h-[21rem]"
          >
            <RadarChart
              accessibilityLayer
              data={radarData}
              outerRadius="72%"
              margin={{ top: 12, right: 24, bottom: 12, left: 24 }}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <PolarGrid />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                className="dark:[&_text]:fill-slate-400"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                tickCount={6}
                tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
              />
              <Radar
                name="score"
                dataKey="score"
                fill="var(--color-score)"
                fillOpacity={0.25}
                stroke="var(--color-score)"
                strokeWidth={2}
              />
            </RadarChart>
          </ChartContainer>
          <Card className="gap-4 rounded-2xl border-blue-200/70 bg-blue-50/70 shadow-sm dark:border-blue-900/70 dark:bg-blue-950/30">
            <CardHeader className="pb-0">
              <div className="space-y-2">
                <CardDescription className="font-sans text-sm">
                  Overall Average of the Report
                </CardDescription>
                <CardTitle className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
                  {formatScore(overallRating)}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-sans text-sm text-muted-foreground">
                {getInterpretation(overallRating)}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 space-y-4">
          {metricView.metrics.map((metric) => (
            <div
              key={metric.metric}
              className="overflow-hidden rounded-xl border border-border/70"
            >
              <Table>
                <TableHeader className="bg-blue-50 text-blue-700 dark:bg-muted/40 dark:text-foreground">
                  <TableRow>
                    <TableHead className="min-w-[26rem] font-semibold">
                      {metric.metric}
                    </TableHead>
                    <TableHead className="min-w-[8rem] text-center font-semibold">
                      Average
                    </TableHead>
                    <TableHead className="min-w-[12rem] font-semibold">
                      Interpretation
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metric.questions.map((question) => (
                    <TableRow key={`${metric.metric}-${question.question}`}>
                      <TableCell className="whitespace-normal font-normal">
                        {question.question}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {formatScore(question.average)}
                      </TableCell>
                      <TableCell>{getInterpretation(question.average)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/30 font-semibold hover:bg-muted/30">
                    <TableCell>Overall Average Rating</TableCell>
                    <TableCell className="text-center">
                      {formatScore(metric.score)}
                    </TableCell>
                    <TableCell>{getInterpretation(metric.score)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
