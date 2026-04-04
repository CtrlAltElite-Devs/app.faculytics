"use client";

import { ChevronDown, RefreshCw } from "lucide-react";

import { ALL_PROGRAMS_VALUE } from "@/features/faculty-analytics/constants/filters";
import type {
  DeanProgramOption,
  DeanSemesterOption,
} from "@/features/faculty-analytics/lib/dean-analytics-view-model";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DeanDashboardHeaderProps = {
  semesters: readonly DeanSemesterOption[];
  programs: readonly DeanProgramOption[];
  selectedSemesterId: string | null;
  selectedSemesterLabel: string;
  onSemesterChange: (value: string) => void;
  selectedProgramCode: string | null;
  selectedProgramLabel: string;
  onProgramChange: (value: string) => void;
  lastUpdatedLabel: string;
  isRefreshing: boolean;
  onRefresh: () => void;
};

export function DeanDashboardHeader({
  semesters,
  programs,
  selectedSemesterId,
  selectedSemesterLabel,
  onSemesterChange,
  selectedProgramCode,
  selectedProgramLabel,
  onProgramChange,
  lastUpdatedLabel,
  isRefreshing,
  onRefresh,
}: DeanDashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Department Analytics Overview
        </h1>
        <p className="mt-4 max-w-3xl font-sans text-sm text-muted-foreground sm:mt-5">
          Monitor response volume and department-level sentiment for the selected semester.
        </p>
      </div>
      <div className="w-full md:w-auto md:text-right">
        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
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
          <Button
            type="button"
            variant="outline"
            className="w-full px-4 py-2.5 font-sans text-sm md:w-auto"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("mr-2 size-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Last updated: {lastUpdatedLabel}
        </p>
      </div>
    </div>
  );
}
