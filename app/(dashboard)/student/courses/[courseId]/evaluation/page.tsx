"use client";

import { QuestionnaireRatingScaleInstructions } from "@/features/questionnaires/components/questionnaire-rating-scale-instructions";
import { useMyEnrollments } from "@/features/enrollments/hooks/use-my-enrollments";
import { decodeHtmlEntities } from "@/lib/string";
import { useSelectedCourseStore } from "@/stores/selected-course-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function FacultyEvaluationPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const selectedCourseFromStore = useSelectedCourseStore((state) => state.selectedCourse);
  const hasStoreMatch = selectedCourseFromStore?.course.id === courseId;
  const { data, isLoading, isError } = useMyEnrollments(
    { page: 1, limit: 100 },
    { enabled: !hasStoreMatch }
  );

  const selectedEnrollment = hasStoreMatch
    ? selectedCourseFromStore
    : data?.data.find((enrollment) => enrollment.course.id === courseId);

  const contextState =
    hasStoreMatch || selectedEnrollment
      ? "ready"
      : isLoading
        ? "loading"
        : isError
          ? "error"
          : "missing";

  const selectedCourse = selectedEnrollment?.course;
  const selectedFaculty = selectedEnrollment?.faculty;
  const shortname = decodeHtmlEntities(selectedCourse?.shortname || "Course");
  const fullname = decodeHtmlEntities(selectedCourse?.fullname || "Selected course");
  const facultyName = decodeHtmlEntities(selectedFaculty?.fullName || "Instructor unavailable");
  const facultyId = selectedFaculty?.id || null;

  return (
    <section className="md:px-16 md:py-12">
      <h1 className="font-playfair text-3xl font-bold">Faculty Evaluation Questionnaire</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your honest feedback helps improve the quality of education.
      </p>

      <Card className="mt-8">
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Instructor
            </p>
            <p className="mt-2 font-playfair text-lg font-semibold">
              {facultyName}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {facultyId ? `Faculty ID: ${facultyId}` : "Faculty ID unavailable."}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Course
            </p>
            <p className="mt-2 text-lg font-semibold">{fullname}</p>
            <p className="mt-1 text-sm text-muted-foreground">{shortname}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <QuestionnaireRatingScaleInstructions />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-playfair">
            <ClipboardList className="size-5 text-muted-foreground" />
            Questionnaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {contextState === "loading" && (
            <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              <p className="text-sm">Loading course context...</p>
            </div>
          )}
          {contextState === "error" && (
            <div className="rounded-lg border border-dashed p-6 text-sm text-destructive">
              Unable to load course context right now.
            </div>
          )}
          {contextState === "missing" && (
            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              This course is not in your current enrollments.
            </div>
          )}
          {contextState === "ready" && (
            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              Questionnaire is not configured yet. This form will appear once the active
              questionnaire is published.
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/student/courses">Back to Courses</Link>
            </Button>
            <Button variant="brand">Submit Evaluation</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
