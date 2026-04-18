"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { ScopedAnalyticsEmptyState } from "@/features/faculty-analytics/components/scoped-analytics-empty-state";
import { ScopedAnalyticsErrorState } from "@/features/faculty-analytics/components/scoped-analytics-error-state";
import { ScopedAnalyticsLoadingState } from "@/features/faculty-analytics/components/scoped-analytics-loading-state";
import { ScopedFacultyAnalysisTable } from "@/features/faculty-analytics/components/scoped-faculty-analysis-table";
import { BatchReportExportDialog } from "@/features/faculty-analytics/components/batch-report-export-dialog";
import { ALL_PROGRAMS_VALUE } from "@/features/faculty-analytics/constants/filters";
import { useScopedFacultyAnalyticsListViewModel } from "@/features/faculty-analytics/hooks/use-scoped-faculty-analytics-list-view-model";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { ScopeLabel } from "@/features/faculty-analytics/components/scoped-analytics-dashboard-screen";

type ScopedFacultyListScreenProps = {
  scopeLabel: ScopeLabel;
  allowAllPrograms?: boolean;
};

export function ScopedFacultyListScreen({
  scopeLabel,
  allowAllPrograms = true,
}: ScopedFacultyListScreenProps) {
  const [isBatchExportDialogOpen, setIsBatchExportDialogOpen] = useState(false);
  const isCampusScope = scopeLabel === "Campus";
  const filtersGridClassName = isCampusScope
    ? "xl:grid-cols-[auto_minmax(18rem,1fr)_13rem_13rem_13rem]"
    : "xl:grid-cols-[auto_minmax(18rem,1fr)_13rem_13rem]";
  const {
    departments,
    semesters,
    programs,
    selectedDepartmentId,
    selectedDepartmentLabel,
    selectedSemesterId,
    selectedSemesterLabel,
    selectedProgramId,
    selectedProgramLabel,
    facultyList,
    pagination,
    searchValue,
    isLoading,
    isError,
    retry,
    setSelectedDepartmentId,
    setSelectedSemesterId,
    setSelectedProgramId,
    setSearchValue,
    setCurrentPage,
    setRowsPerPage,
  } = useScopedFacultyAnalyticsListViewModel({ scopeLabel, allowAllPrograms });
  const selectedProgramValue = selectedProgramId ?? (allowAllPrograms ? ALL_PROGRAMS_VALUE : "");

  return (
    <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <h1 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
            Faculties
          </h1>
          <p className="mt-4 max-w-3xl font-sans text-sm text-muted-foreground sm:mt-5">
            All faculties for the selected semester.
          </p>
        </div>
        <div className="w-full xl:max-w-6xl">
          <div className={`grid w-full grid-cols-1 gap-3 md:grid-cols-2 ${filtersGridClassName}`}>
            <Button
              type="button"
              variant="brand"
              className="w-full px-4 py-2.5 font-sans text-sm xl:w-auto"
              onClick={() => setIsBatchExportDialogOpen(true)}
              disabled={!selectedSemesterId}
            >
              Batch Export PDF
            </Button>
            <div className="relative w-full xl:min-w-[18rem]">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search faculty name..."
                className="pl-9"
                aria-label="Search faculty name"
              />
            </div>
            {isCampusScope ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm"
                    disabled={departments.length === 0}
                  >
                    <span className="truncate">{selectedDepartmentLabel}</span>
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
                >
                  <DropdownMenuRadioGroup
                    value={selectedDepartmentId ?? ""}
                    onValueChange={setSelectedDepartmentId}
                  >
                    {departments.map((department) => (
                      <DropdownMenuRadioItem
                        key={department.id || "all-departments"}
                        value={department.id}
                        className="font-sans text-sm"
                      >
                        {department.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm"
                  disabled={programs.length === 0}
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
                  value={selectedProgramValue}
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
                  className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm"
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
          </div>
        </div>
      </div>

      {isLoading ? <ScopedAnalyticsLoadingState message="Loading faculties..." /> : null}

      {!isLoading && isError ? (
        <ScopedAnalyticsErrorState onRetry={retry} message="Unable to load the faculties list." />
      ) : null}

      {!isLoading && !isError && facultyList.length === 0 ? (
        <ScopedAnalyticsEmptyState
          description={
            selectedSemesterId && searchValue.trim().length > 0
              ? "No faculty records matched your search for the selected semester."
              : `Faculty records will appear here once teaching assignments are available for the selected semester.`
          }
        />
      ) : null}

      {!isLoading && !isError && facultyList.length > 0 ? (
        <ScopedFacultyAnalysisTable
          facultyList={facultyList}
          pagination={pagination}
          selectedSemesterId={selectedSemesterId ?? ""}
          selectedSemesterLabel={selectedSemesterLabel}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
          scopeLabel={scopeLabel}
        />
      ) : null}

      <BatchReportExportDialog
        open={isBatchExportDialogOpen}
        onOpenChange={setIsBatchExportDialogOpen}
        semesterId={selectedSemesterId}
        semesterLabel={selectedSemesterLabel}
        departmentId={isCampusScope ? selectedDepartmentId : null}
        departmentLabel={isCampusScope ? selectedDepartmentLabel : "All Departments"}
        programId={selectedProgramId}
        programs={programs.map((program) => ({
          id: program.id,
          label: program.label,
        }))}
      />
    </section>
  );
}
