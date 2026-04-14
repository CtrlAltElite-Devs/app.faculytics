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

export function ScopedFacultyListScreen({ scopeLabel }: { scopeLabel: ScopeLabel }) {
  const [isBatchExportDialogOpen, setIsBatchExportDialogOpen] = useState(false);
  const {
    semesters,
    programs,
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
    setSelectedSemesterId,
    setSelectedProgramId,
    setSearchValue,
    setCurrentPage,
    setRowsPerPage,
  } = useScopedFacultyAnalyticsListViewModel();

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
        <div className="flex w-full flex-col gap-3 xl:max-w-5xl">
          <div className="flex w-full flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-end">
            <Button
              type="button"
              variant="brand"
              className="w-full px-4 py-2.5 font-sans text-sm md:w-auto md:shrink-0"
              onClick={() => setIsBatchExportDialogOpen(true)}
              disabled={!selectedSemesterId}
            >
              Batch Export PDF
            </Button>
            <div className="relative w-full md:min-w-[18rem] md:flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search faculty name..."
                className="pl-9"
                aria-label="Search faculty name"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm md:w-[13rem] md:shrink-0"
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
                  className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm md:w-[13rem] md:shrink-0"
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
        programId={selectedProgramId}
        programs={programs.map((program) => ({
          id: program.id,
          label: program.label,
        }))}
      />
    </section>
  );
}
