"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { deanAnalyticsSampleData } from "@/features/dean/lib/analytics-sample-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DeanDashboardHeader() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(
    deanAnalyticsSampleData.selectedAcademicYear
  );
  const featuredFaculty = deanAnalyticsSampleData.facultyAnalysis[0];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Department Performance Overview
        </h1>
        <p className="mt-4 max-w-3xl font-sans text-sm text-muted-foreground sm:mt-5">
          Monitor response volume and department-level sentiment here, then move into the
          dedicated analytics workspace for faculty-level analysis.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="brand" className="font-sans">
            <Link href="/dean/faculties">Open Faculty Analytics</Link>
          </Button>
          <Button asChild variant="outline" className="font-sans">
            <Link href={`/dean/faculties/${featuredFaculty.facultySlug}/analysis`}>
              Review Featured Faculty
            </Link>
          </Button>
        </div>
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
              onValueChange={(value) => {
                setSelectedAcademicYear(
                  value as (typeof deanAnalyticsSampleData.academicYears)[number]
                );
              }}
            >
              {deanAnalyticsSampleData.academicYears.map((year) => (
                <DropdownMenuRadioItem key={year} value={year} className="font-sans text-sm">
                  {year}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Last updated: {deanAnalyticsSampleData.lastUpdated}
        </p>
      </div>
    </div>
  );
}
