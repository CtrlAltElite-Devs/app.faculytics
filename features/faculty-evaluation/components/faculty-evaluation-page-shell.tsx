import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FacultyEvaluationRoleContext } from "@/features/faculty-evaluation/types";

type FacultyEvaluationPageShellProps = {
  role: FacultyEvaluationRoleContext;
  children: React.ReactNode;
  facultyName?: string;
  semesterLabel?: string;
  questionnaireTypeName?: string;
  backHref?: string;
};

export function FacultyEvaluationPageShell({
  role,
  children,
  facultyName,
  semesterLabel,
  questionnaireTypeName,
  backHref,
}: FacultyEvaluationPageShellProps) {
  return (
    <section className="px-4 py-5 sm:px-6 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-playfair text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Faculty Evaluation
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {role.roleLabel} respondents can evaluate faculty members within their authorized
              scope using the currently active questionnaire.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 self-start">
            <Link href={backHref ?? `${role.rolePath}/evaluation`}>Back to Evaluation</Link>
          </Button>
        </div>

        {(facultyName || semesterLabel || questionnaireTypeName) && (
          <Card className="mt-8 overflow-hidden border-border/70 bg-card shadow-sm">
            <CardContent className="grid gap-0 p-0 md:grid-cols-3">
              {facultyName ? (
                <div className="flex flex-col items-center px-5 py-5 text-center sm:px-6">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Faculty
                  </p>
                  <p className="mt-2 font-playfair text-xl font-semibold leading-tight text-foreground">
                    {facultyName}
                  </p>
                </div>
              ) : null}
              {semesterLabel ? (
                <div className="flex flex-col items-center border-t border-border/60 px-5 py-5 text-center sm:px-6 md:border-t-0 md:border-l">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Semester
                  </p>
                  <p className="mt-2 text-base font-semibold leading-6 text-foreground sm:text-lg">
                    {semesterLabel}
                  </p>
                </div>
              ) : null}
              {questionnaireTypeName ? (
                <div className="flex flex-col items-center border-t border-border/60 px-5 py-5 text-center sm:px-6 md:border-t-0 md:border-l">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Questionnaire Type
                  </p>
                  <p className="mt-2 text-base font-semibold leading-6 text-foreground sm:text-lg">
                    {questionnaireTypeName}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {children}
      </div>
    </section>
  );
}
