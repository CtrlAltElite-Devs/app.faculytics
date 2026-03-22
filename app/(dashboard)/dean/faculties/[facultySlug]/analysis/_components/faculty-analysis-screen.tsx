"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import Link from "next/link";

import type {
  DeanFacultyAnalysisRecord,
  FacultyAnalysisSemesterKey,
} from "@/features/dean";
import { Button } from "@/components/ui/button";

import {
  FacultyAnalysisActionableInsights,
  FacultyAnalysisQualitativeOverview,
} from "./faculty-analysis-qualitative-metrics";
import { FacultyAnalysisRadarChart } from "./faculty-analysis-radar-chart";
import { FacultyAnalysisSummary } from "./faculty-analysis-summary";
import { FacultyAnalysisToolbar } from "./faculty-analysis-toolbar";

export function FacultyAnalysisScreen({
  faculty,
}: {
  faculty: DeanFacultyAnalysisRecord;
}) {
  const [selectedSemester, setSelectedSemester] =
    useState<FacultyAnalysisSemesterKey>("firstSemester");

  return (
    <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
        <FacultyAnalysisToolbar
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
        />
      </div>

      <FacultyAnalysisSummary faculty={faculty} />
      <FacultyAnalysisQualitativeOverview
        faculty={faculty}
        selectedSemester={selectedSemester}
      />
      <FacultyAnalysisRadarChart faculty={faculty} />
      <FacultyAnalysisActionableInsights
        faculty={faculty}
        selectedSemester={selectedSemester}
      />
      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" size="sm" className="font-sans">
          <Link href="/dean/dashboard">
            Back to Overview
          </Link>
        </Button>
        <Button
          type="button"
          variant="brand"
          size="icon-sm"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUp className="size-4" />
        </Button>
      </div>
    </section>
  );
}
