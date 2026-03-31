"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useFacultyList, type FacultyListItem } from "@/features/dean";

import { deanEvaluationMockFacultyRows, type DeanEvaluationFacultyRow } from "./mock-faculty-data";
import { EvaluationViewToggle, type EvaluationViewMode } from "./evaluation-view-toggle";
import { FacultyGrid } from "./faculty-grid";
import { FacultyList } from "./faculty-list";
import { FacultyState } from "./faculty-state";

const EVALUATION_VIEW_STORAGE_KEY = "faculytics-dean-evaluation-view";

function getInitialEvaluationViewMode(): EvaluationViewMode {
  if (typeof window === "undefined") {
    return "card";
  }

  const storedView = window.localStorage.getItem(EVALUATION_VIEW_STORAGE_KEY);
  return storedView === "list" || storedView === "card" ? storedView : "card";
}

function mapFacultyRows(facultyRows?: FacultyListItem[]): DeanEvaluationFacultyRow[] {
  if (!facultyRows) return [];

  return facultyRows.map((faculty) => ({
    id: faculty.id,
    fullName: faculty.fullName,
    profilePicture: faculty.profilePicture,
    departmentName: null,
    subjects: faculty.subjects,
    statusLabel: "Ready for evaluation",
    statusTone: "ready",
  }));
}

export function DeanEvaluationScreen() {
  const searchParams = useSearchParams();
  const semesterId = searchParams.get("semesterId");
  const [viewMode, setViewMode] = useState<EvaluationViewMode>(getInitialEvaluationViewMode);
  const facultyQuery = useFacultyList(
    {
      semesterId: semesterId ?? "",
      page: 1,
      limit: 100,
    },
    {
      enabled: Boolean(semesterId),
    }
  );

  const facultyRows = useMemo(
    () =>
      semesterId
        ? mapFacultyRows(facultyQuery.data?.data)
        : deanEvaluationMockFacultyRows,
    [facultyQuery.data?.data, semesterId]
  );

  const facultyState = !semesterId
    ? facultyRows.length === 0
      ? "empty"
      : "ready"
    : facultyQuery.isLoading
      ? "loading"
      : facultyQuery.isError
        ? "error"
        : facultyRows.length === 0
          ? "empty"
          : "ready";

  const count = semesterId ? (facultyQuery.data?.meta.totalItems ?? facultyRows.length) : facultyRows.length;
  const helperCopy = semesterId
    ? `Showing ${count} faculty member${count === 1 ? "" : "s"} for the selected semester.`
    : "Preview mode is active. Add ?semesterId=<uuid> to this URL to load live dean-scoped faculty data.";

  const content =
    facultyState === "ready" ? (
      viewMode === "card" ? (
        <FacultyGrid facultyRows={facultyRows} />
      ) : (
        <FacultyList facultyRows={facultyRows} />
      )
    ) : (
      <FacultyState
        state={facultyState}
        message={
          facultyState === "error"
            ? "Unable to load dean-scoped faculty data. Verify the semesterId query parameter and backend availability."
            : facultyState === "loading"
              ? "Fetching faculty members for evaluation..."
              : undefined
        }
      />
    );

  function handleViewModeChange(nextView: EvaluationViewMode) {
    setViewMode(nextView);
    window.localStorage.setItem(EVALUATION_VIEW_STORAGE_KEY, nextView);
  }

  return (
    <section className="md:px-16 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold">Evaluation</h1>
          <p className="mt-2 text-sm text-muted-foreground">{helperCopy}</p>
        </div>
        {facultyState === "ready" ? (
          <EvaluationViewToggle value={viewMode} onValueChange={handleViewModeChange} />
        ) : null}
      </div>

      <div
        className={
          viewMode === "card"
            ? "mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "mt-8 space-y-4"
        }
      >
        {content}
      </div>
    </section>
  );
}
