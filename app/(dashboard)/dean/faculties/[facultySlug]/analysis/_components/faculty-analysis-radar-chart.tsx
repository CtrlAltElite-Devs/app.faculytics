"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";

import type { DeanFacultyAnalysisRecord } from "@/features/dean";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
              className="min-w-48 justify-between font-sans"
            >
              <span>{metricViewLabels[selectedView]}</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuRadioGroup
              value={selectedView}
              onValueChange={(value) => setSelectedView(value as keyof typeof metricViewLabels)}
            >
              {(Object.entries(metricViewLabels) as Array<
                [keyof typeof metricViewLabels, string]
              >).map(([view, label]) => (
                <DropdownMenuRadioItem key={view} value={view} className="font-sans text-sm">
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="mt-3 grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <ChartContainer
            config={quantitativeMetricsChartConfig}
            className="h-[18rem] w-full items-stretch justify-start sm:h-[21rem] lg:h-full lg:min-h-[21rem]"
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
          <div className="self-start">
            <div className="flex flex-col p-4">
              <div className="mb-2 px-4">
                <p className="font-playfair text-lg font-semibold tracking-tight sm:text-xl">
                  {metricViewLabels[selectedView]}
                </p>
              </div>
              <Table className="w-full table-fixed">
                <TableBody>
                  {metricView.metrics.map((metric) => (
                    <TableRow key={`${metric.metric}-summary`} className="data-table-row">
                      <TableCell className="data-table-cell w-[72%] py-3 whitespace-normal font-medium">
                        {metric.metric}
                      </TableCell>
                      <TableCell className="data-table-cell w-[28%] py-3 text-center">
                        {formatScore(metric.score)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/70 px-4 pt-3">
                <p className="font-sans text-sm font-medium text-foreground">Overall Average Rating</p>
                <div className="flex items-baseline gap-2 text-right">
                  <p className="font-playfair text-lg font-semibold tracking-tight">
                    {formatScore(overallRating)}
                  </p>
                  <p className="font-sans text-sm text-muted-foreground">
                    {getInterpretation(overallRating)}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
