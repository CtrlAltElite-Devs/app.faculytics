"use client";

import { ArrowUpRight } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

import type { DeanFacultyAnalysisRecord, FacultyAnalysisSemesterKey } from "@/features/dean";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildOverallRecommendation } from "@/features/dean/lib/recommendation-utils";
import { useIsMobile } from "@/lib/use-mobile";

const qualitativeSentimentChartConfig = {
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

function useQualitativeMetricsData(
  faculty: DeanFacultyAnalysisRecord,
  selectedSemester: FacultyAnalysisSemesterKey
) {
  const isMobile = useIsMobile();
  const qualitativeMetrics = faculty.qualitativeMetrics[selectedSemester];
  const sentimentData = qualitativeMetrics.sentiment.map((item) => ({
    ...item,
    key: item.label.toLowerCase(),
  }));
  const maxMentions = Math.max(...qualitativeMetrics.keyThemes.map((theme) => theme.mentions), 1);
  const strengthsActionItems = qualitativeMetrics.actionPlans.strengthsToMaintain.flatMap(
    (plan) => plan.items
  );
  const improvementActionItems = qualitativeMetrics.actionPlans.areasForImprovement.flatMap(
    (plan) => plan.items
  );
  const strengthsRecommendation = buildOverallRecommendation(strengthsActionItems);
  const improvementRecommendation = buildOverallRecommendation(improvementActionItems);

  return {
    isMobile,
    qualitativeMetrics,
    sentimentData,
    maxMentions,
    strengthsRecommendation,
    improvementRecommendation,
  };
}

export function FacultyAnalysisQualitativeOverview({
  faculty,
  selectedSemester,
}: {
  faculty: DeanFacultyAnalysisRecord;
  selectedSemester: FacultyAnalysisSemesterKey;
}) {
  const { isMobile, qualitativeMetrics, sentimentData, maxMentions } = useQualitativeMetricsData(
    faculty,
    selectedSemester
  );

  return (
    <section>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-stretch">
        <Card className="flex flex-col rounded-2xl border-border/70 shadow-sm xl:h-full">
        <CardHeader>
          <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
            Qualitative Sentiment Overview
          </CardTitle>
        </CardHeader>
          <CardContent className="flex flex-1 items-center">
            <ChartContainer
              config={qualitativeSentimentChartConfig}
              className="mx-auto h-full min-h-[18rem] w-full max-w-md [&_.recharts-default-legend]:flex-wrap [&_.recharts-default-legend]:justify-center [&_.recharts-legend-item]:!mr-3"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
                <ChartLegend
                  verticalAlign="bottom"
                  content={<ChartLegendContent nameKey="key" className="font-sans" />}
                />
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="key"
                  innerRadius={isMobile ? 44 : 56}
                  outerRadius={isMobile ? 72 : 88}
                  strokeWidth={4}
                >
                  {sentimentData.map((item) => (
                    <Cell key={item.key} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
              Key Feedback Themes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qualitativeMetrics.keyThemes.map((theme) => {
              const percentage = (theme.mentions / maxMentions) * 100;

              return (
                <div key={theme.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-sans text-sm font-medium">{theme.label}</p>
                    <p className="font-sans text-sm text-muted-foreground">
                      {theme.mentions} mentions
                    </p>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-blue/80"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-sans text-sm font-medium text-brand-blue transition-colors hover:text-brand-blue/80"
                  >
                    <span>View Feedback</span>
                    <ArrowUpRight className="size-4" />
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function FacultyAnalysisActionableInsights({
  faculty,
  selectedSemester,
}: {
  faculty: DeanFacultyAnalysisRecord;
  selectedSemester: FacultyAnalysisSemesterKey;
}) {
  const { qualitativeMetrics, strengthsRecommendation, improvementRecommendation } =
    useQualitativeMetricsData(faculty, selectedSemester);

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          Actionable Insights and Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-muted/20 p-4 dark:border-emerald-900/70">
            <div className="flex items-center gap-2">
              <h3 className="font-playfair text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                Strengths to Maintain
              </h3>
              <span className="font-sans text-xs text-muted-foreground">
                {qualitativeMetrics.strengthsToMaintain.length} generated answers
              </span>
            </div>
            <div className="mt-3 space-y-3">
              {qualitativeMetrics.strengthsToMaintain.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-border/70 bg-background p-3"
                >
                  <h4 className="font-playfair text-base font-semibold">{item.title}</h4>
                  <p className="mt-1 font-sans text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-900/70 dark:bg-emerald-950/20">
              <p className="font-playfair text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Action Plan
              </p>
              <p className="mt-2 font-sans text-sm text-muted-foreground">
                {strengthsRecommendation}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-orange-200 bg-muted/20 p-4 dark:border-orange-900/70">
            <div className="flex items-center gap-2">
              <h3 className="font-playfair text-lg font-semibold text-orange-700 dark:text-orange-300">
                Areas for Improvement
              </h3>
              <span className="font-sans text-xs text-muted-foreground">
                {qualitativeMetrics.areasForImprovement.length} generated answers
              </span>
            </div>
            <div className="mt-3 space-y-3">
              {qualitativeMetrics.areasForImprovement.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-border/70 bg-background p-3"
                >
                  <h4 className="font-playfair text-base font-semibold">{item.title}</h4>
                  <p className="mt-1 font-sans text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50/70 p-3 dark:border-orange-900/70 dark:bg-orange-950/20">
              <p className="font-playfair text-sm font-semibold text-orange-700 dark:text-orange-300">
                Action Plan
              </p>
              <p className="mt-2 font-sans text-sm text-muted-foreground">
                {improvementRecommendation}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
