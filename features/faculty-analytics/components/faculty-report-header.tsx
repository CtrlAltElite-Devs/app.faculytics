"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FACET_ORDER, formatFacetLabel } from "@/features/faculty-analytics/lib/facet-filter";
import type { Facet, VoiceBreakdown } from "@/features/faculty-analytics/types";

type FacultyReportHeaderProps = {
  backHref: string;
  courseId: string;
  courseLabel: string;
  availableCourses: Array<{
    id: string;
    label: string;
  }>;
  isCourseLoading: boolean;
  onCourseChange: (value: string) => void;
  onExport: () => void;
  // FAC-135 Phase C (Task C6): facet tabs replace the old questionnaire-type
  // dropdown. Count badges derived from `voiceBreakdown` (absent = no badges).
  selectedFacet: Facet;
  onFacetChange: (facet: Facet) => void;
  voiceBreakdown?: VoiceBreakdown | null;
};

function countForFacet(voiceBreakdown: VoiceBreakdown | null | undefined, facet: Facet): number {
  if (!voiceBreakdown) return 0;
  if (facet === "overall") {
    return (
      voiceBreakdown.facultyFeedback.submissionCount +
      voiceBreakdown.inClassroom.submissionCount +
      voiceBreakdown.outOfClassroom.submissionCount +
      voiceBreakdown.other.submissionCount
    );
  }
  return voiceBreakdown[facet].submissionCount;
}

export function FacultyReportHeader({
  backHref,
  courseId,
  courseLabel,
  availableCourses,
  isCourseLoading,
  onCourseChange,
  onExport,
  selectedFacet,
  onFacetChange,
  voiceBreakdown,
}: FacultyReportHeaderProps) {
  return (
    <nav
      aria-label="Faculty report controls"
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
    >
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="w-fit px-2 font-sans text-xs uppercase tracking-[0.18em] text-stone-500 hover:text-stone-900"
      >
        <Link href={backHref}>← Back to faculties</Link>
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        <Tabs
          value={selectedFacet}
          onValueChange={(value) => onFacetChange(value as Facet)}
          className="w-full sm:w-auto"
        >
          <TabsList className="flex h-auto w-full flex-wrap gap-1 sm:w-auto">
            {FACET_ORDER.map((facet) => {
              const count = countForFacet(voiceBreakdown, facet);
              return (
                <TabsTrigger key={facet} value={facet} className="font-sans text-xs">
                  {formatFacetLabel(facet)}
                  {voiceBreakdown ? (
                    <span className="ml-1.5 text-[10px] tabular-nums text-muted-foreground">
                      · {count}
                    </span>
                  ) : null}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full min-w-0 justify-between border-stone-200 bg-white px-3 py-2 font-sans text-xs sm:w-56"
              disabled={isCourseLoading || availableCourses.length === 0}
            >
              <span className="truncate text-stone-700">{courseLabel}</span>
              <ChevronDown className="size-3.5 text-stone-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
          >
            <DropdownMenuRadioGroup value={courseId || "ALL"} onValueChange={onCourseChange}>
              <DropdownMenuRadioItem value="ALL" className="font-sans text-sm">
                All courses
              </DropdownMenuRadioItem>
              {availableCourses.map((course) => (
                <DropdownMenuRadioItem
                  key={course.id}
                  value={course.id}
                  className="font-sans text-sm"
                >
                  {course.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="brand"
          size="sm"
          className="w-full px-4 py-2 font-sans text-xs sm:w-auto"
          onClick={onExport}
        >
          Export PDF
        </Button>
      </div>
    </nav>
  );
}
