import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type EvaluationPageShellProps = {
  children: React.ReactNode;
  courseName?: string;
  courseShortname?: string;
  facultyName?: string;
  facultyProfilePicture?: string | null;
  enrollmentSectionName?: string;
};

function getInitials(fullName: string) {
  return (
    fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "F"
  );
}

export function EvaluationPageShell({
  children,
  courseName,
  courseShortname,
  facultyName,
  facultyProfilePicture,
  enrollmentSectionName,
}: EvaluationPageShellProps) {
  return (
    <section className="py-5 sm:px-6 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Mobile: compact back link */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 mb-2 h-8 gap-1.5 px-2 text-xs text-muted-foreground sm:hidden"
        >
          <Link href="/student/courses">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to Courses
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-playfair text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              Faculty Evaluation
              <span className="block text-base font-medium text-muted-foreground sm:hidden">
                Questionnaire
              </span>
              <span className="hidden sm:inline"> Questionnaire</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-3 sm:text-base">
              Your honest feedback helps improve the quality of education.
            </p>
          </div>
          <Button asChild variant="outline" className="hidden shrink-0 self-start sm:inline-flex">
            <Link href="/student/courses">Back to Courses</Link>
          </Button>
        </div>

        {courseName && facultyName && (
          <Card className="mt-5 overflow-hidden border-border/70 bg-card py-0 shadow-sm sm:mt-8">
            <CardContent className="grid gap-0 p-0 md:grid-cols-3">
              <div className="flex flex-col items-start gap-0.5 px-4 py-3.5 text-left sm:items-center sm:gap-0 sm:px-6 sm:py-5 sm:text-center">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-[0.68rem]">
                  Instructor
                </p>
                <div className="flex items-center gap-2.5 sm:mt-2 sm:flex-col sm:gap-2">
                  <Avatar size="default" className="border border-border/70">
                    {facultyProfilePicture ? (
                      <AvatarImage src={facultyProfilePicture} alt={facultyName} />
                    ) : null}
                    <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
                      {getInitials(facultyName ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-playfair text-base font-semibold leading-tight text-foreground sm:text-xl">
                    {facultyName}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5 border-t border-border/60 px-4 py-3.5 text-left sm:items-center sm:gap-0 sm:px-6 sm:py-5 sm:text-center md:border-t-0 md:border-l">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-[0.68rem]">
                  Course
                </p>
                <p className="text-sm font-semibold leading-snug text-foreground sm:mt-2 sm:text-lg">
                  {courseName}
                </p>
                {courseShortname && (
                  <p className="text-xs text-muted-foreground sm:mt-1 sm:text-sm">
                    {courseShortname}
                  </p>
                )}
              </div>
              {enrollmentSectionName && (
                <div className="flex flex-col items-start gap-0.5 border-t border-border/60 px-4 py-3.5 text-left sm:items-center sm:gap-0 sm:px-6 sm:py-5 sm:text-center md:border-t-0 md:border-l">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-[0.68rem]">
                    Section
                  </p>
                  <p className="text-sm font-semibold leading-snug text-foreground sm:mt-2 sm:text-lg">
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
