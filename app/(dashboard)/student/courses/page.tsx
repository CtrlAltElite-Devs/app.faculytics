"use client";

import { useMyEnrollments } from "@/features/enrollments/hooks/use-my-enrollments";
import { useSelectedCourseStore } from "@/stores/selected-course-store";

import { CourseGrid } from "./_components/course-grid";
import { CoursesState } from "./_components/courses-state";

export default function StudentCoursesPage() {
  const setSelectedCourse = useSelectedCourseStore((state) => state.setSelectedCourse);
  const { data, isLoading, isError } = useMyEnrollments({
    page: 1,
    limit: 100,
  });
  const enrolledCourses = data?.data ?? [];
  const coursesState = isLoading
    ? "loading"
    : isError
      ? "error"
      : enrolledCourses.length === 0
        ? "empty"
        : "ready";

  return (
    <section className="md:px-16 md:py-12">
      <h1 className="text-3xl font-bold font-playfair">Courses</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You are currently enrolled in {enrolledCourses.length} courses this semester
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {coursesState === "ready" ? (
          <CourseGrid enrollments={enrolledCourses} onSelectCourse={setSelectedCourse} />
        ) : (
          <CoursesState state={coursesState} />
        )}
      </div>
    </section>
  );
}
