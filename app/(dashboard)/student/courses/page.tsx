"use client";

import { useMyEnrollments } from "@/features/enrollments/hooks/use-my-enrollments";
import { useSelectedCourseStore } from "@/stores/selected-course-store";

import { CourseGrid } from "./_components/course-grid";
import { CoursesEmptyState } from "./_components/courses-empty-state";
import { CoursesErrorState } from "./_components/courses-error-state";
import { CoursesLoadingState } from "./_components/courses-loading-state";

export default function StudentCoursesPage() {
  const setSelectedCourse = useSelectedCourseStore((state) => state.setSelectedCourse);
  const { data, isLoading, isError } = useMyEnrollments({ page: 1, limit: 100 });
  const enrolledCourses = data?.data ?? [];

  return (
    <section className="md:px-16 md:py-12">
      <h1 className="text-3xl font-bold font-playfair">Courses</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You are currently enrolled in {enrolledCourses.length} courses this semester
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? <CoursesLoadingState /> : null}
        {isError ? <CoursesErrorState /> : null}
        {!isLoading && !isError ? (
          <CourseGrid enrollments={enrolledCourses} onSelectCourse={setSelectedCourse} />
        ) : null}
      </div>
      {!isLoading && !isError && enrolledCourses.length === 0 ? <CoursesEmptyState /> : null}
    </section>
  );
}
