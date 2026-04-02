"use client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildOverallRecommendation } from "@/features/dean/lib/recommendation-utils";
import { useIsMobile } from "@/lib/use-mobile";

import { QualitativeFeedbackPlaceholderButton } from "./qualitative-feedback-placeholder-button";
import { QualitativeInsightGroup } from "./qualitative-insight-group";

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
                  innerRadius={isMobile ? 54 : 72}
                  outerRadius={isMobile ? 88 : 112}
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
                  <QualitativeFeedbackPlaceholderButton />
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
        <div className="grid gap-4 xl:grid-cols-2">
          <QualitativeInsightGroup
            title="Strengths to Maintain"
            accentClassName="text-emerald-700 dark:text-emerald-300"
            summaryCountLabel={`${qualitativeMetrics.strengthsToMaintain.length} generated answers`}
            recommendation={strengthsRecommendation}
            items={qualitativeMetrics.strengthsToMaintain}
          />
          <QualitativeInsightGroup
            title="Areas for Improvement"
            accentClassName="text-orange-700 dark:text-orange-300"
            summaryCountLabel={`${qualitativeMetrics.areasForImprovement.length} generated answers`}
            recommendation={improvementRecommendation}
            items={qualitativeMetrics.areasForImprovement}
          />
        </div>
      </CardContent>
    </Card>
  );
}
