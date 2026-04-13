import type { ScopedDashboardViewModel } from "@/features/faculty-analytics/lib/scoped-analytics-view-model";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function formatMetric(value: number, suffix?: string) {
  const formattedValue = Number.isInteger(value)
    ? new Intl.NumberFormat("en-US").format(value)
    : value.toFixed(1);

  return suffix ? `${formattedValue}${suffix}` : formattedValue;
}

function ScopedMetricCard({
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

export function ScopedMetricsGrid({ summary }: { summary: ScopedDashboardViewModel["summary"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <ScopedMetricCard
        title="Total Faculty"
        value={formatMetric(summary.totalFaculty)}
        description="Faculty included in the selected semester overview"
      />
      <ScopedMetricCard
        title="Total Submissions"
        value={formatMetric(summary.totalSubmissions)}
        description="Submitted evaluation responses in the selected semester"
      />
      <ScopedMetricCard
        title="Total Analyzed"
        value={formatMetric(summary.totalAnalyzed)}
        description="Faculty records with generated analytics available"
      />
      <ScopedMetricCard
        title="Positive Sentiment Rate"
        value={formatMetric(summary.positiveSentimentRate, "%")}
        description="Share of analyzed sentiment marked positive in the selected semester"
      />
    </div>
  );
}
