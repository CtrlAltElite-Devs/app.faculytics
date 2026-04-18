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
  showBackButton?: boolean;
  backHref: string;
  courseId: string;
  courseLabel: string;
  availableCourses: Array<{
    id: string;
    label: string;
  }>;
  isCourseLoading: boolean;
  onCourseChange: (value: string) => void;
  onExport?: () => void;
};

export function FacultyReportHeader({
  showBackButton = true,
  backHref,
  courseId,
  courseLabel,
  availableCourses,
  isCourseLoading,
  onCourseChange,
  onExport,
}: FacultyReportHeaderProps) {
  return (
    <nav
      aria-label="Faculty report controls"
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
    >
      {showBackButton ? (
        <Button
          asChild
          variant="outline"
          className="w-full justify-center px-4 py-2.5 font-sans text-sm sm:w-auto sm:justify-start"
        >
          <Link href={backHref}>Back to faculties</Link>
        </Button>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm sm:w-56"
              disabled={isCourseLoading || availableCourses.length === 0}
            >
              <span className="truncate">{courseLabel}</span>
              <ChevronDown className="size-4" />
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

        {onExport ? (
          <Button
            type="button"
            variant="brand"
            className="w-full px-4 py-2.5 font-sans text-sm sm:w-auto"
            onClick={onExport}
          >
            Export PDF
          </Button>
        ) : null}
      </div>
    </nav>
  );
}
