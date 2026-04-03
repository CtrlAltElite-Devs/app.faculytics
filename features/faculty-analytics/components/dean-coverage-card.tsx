import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DeanCoverageCardProps = {
  analyzedCount: number;
  totalFaculty: number;
  coveragePercentage: number;
};

function formatMetric(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function DeanCoverageCard({
  analyzedCount,
  totalFaculty,
  coveragePercentage,
}: DeanCoverageCardProps) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardDescription className="font-sans text-sm">Analysis Coverage</CardDescription>
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          {formatMetric(analyzedCount)} of {formatMetric(totalFaculty)} faculty analyzed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={coveragePercentage} className="bg-brand-blue/15 [&>*]:bg-brand-blue" />
        <p className="font-sans text-sm text-muted-foreground">
          {coveragePercentage.toFixed(1)}% of faculty records have analytics available for the
          selected semester.
        </p>
      </CardContent>
    </Card>
  );
}
