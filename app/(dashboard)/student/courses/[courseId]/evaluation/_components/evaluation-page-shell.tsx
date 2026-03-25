import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type EvaluationPageShellProps = {
  children: React.ReactNode;
  courseName?: string;
  courseShortname?: string;
  facultyName?: string;
  enrollmentSectionName?: string;
};

export function EvaluationPageShell({
  children,
  courseName,
  courseShortname,
  facultyName,
  enrollmentSectionName,
}: EvaluationPageShellProps) {
  return (
    <section className="px-4 py-5 sm:px-6 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-playfair text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Faculty Evaluation Questionnaire
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Your honest feedback helps improve the quality of education.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 self-start">
            <Link href="/student/courses">Back to Courses</Link>
          </Button>
        </div>

        {courseName && facultyName && (
          <Card className="mt-8 overflow-hidden border-border/70 bg-card shadow-sm">
            <CardContent className="grid gap-0 p-0 md:grid-cols-3">
              <div className="flex flex-col items-center px-5 py-5 text-center sm:px-6">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Instructor
                </p>
                <p className="mt-2 font-playfair text-xl font-semibold leading-tight text-foreground">
                  {facultyName}
                </p>
              </div>
              <div className="flex flex-col items-center border-t border-border/60 px-5 py-5 text-center sm:px-6 md:border-t-0 md:border-l">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Course
                </p>
                <p className="mt-2 text-base font-semibold leading-6 text-foreground sm:text-lg">
                  {courseName}
                </p>
                {courseShortname && (
                  <p className="mt-1 text-sm text-muted-foreground">{courseShortname}</p>
                )}
              </div>
              {enrollmentSectionName && (
                <div className="flex flex-col items-center border-t border-border/60 px-5 py-5 text-center sm:px-6 md:border-t-0 md:border-l">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Section
                  </p>
                  <p className="mt-2 text-base font-semibold leading-6 text-foreground sm:text-lg">
                    {enrollmentSectionName}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {children}
      </div>
    </section>
  );
}
