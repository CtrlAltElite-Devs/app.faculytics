"use client";

import { useMemo, useState } from "react";

import { useCurrentStudentTerm } from "@/features/enrollments/hooks/use-current-student-term";
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

function formatTermLabel(semester: { label?: string; academicYear?: string; code: string }) {
  const parts: string[] = [];
  if (semester.label) parts.push(semester.label);
  if (semester.academicYear) parts.push(`AY ${semester.academicYear}`);
  return parts.length > 0 ? parts.join(", ") : semester.code;
}

export default function StudentCoursesPage() {
  const setSelectedCourse = useSelectedCourseStore((state) => state.setSelectedCourse);
  const [viewMode, setViewMode] = useState<CoursesViewMode>(getInitialCoursesViewMode);
  const { data, isLoading, isError } = useMyEnrollments({
    page: 1,
    limit: 100,
  });
  const term = useCurrentStudentTerm();

  const allEnrollments = useMemo(() => data?.data ?? [], [data?.data]);
  const currentTermEnrollments = useMemo(() => {
    if (term.status !== "ready") return [];
    return allEnrollments.filter((enrollment) => enrollment.semester?.id === term.semester.id);
  }, [allEnrollments, term]);

  const isTermLoading = term.status === "loading";
  const isTermError = term.status === "error";

  const coursesState =
    isLoading || isTermLoading
      ? "loading"
      : isError || isTermError
        ? "error"
        : currentTermEnrollments.length === 0
          ? "empty"
          : "ready";

  const coursesContent =
    coursesState === "ready" ? (
      viewMode === "card" ? (
        <CourseGrid enrollments={currentTermEnrollments} onSelectCourse={setSelectedCourse} />
      ) : (
        <CourseList enrollments={currentTermEnrollments} onSelectCourse={setSelectedCourse} />
      )
    ) : (
      <CoursesState state={coursesState} />
    );

  const termLabel = term.status === "ready" ? formatTermLabel(term.semester) : null;
  const subtitle =
    term.status === "loading" || isLoading
      ? "Loading your current term..."
      : termLabel
        ? `You are currently enrolled in ${currentTermEnrollments.length} ${
            currentTermEnrollments.length === 1 ? "course" : "courses"
          } for ${termLabel}.`
        : "We couldn't determine your current term.";

  function handleViewModeChange(nextView: CoursesViewMode) {
    setViewMode(nextView);
    window.localStorage.setItem(COURSES_VIEW_STORAGE_KEY, nextView);
  }

  return (
    <section className="md:px-16 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-playfair">Courses</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
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
