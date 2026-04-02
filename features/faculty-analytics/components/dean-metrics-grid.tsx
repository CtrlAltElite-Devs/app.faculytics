import type { DeanDashboardViewModel } from "@/features/faculty-analytics/lib/dean-analytics-view-model";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function formatMetric(value: number, suffix?: string) {
  const formattedValue = Number.isInteger(value)
    ? new Intl.NumberFormat("en-US").format(value)
    : value.toFixed(1);

  return suffix ? `${formattedValue}${suffix}` : formattedValue;
}

function DeanMetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card className="gap-4 rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="pb-0">
        <div className="space-y-2">
          <CardDescription className="font-sans text-sm">{title}</CardDescription>
          <CardTitle className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
            {value}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="font-sans text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function DeanMetricsGrid({ summary }: { summary: DeanDashboardViewModel["summary"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DeanMetricCard
        title="Faculty Members"
        value={formatMetric(summary.faculties)}
        description="Active faculty members across the department"
      />
      <DeanMetricCard
        title="Student Responses"
        value={formatMetric(summary.studentResponses)}
        description="Submitted evaluation responses this term"
      />
      <DeanMetricCard
        title="Positive Sentiment Rate"
        value={formatMetric(summary.positiveSentimentRate, "%")}
        description="Average favorable sentiment across all faculties"
      />
      <DeanMetricCard
        title="Department Courses"
        value={formatMetric(summary.courses)}
        description="Courses currently handled by the department"
      />
    </div>
  );
}
