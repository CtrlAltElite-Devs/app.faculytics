"use client";

import { QuestionnaireRatingScaleInstructions } from "@/features/questionnaires/components/questionnaire-rating-scale-instructions";
import { useMyEnrollments } from "@/features/enrollments/hooks/use-my-enrollments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { decodeHtmlEntities } from "@/lib/string";
import { useSelectedCourseStore } from "@/stores/selected-course-store";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { FacultyEvaluationQuestionnaireState } from "../../_components/faculty-evaluation-questionnaire-state";
import { FacultyEvaluationSummary } from "../../_components/faculty-evaluation-summary";

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
    selectedEnrollment
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

      <FacultyEvaluationSummary
        facultyName={facultyName}
        facultyId={facultyId}
        fullname={fullname}
        shortname={shortname}
      />

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
          <FacultyEvaluationQuestionnaireState contextState={contextState} />

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
