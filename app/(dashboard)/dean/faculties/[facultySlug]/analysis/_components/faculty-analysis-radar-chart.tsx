"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";

import type { DeanFacultyAnalysisRecord } from "@/features/faculty-analytics";
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
              className="min-w-44 justify-between font-sans"
            >
              <span>{metricViewLabels[selectedView]}</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuRadioGroup
              value={selectedView}
              onValueChange={(value) => setSelectedView(value as keyof typeof metricViewLabels)}
            >
              {(
                Object.entries(metricViewLabels) as Array<[keyof typeof metricViewLabels, string]>
              ).map(([view, label]) => (
                <DropdownMenuRadioItem key={view} value={view} className="font-sans text-sm">
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
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
          <div className="space-y-4 self-start">
            <CardTitle className="font-playfair text-lg font-semibold sm:text-xl">
              Metric Summary
            </CardTitle>
            <div className="data-table-wrapper">
              <Table>
                <TableBody>
                  {metricView.metrics.map((metric) => (
                    <TableRow key={`overall-${metric.metric}`} className="data-table-row">
                      <TableCell className="data-table-cell whitespace-normal font-normal text-muted-foreground">
                        {metric.metric}
                      </TableCell>
                      <TableCell className="data-table-cell text-center font-medium">
                        {formatScore(metric.score)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="data-table-row bg-muted/30 font-semibold hover:bg-muted/30">
                    <TableCell className="data-table-cell text-muted-foreground">
                      Overall Average Rating
                    </TableCell>
                    <TableCell className="data-table-cell text-center">
                      {formatScore(overallRating)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          {metricView.metrics.map((metric) => (
            <div key={metric.metric} className="data-table-wrapper">
              <Table className="w-full table-fixed [&_td]:whitespace-normal [&_th]:whitespace-normal">
                <TableHeader className="data-table-header">
                  <TableRow>
                    <TableHead className="data-table-head w-[62%]">{metric.metric}</TableHead>
                    <TableHead className="data-table-head w-[14%] text-center">Average</TableHead>
                    <TableHead className="data-table-head w-[24%]">Interpretation</TableHead>
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
