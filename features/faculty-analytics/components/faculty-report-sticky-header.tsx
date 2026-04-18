"use client";

import { ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type FacultyReportStickyHeaderProps = {
  show: boolean;
  facultyName: string;
  profilePicture?: string | null;
  courseId: string;
  courseLabel: string;
  availableCourses: Array<{ id: string; label: string }>;
  isCourseLoading: boolean;
  onCourseChange: (value: string) => void;
  onExport?: () => void;
};

function getInitials(fullName: string) {
  return (
    fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "F"
  );
}

export function FacultyReportStickyHeader({
  show,
  facultyName,
  profilePicture,
  courseId,
  courseLabel,
  availableCourses,
  isCourseLoading,
  onCourseChange,
  onExport,
}: FacultyReportStickyHeaderProps) {
  return (
    <div
      aria-hidden={!show}
      className={cn(
        "sticky top-0 z-20 -mx-1 border-b border-border/40 px-4 py-2.5 md:-mx-8 md:px-8",
        "bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/75",
        "transition-all duration-200 ease-in-out",
        show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar size="sm" className="shrink-0 border border-border/70">
            {profilePicture ? (
              <AvatarImage src={profilePicture} alt={facultyName} />
            ) : null}
            <AvatarFallback className="bg-slate-100 text-[0.65rem] font-semibold text-slate-700">
              {getInitials(facultyName)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate font-playfair text-sm font-semibold leading-tight text-foreground sm:text-base">
            {facultyName}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="hidden min-w-0 justify-between px-3 py-2 font-sans text-sm sm:flex sm:w-44"
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
              className="px-3 py-2 font-sans text-sm"
              onClick={onExport}
            >
              Export PDF
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
