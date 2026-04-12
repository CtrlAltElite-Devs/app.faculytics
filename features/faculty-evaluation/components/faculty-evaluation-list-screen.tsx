"use client";

import { useEffect, useMemo, useState } from "react";

import { FacultyGrid } from "@/features/faculty-evaluation/components/faculty-grid";
import { FacultyList } from "@/features/faculty-evaluation/components/faculty-list";
import { FacultyListState } from "@/features/faculty-evaluation/components/faculty-list-state";
import { FacultyEvaluationToolbar } from "@/features/faculty-evaluation/components/faculty-evaluation-toolbar";
import { useFacultyEvaluationListViewModel } from "@/features/faculty-evaluation/hooks/use-faculty-evaluation-list-view-model";
import { getEvaluatorQuestionnaireTypes } from "@/features/faculty-evaluation/lib/questionnaire-types";
import type {
  FacultyEvaluationRoleContext,
  FacultyEvaluationViewMode,
} from "@/features/faculty-evaluation/types";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";

const VIEW_STORAGE_KEY = "faculytics-faculty-evaluation-view";

function getInitialViewMode(): FacultyEvaluationViewMode {
  if (typeof window === "undefined") {
    return "card";
  }

  const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);
  return storedView === "list" || storedView === "card" ? storedView : "card";
}

export function FacultyEvaluationListScreen({ role }: { role: FacultyEvaluationRoleContext }) {
  const [viewMode, setViewMode] = useState<FacultyEvaluationViewMode>(getInitialViewMode);
  const questionnaireTypesQuery = useQuestionnaireTypes();
  const evaluatorQuestionnaireTypes = useMemo(
    () => getEvaluatorQuestionnaireTypes(questionnaireTypesQuery.data),
    [questionnaireTypesQuery.data]
  );
  const {
    semesters,
    programs,
    selectedSemesterId,
    selectedSemesterLabel,
    selectedProgramId,
    selectedProgramLabel,
    facultyRows,
    totalItems,
    searchValue,
    isLoading,
    isError,
    setSelectedSemesterId,
    setSelectedProgramId,
    setSearchValue,
  } = useFacultyEvaluationListViewModel();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VIEW_STORAGE_KEY, viewMode);
    }
  }, [viewMode]);

  const helperCopy = selectedSemesterId
    ? `Showing ${totalItems} faculty member${totalItems === 1 ? "" : "s"} for the selected semester.`
    : "Select a semester to load faculty members for evaluation.";

  const content =
    isLoading && selectedSemesterId ? (
      <FacultyListState state="loading" message="Fetching faculty members for evaluation..." />
    ) : isError ? (
      <FacultyListState state="error" message="Unable to load scoped faculty data." />
    ) : facultyRows.length === 0 ? (
      <FacultyListState state="empty" />
    ) : viewMode === "card" ? (
      <FacultyGrid
        facultyRows={facultyRows}
        role={role}
        semesterId={selectedSemesterId ?? ""}
        semesterLabel={selectedSemesterLabel}
        questionnaireTypes={evaluatorQuestionnaireTypes}
        typesLoading={questionnaireTypesQuery.isLoading}
      />
    ) : (
      <FacultyList
        facultyRows={facultyRows}
        role={role}
        semesterId={selectedSemesterId ?? ""}
        semesterLabel={selectedSemesterLabel}
        questionnaireTypes={evaluatorQuestionnaireTypes}
        typesLoading={questionnaireTypesQuery.isLoading}
      />
    );

  return (
    <section className="md:px-16 md:py-12">
      <div>
        <div>
          <h1 className="font-playfair text-3xl font-bold">Evaluation</h1>
          <p className="mt-2 text-sm text-muted-foreground">{helperCopy}</p>
        </div>
      </div>

      <FacultyEvaluationToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        programs={programs}
        selectedProgramId={selectedProgramId}
        selectedProgramLabel={selectedProgramLabel}
        onProgramChange={setSelectedProgramId}
        semesters={semesters}
        selectedSemesterId={selectedSemesterId}
        selectedSemesterLabel={selectedSemesterLabel}
        onSemesterChange={setSelectedSemesterId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={facultyRows.length > 0 && Boolean(selectedSemesterId)}
      />

      <div
        className={
          viewMode === "card"
            ? "mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
            : "mt-8 space-y-4"
        }
      >
        {content}
      </div>
    </section>
  );
}
