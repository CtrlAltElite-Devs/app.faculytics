"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ALL_PROGRAMS_VALUE } from "@/features/faculty-analytics/constants/filters";
import { EvaluationViewToggle } from "@/features/faculty-evaluation/components/evaluation-view-toggle";
import { FacultyGrid } from "@/features/faculty-evaluation/components/faculty-grid";
import { FacultyList } from "@/features/faculty-evaluation/components/faculty-list";
import { FacultyListState } from "@/features/faculty-evaluation/components/faculty-list-state";
import { useFacultyEvaluationListViewModel } from "@/features/faculty-evaluation/hooks/use-faculty-evaluation-list-view-model";
import type {
  FacultyEvaluationRoleContext,
  FacultyEvaluationViewMode,
} from "@/features/faculty-evaluation/types";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";

const VIEW_STORAGE_KEY = "faculytics-faculty-evaluation-view";
const STUDENT_ONLY_QUESTIONNAIRE_TYPE_CODE = "FACULTY_FEEDBACK";

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
    () =>
      (questionnaireTypesQuery.data ?? []).filter(
        (type) => type.code !== STUDENT_ONLY_QUESTIONNAIRE_TYPE_CODE
      ),
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

      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search faculty name..."
            className="pl-9"
            aria-label="Search faculty name"
          />
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm sm:w-56"
                disabled={!selectedSemesterId || programs.length === 0}
              >
                <span className="truncate">{selectedProgramLabel}</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
            >
              <DropdownMenuRadioGroup
                value={selectedProgramId ?? ALL_PROGRAMS_VALUE}
                onValueChange={setSelectedProgramId}
              >
                {programs.map((program) => (
                  <DropdownMenuRadioItem
                    key={program.id ?? ALL_PROGRAMS_VALUE}
                    value={program.id ?? ALL_PROGRAMS_VALUE}
                    className="font-sans text-sm"
                  >
                    {program.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm sm:w-56"
                disabled={semesters.length === 0}
              >
                <span className="truncate">{selectedSemesterLabel}</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
            >
              <DropdownMenuRadioGroup
                value={selectedSemesterId ?? ""}
                onValueChange={setSelectedSemesterId}
              >
                {semesters.map((semester) => (
                  <DropdownMenuRadioItem
                    key={semester.id}
                    value={semester.id}
                    className="font-sans text-sm"
                  >
                    {semester.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {facultyRows.length > 0 && selectedSemesterId ? (
            <EvaluationViewToggle value={viewMode} onValueChange={setViewMode} />
          ) : null}
        </div>
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
