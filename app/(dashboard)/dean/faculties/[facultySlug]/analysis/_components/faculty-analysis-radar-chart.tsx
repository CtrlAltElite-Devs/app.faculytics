"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";

import type { DeanFacultyAnalysisRecord } from "@/features/dean";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export function FacultyAnalysisRadarChart({ faculty }: { faculty: DeanFacultyAnalysisRecord }) {
  const [selectedView, setSelectedView] = useState<keyof typeof metricViewLabels>("classroom");
  const metricView = faculty.quantitativeMetrics[selectedView];
  const radarData = metricView.metrics.map((metric) => ({
    metric: metric.metric,
    score: metric.score,
  }));
  const overallRating = radarData.reduce((sum, metric) => sum + metric.score, 0) / radarData.length;

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
            Quantitative Metric Analysis
          </CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-w-44 justify-between font-sans"
            >
              <span>{metricViewLabels[selectedView]}</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuRadioGroup
              value={selectedView}
              onValueChange={(value) =>
                setSelectedView(value as keyof typeof metricViewLabels)
              }
            >
              {(Object.entries(metricViewLabels) as Array<[keyof typeof metricViewLabels, string]>).map(
                ([view, label]) => (
                  <DropdownMenuRadioItem
                    key={view}
                    value={view}
                    className="font-sans text-sm"
                  >
                    {label}
                  </DropdownMenuRadioItem>
                )
              )}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
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
            <div key={metric.metric} className="data-table-wrapper">
              <Table>
                <TableHeader className="data-table-header">
                  <TableRow>
                    <TableHead className="data-table-head min-w-[26rem]">{metric.metric}</TableHead>
                    <TableHead className="data-table-head min-w-[8rem] text-center">
                      Average
                    </TableHead>
                    <TableHead className="data-table-head min-w-[12rem]">Interpretation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metric.questions.map((question) => (
                    <TableRow
                      key={`${metric.metric}-${question.question}`}
                      className="data-table-row"
                    >
                      <TableCell className="data-table-cell whitespace-normal font-normal">
                        {question.question}
                      </TableCell>
                      <TableCell className="data-table-cell text-center font-medium">
                        {formatScore(question.average)}
                      </TableCell>
                      <TableCell className="data-table-cell">
                        {getInterpretation(question.average)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="data-table-row bg-muted/30 font-semibold hover:bg-muted/30">
                    <TableCell className="data-table-cell">Overall Average Rating</TableCell>
                    <TableCell className="data-table-cell text-center">
                      {formatScore(metric.score)}
                    </TableCell>
                    <TableCell className="data-table-cell">
                      {getInterpretation(metric.score)}
                    </TableCell>
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
