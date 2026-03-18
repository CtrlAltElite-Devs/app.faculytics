import { deanAnalyticsSampleData } from "@/app/(dashboard)/dean/_data/analytics-sample-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          <CardTitle className="text-3xl font-semibold tracking-tight">{value}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="font-sans text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function DeanMetricsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DeanMetricCard
        title="Faculty Members"
        value={formatMetric(deanAnalyticsSampleData.summary.faculties)}
        description="Active faculty members across the department"
      />
      <DeanMetricCard
        title="Student Responses"
        value={formatMetric(deanAnalyticsSampleData.summary.studentResponses)}
        description="Submitted evaluation responses this term"
      />
      <DeanMetricCard
        title="Positive Sentiment Rate"
        value={formatMetric(deanAnalyticsSampleData.summary.positiveSentimentRate, "%")}
        description="Average favorable sentiment across all faculties"
      />
      <DeanMetricCard
        title="Department Courses"
        value={formatMetric(deanAnalyticsSampleData.summary.courses)}
        description="Courses currently handled by the department"
      />
    </div>
  );
}
