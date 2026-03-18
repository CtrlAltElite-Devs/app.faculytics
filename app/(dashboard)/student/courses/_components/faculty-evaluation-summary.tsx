import { Card, CardContent } from "@/components/ui/card";

type FacultyEvaluationSummaryProps = {
  facultyName: string;
  facultyId: string | null;
  fullname: string;
  shortname: string;
};

export function FacultyEvaluationSummary({
  facultyName,
  facultyId,
  fullname,
  shortname,
}: FacultyEvaluationSummaryProps) {
  return (
    <Card className="mt-8">
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Instructor
          </p>
          <p className="mt-2 font-playfair text-lg font-semibold">{facultyName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {facultyId ? `Faculty ID: ${facultyId}` : "Faculty ID unavailable."}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Course</p>
          <p className="mt-2 text-lg font-semibold">{fullname}</p>
          <p className="mt-1 text-sm text-muted-foreground">{shortname}</p>
        </div>
      </CardContent>
    </Card>
  );
}
