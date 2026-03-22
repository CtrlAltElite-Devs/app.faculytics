import type { DeanFacultyAnalysisRecord } from "@/app/(dashboard)/dean/_data/analytics-sample-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function FacultyMetricCard({
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

export function FacultyAnalysisSummary({
  faculty,
}: {
  faculty: DeanFacultyAnalysisRecord;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex items-center gap-4 lg:w-[30%] lg:flex-none">
            <Avatar className="size-14 border border-border/70">
              <AvatarFallback className="bg-slate-100 font-sans text-base font-semibold text-slate-700">
                {faculty.facultyInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-playfair text-xl font-semibold tracking-tight sm:text-2xl">
                {faculty.facultyName}
              </h1>
              <p className="mt-2 font-sans text-sm text-muted-foreground">
                CCS Department Faculty
              </p>
            </div>
          </div>
          <div className="space-y-3 lg:w-[70%] lg:flex-none">
            <p className="font-sans text-sm font-semibold text-muted-foreground">
              SUBJECT HANDLED
            </p>
            <div className="flex flex-wrap gap-2">
              {faculty.subjects.map((subject) => (
                <Badge
                  key={subject}
                  variant="outline"
                  className="rounded-full border-brand-blue/30 bg-brand-blue/10 px-3 py-1 font-sans text-xs text-brand-blue"
                >
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FacultyMetricCard
          title="Average Rating"
          value={faculty.averageRating.toFixed(1)}
          description="Overall student rating across the selected faculty's handled subjects."
        />
        <FacultyMetricCard
          title="Total Student Responses"
          value={new Intl.NumberFormat("en-US").format(faculty.responses)}
          description="Submitted evaluation responses included in this faculty analysis."
        />
        <FacultyMetricCard
          title="Positive Rate"
          value={faculty.overallPositiveRate}
          description="Share of responses indicating positive sentiment toward the faculty."
        />
      </div>
    </div>
  );
}
