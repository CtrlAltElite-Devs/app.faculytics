"use client";

import { ChevronDown } from "lucide-react";

import type { DeanAcademicYear } from "@/features/faculty-analytics/lib/dean-analytics-view-model";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DeanDashboardHeaderProps = {
  academicYears: readonly DeanAcademicYear[];
  selectedAcademicYear: DeanAcademicYear;
  onAcademicYearChange: (value: DeanAcademicYear) => void;
  lastUpdated: string;
};

export function DeanDashboardHeader({
  academicYears,
  selectedAcademicYear,
  onAcademicYearChange,
  lastUpdated,
}: DeanDashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Department Analytics Overview
        </h1>
        <p className="mt-4 max-w-3xl font-sans text-sm text-muted-foreground sm:mt-5">
          Monitor response volume and department-level sentiment across the current academic year.
        </p>
      </div>
      <div className="w-full md:w-auto md:text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full min-w-0 justify-between rounded-xl px-4 py-2.5 font-sans text-sm md:min-w-56"
            >
              <span>{selectedAcademicYear}</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
          >
            <DropdownMenuRadioGroup
              value={selectedAcademicYear}
              onValueChange={(value) => onAcademicYearChange(value as DeanAcademicYear)}
            >
              {academicYears.map((year) => (
                <DropdownMenuRadioItem key={year} value={year} className="font-sans text-sm">
                  {year}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="mt-2 font-sans text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
      </div>
    </div>
  );
}
