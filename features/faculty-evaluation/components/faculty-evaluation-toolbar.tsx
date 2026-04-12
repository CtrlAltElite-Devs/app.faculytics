"use client";

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
import type { FacultyEvaluationViewMode } from "@/features/faculty-evaluation/types";

type Option = {
  id: string | null;
  label: string;
};

type FacultyEvaluationToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  programs: Option[];
  selectedProgramId: string | null;
  selectedProgramLabel: string;
  onProgramChange: (value: string) => void;
  semesters: Option[];
  selectedSemesterId: string | null;
  selectedSemesterLabel: string;
  onSemesterChange: (value: string) => void;
  viewMode: FacultyEvaluationViewMode;
  onViewModeChange: (value: FacultyEvaluationViewMode) => void;
  showViewToggle: boolean;
};

export function FacultyEvaluationToolbar({
  searchValue,
  onSearchChange,
  programs,
  selectedProgramId,
  selectedProgramLabel,
  onProgramChange,
  semesters,
  selectedSemesterId,
  selectedSemesterLabel,
  onSemesterChange,
  viewMode,
  onViewModeChange,
  showViewToggle,
}: FacultyEvaluationToolbarProps) {
  return (
    <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
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
              onValueChange={onProgramChange}
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
              onValueChange={onSemesterChange}
            >
              {semesters.map((semester) => (
                <DropdownMenuRadioItem
                  key={semester.id ?? ""}
                  value={semester.id ?? ""}
                  className="font-sans text-sm"
                >
                  {semester.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {showViewToggle ? (
          <EvaluationViewToggle value={viewMode} onValueChange={onViewModeChange} />
        ) : null}
      </div>
    </div>
  );
}
