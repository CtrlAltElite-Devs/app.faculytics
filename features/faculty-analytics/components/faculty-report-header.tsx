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

type FacultyReportHeaderProps = {
  backHref: string;
  questionnaireTypeLabel: string;
  questionnaireTypeCode: string;
  courseId: string;
  courseLabel: string;
  availableQuestionnaireTypes: Array<{
    code: string;
    label: string;
  }>;
  availableCourses: Array<{
    id: string;
    label: string;
  }>;
  isQuestionnaireTypeLoading: boolean;
  isCourseLoading: boolean;
  onQuestionnaireTypeChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onExport: () => void;
};

export function FacultyReportHeader({
  backHref,
  questionnaireTypeLabel,
  questionnaireTypeCode,
  courseId,
  courseLabel,
  availableQuestionnaireTypes,
  availableCourses,
  isQuestionnaireTypeLoading,
  isCourseLoading,
  onQuestionnaireTypeChange,
  onCourseChange,
  onExport,
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full min-w-0 justify-between border-stone-200 bg-white px-3 py-2 font-sans text-xs sm:w-56"
              disabled={isQuestionnaireTypeLoading || availableQuestionnaireTypes.length === 0}
            >
              <span className="truncate text-stone-700">{questionnaireTypeLabel}</span>
              <ChevronDown className="size-3.5 text-stone-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
          >
            <DropdownMenuRadioGroup
              value={questionnaireTypeCode}
              onValueChange={onQuestionnaireTypeChange}
            >
              {availableQuestionnaireTypes.map((type) => (
                <DropdownMenuRadioItem
                  key={type.code}
                  value={type.code}
                  className="font-sans text-sm"
                >
                  {type.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

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
