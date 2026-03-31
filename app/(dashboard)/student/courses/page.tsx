"use client";

import { useState } from "react";

import { useMyEnrollments } from "@/features/enrollments/hooks/use-my-enrollments";
import { useSelectedCourseStore } from "@/stores/selected-course-store";

import { CourseGrid } from "./_components/course-grid";
import { CourseList } from "./_components/course-list";
import { CoursesState } from "./_components/courses-state";
import { CoursesViewToggle, type CoursesViewMode } from "./_components/courses-view-toggle";

const COURSES_VIEW_STORAGE_KEY = "faculytics-student-courses-view";

function getInitialCoursesViewMode(): CoursesViewMode {
  if (typeof window === "undefined") {
    return "card";
  }

  const storedView = window.localStorage.getItem(COURSES_VIEW_STORAGE_KEY);

  return storedView === "list" || storedView === "card" ? storedView : "card";
}

export default function StudentCoursesPage() {
  const setSelectedCourse = useSelectedCourseStore((state) => state.setSelectedCourse);
  const [viewMode, setViewMode] = useState<CoursesViewMode>(getInitialCoursesViewMode);
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
  const coursesContent =
    coursesState === "ready" ? (
      viewMode === "card" ? (
        <CourseGrid enrollments={enrolledCourses} onSelectCourse={setSelectedCourse} />
      ) : (
        <CourseList enrollments={enrolledCourses} onSelectCourse={setSelectedCourse} />
      )
    ) : (
      <CoursesState state={coursesState} />
    );

  function handleViewModeChange(nextView: CoursesViewMode) {
    setViewMode(nextView);
    window.localStorage.setItem(COURSES_VIEW_STORAGE_KEY, nextView);
  }

  return (
    <section className="md:px-16 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-playfair">Courses</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You are currently enrolled in {enrolledCourses.length} courses this semester
          </p>
        </div>
        {coursesState === "ready" ? (
          <CoursesViewToggle value={viewMode} onValueChange={handleViewModeChange} />
        ) : null}
      </div>

      <div
        className={
          viewMode === "card"
            ? "mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "mt-8 space-y-4"
        }
      >
        {coursesContent}
      </div>
    </section>
  );
}
