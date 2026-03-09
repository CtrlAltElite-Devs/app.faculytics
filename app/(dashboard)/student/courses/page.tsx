"use client";

import CourseCard from "@/components/faculytics/course-card";
import { useMyEnrollments } from "@/hooks/enrollments/use-my-enrollments";
import { useSelectedCourseStore } from "@/stores/selected-course-store";
import { Loader2 } from "lucide-react";

export default function StudentCoursesPage() {
  const setSelectedCourse = useSelectedCourseStore((state) => state.setSelectedCourse);
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
        {isLoading && (
          <div className="col-span-full flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <p className="text-sm">Fetching your enrolled courses...</p>
          </div>
        )}
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
              teacherName={enrollment.faculty?.fullName ?? "Teacher unavailable"}
              teacherImageSrc={enrollment.faculty?.profilePicture}
              imageSrc={enrollment.course.courseImage}
              feedbackHref={`/student/courses/${enrollment.course.id}/evaluation`}
              onGiveFeedback={() => setSelectedCourse(enrollment)}
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
