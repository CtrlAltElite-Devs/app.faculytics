"use client";

import { useMyEnrollments } from "@/hooks/enrollments/use-my-enrollments";
import { useSelectedCourseStore } from "@/stores/selected-course-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

/*
  TODO: Populate with instructor data from the course
*/
export default function FacultyEvaluationPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const selectedCourseFromStore = useSelectedCourseStore((state) => state.selectedCourse);
  const hasStoreMatch = selectedCourseFromStore?.id === courseId;
  const { data, isLoading, isError } = useMyEnrollments(
    { page: 1, limit: 100 },
    { enabled: !hasStoreMatch }
  );

  const selectedCourse = hasStoreMatch
    ? selectedCourseFromStore
    : data?.data.find((enrollment) => enrollment.course.id === courseId)?.course;

  const contextState =
    hasStoreMatch || selectedCourse
      ? "ready"
      : isLoading
        ? "loading"
        : isError
          ? "error"
          : "missing";

  const shortname = selectedCourse?.shortname || "Course";
  const fullname = selectedCourse?.fullname || "Selected course";

  return (
    <section className="px-16 py-12">
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
              Instructor name here
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Instructor details will be shown once backend data is available.
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

      <Card className="mt-8 bg-brand-yellow/30 border border-brand-yellow/90">
        <CardHeader>
          <CardTitle className="text-lg font-playfair">Rating Scale Instructions</CardTitle>
          <CardDescription className="text-primary">Please rate each statement using the following scale:</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <p className="font-medium">1 - Strongly Disagree</p>
            <p className="mt-1 text-primary">
              Performance does not conform with University of Cebu standards.
            </p>
          </div>
          <div>
            <p className="font-medium">2 - Disagree</p>
            <p className="mt-1 text-primary">
              Performance is below University of Cebu standards.
            </p>
          </div>
          <div>
            <p className="font-medium">3 - Neutral</p>
            <p className="mt-1 text-primary">
              Performance is within standards in many instances.
            </p>
          </div>
          <div>
            <p className="font-medium">4 - Agree</p>
            <p className="mt-1 text-primary">
              Performance is within standards in most cases.
            </p>
          </div>
          <div>
            <p className="font-medium">5 - Strongly Agree</p>
            <p className="mt-1 text-primary">
              Performance exceeds University of Cebu standards consistently.
            </p>
          </div>
        </CardContent>
      </Card>

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
            <Button className="bg-brand-blue/80 hover:bg-brand-blue/60">Submit Evaluation</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
