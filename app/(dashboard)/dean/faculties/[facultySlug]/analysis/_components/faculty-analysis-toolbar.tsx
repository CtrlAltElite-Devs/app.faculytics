"use client";

import { ChevronDown } from "lucide-react";

import type { FacultyAnalysisSemesterKey } from "@/app/(dashboard)/dean/_data/analytics-sample-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const semesterLabels: Record<FacultyAnalysisSemesterKey, string> = {
  firstSemester: "First Semester",
  secondSemester: "Second Semester",
  summerSemester: "Summer",
};

export function FacultyAnalysisToolbar({
  selectedSemester,
  onSemesterChange,
}: {
  selectedSemester: FacultyAnalysisSemesterKey;
  onSemesterChange: (semester: FacultyAnalysisSemesterKey) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="min-w-44 justify-between font-sans">
            <span>{semesterLabels[selectedSemester]}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuRadioGroup
            value={selectedSemester}
            onValueChange={(value) => onSemesterChange(value as FacultyAnalysisSemesterKey)}
          >
            {(Object.entries(semesterLabels) as Array<[FacultyAnalysisSemesterKey, string]>).map(
              ([value, label]) => (
                <DropdownMenuRadioItem key={value} value={value} className="font-sans text-sm">
                  {label}
                </DropdownMenuRadioItem>
              )
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button type="button" variant="outline" size="sm" className="font-sans">
        Import File
      </Button>
      <Button type="button" variant="brand" size="sm" className="font-sans">
        Export Report
      </Button>
    </div>
  );
}
