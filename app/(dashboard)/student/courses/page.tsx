"use client";

import CourseCard from "@/components/faculytics/course-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyEnrollments } from "@/hooks/enrollments/use-my-enrollments";

const TEACHER_PLACEHOLDER = "Teacher unavailable";

export default function StudentCoursesPage() {
  const { data, isLoading, isError } = useMyEnrollments({ page: 1, limit: 100 });
  const enrolledCourses = data?.data ?? [];

  return (
    <section className="px-16 py-12">
      <h1 className="text-3xl font-bold font-playfair">Courses</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You are currently enrolled in {enrolledCourses.length} courses this
        semester
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`course-skeleton-${index}`} className="h-90 w-full" />
          ))}
        {isError && (
          <p className="text-sm text-destructive">
            Unable to load enrolled courses right now.
          </p>
        )}
        {!isLoading &&
          !isError &&
          enrolledCourses.map((enrollment) => (
            <CourseCard
              key={enrollment.id}
              shortname={enrollment.course.shortname}
              fullname={enrollment.course.fullname}
              teacherName={TEACHER_PLACEHOLDER}
            />
          ))}
      </div>
      {!isLoading && !isError && enrolledCourses.length === 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          You are not enrolled in any courses yet.
        </p>
      )}
    </section>
  );
}
