import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type EvaluationPageShellProps = {
  children: React.ReactNode;
  courseName?: string;
  courseShortname?: string;
  facultyName?: string;
};

export function EvaluationPageShell({
  children,
  courseName,
  courseShortname,
  facultyName,
}: EvaluationPageShellProps) {
  return (
    <section className="px-4 py-5 sm:px-6 md:px-16 md:py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold">
            Faculty Evaluation Questionnaire
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your honest feedback helps improve the quality of education.
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/student/courses">
            <ArrowLeft className="size-4" />
            Back to Courses
          </Link>
        </Button>
      </div>

      {courseName && facultyName && (
        <Card className="mt-8">
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Instructor
              </p>
              <p className="mt-2 font-playfair text-lg font-semibold">
                {facultyName}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Course
              </p>
              <p className="mt-2 text-lg font-semibold">{courseName}</p>
              {courseShortname && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {courseShortname}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {children}
    </section>
  );
}
