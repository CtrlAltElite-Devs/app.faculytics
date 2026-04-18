"use client";

import { ChevronDown } from "lucide-react";

import { ALL_PROGRAMS_VALUE } from "@/features/faculty-analytics/constants/filters";
import type {
  ScopedDepartmentOption,
  ScopedProgramOption,
  ScopedSemesterOption,
} from "@/features/faculty-analytics/lib/scoped-analytics-view-model";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ScopedDashboardHeaderProps = {
  departments: readonly ScopedDepartmentOption[];
  selectedDepartmentId: string | null;
  selectedDepartmentLabel: string;
  onDepartmentChange: (value: string) => void;
  semesters: readonly ScopedSemesterOption[];
  programs: readonly ScopedProgramOption[];
  selectedSemesterId: string | null;
  selectedSemesterLabel: string;
  onSemesterChange: (value: string) => void;
  selectedProgramCode: string | null;
  selectedProgramLabel: string;
  onProgramChange: (value: string) => void;
  lastUpdatedLabel: string;
  scopeLabel: "Campus" | "Department" | "Program";
};

function getScopeDescription(scopeLabel: ScopedDashboardHeaderProps["scopeLabel"]) {
  switch (scopeLabel) {
    case "Campus":
      return "Monitor response volume and campus-level sentiment for the selected semester.";
    case "Program":
      return "Monitor response volume and program-level sentiment for your assigned scope in the selected semester.";
    case "Department":
    default:
      return "Monitor response volume and department-level sentiment for the selected semester.";
  }
}

export function ScopedDashboardHeader({
  departments,
  selectedDepartmentId,
  selectedDepartmentLabel,
  onDepartmentChange,
  semesters,
  programs,
  selectedSemesterId,
  selectedSemesterLabel,
  onSemesterChange,
  selectedProgramCode,
  selectedProgramLabel,
  onProgramChange,
  lastUpdatedLabel,
  scopeLabel,
}: ScopedDashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          {scopeLabel} Analytics Overview
        </h1>
        <p className="mt-4 max-w-3xl font-sans text-sm text-muted-foreground sm:mt-5">
          {getScopeDescription(scopeLabel)}
        </p>
      </div>
      <div className="w-full md:w-auto md:text-right">
        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm md:w-48 md:max-w-48"
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
                onValueChange={onSemesterChange}
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
          {scopeLabel === "Campus" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm md:w-48 md:max-w-48"
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
                  onValueChange={onDepartmentChange}
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
                className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm md:w-48 md:max-w-48"
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
                value={selectedProgramCode ?? ALL_PROGRAMS_VALUE}
                onValueChange={onProgramChange}
              >
                {programs.map((program) => (
                  <DropdownMenuRadioItem
                    key={program.code ?? ALL_PROGRAMS_VALUE}
                    value={program.code ?? ALL_PROGRAMS_VALUE}
                    className="font-sans text-sm"
                  >
                    {program.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Last updated: {lastUpdatedLabel}
        </p>
      </div>
    </div>
  );
}
