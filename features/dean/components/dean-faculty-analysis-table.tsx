"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { deanAnalyticsSampleData } from "@/features/dean/lib/analytics-sample-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/lib/use-mobile";

const chipGap = 8;
const rowsPerPageOptions = [5, 10, 20, 50] as const;

const subjectChipClassName =
  "max-w-32 rounded-full border-brand-blue/30 bg-brand-blue/10 px-2.5 py-1 font-sans text-[11px] text-brand-blue";

const overflowChipClassName =
  "cursor-default rounded-full border-brand-blue/20 bg-brand-blue/8 px-2.5 py-1 font-sans text-[11px] text-brand-blue";

function FacultySubjects({ subjects }: { subjects: readonly string[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const subjectMeasureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const moreMeasureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [visibleCount, setVisibleCount] = useState(subjects.length);

  useEffect(() => {
    const calculateVisibleCount = () => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;

      if (!containerWidth) {
        setVisibleCount(subjects.length);
        return;
      }

      const subjectWidths = subjects.map(
        (_, index) => subjectMeasureRefs.current[index]?.offsetWidth ?? 0,
      );
      const moreWidths = subjects.slice(1).map(
        (_, index) => moreMeasureRefs.current[index]?.offsetWidth ?? 0,
      );

      let usedWidth = 0;
      let fittedCount = subjects.length;

      for (let index = 0; index < subjects.length; index += 1) {
        const nextChipWidth = subjectWidths[index] ?? 0;
        const nextUsedWidth = usedWidth + (index > 0 ? chipGap : 0) + nextChipWidth;
        const hiddenCount = subjects.length - (index + 1);
        const reservedMoreWidth = hiddenCount > 0 ? (moreWidths[hiddenCount - 1] ?? 0) + chipGap : 0;

        if (nextUsedWidth + reservedMoreWidth > containerWidth) {
          fittedCount = index;
          break;
        }

        usedWidth = nextUsedWidth;
      }

      setVisibleCount(Math.max(fittedCount, 0));
    };

    calculateVisibleCount();

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleCount();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [subjects]);

  const visibleSubjects = subjects.slice(0, visibleCount);
  const hiddenSubjects = subjects.slice(visibleCount);
  const hiddenSubjectCount = hiddenSubjects.length;

  return (
    <TooltipProvider>
      <>
        <div aria-hidden="true" className="pointer-events-none absolute -z-10 opacity-0">
          <div className="flex gap-2">
            {subjects.map((subject, index) => (
              <Badge
                key={`measure-${subject}`}
                ref={(node) => {
                  subjectMeasureRefs.current[index] = node;
                }}
                variant="outline"
                className={subjectChipClassName}
              >
                {subject}
              </Badge>
            ))}
            {subjects.slice(1).map((_, index) => {
              const count = index + 1;

              return (
                <Badge
                  key={`measure-more-${count}`}
                  ref={(node) => {
                    moreMeasureRefs.current[index] = node;
                  }}
                  variant="outline"
                  className={overflowChipClassName}
                >
                  + {count} more
                </Badge>
              );
            })}
          </div>
        </div>
        <div ref={containerRef} className="flex flex-nowrap items-center gap-2 overflow-hidden">
          {visibleSubjects.map((subject) => (
            <Badge
              key={subject}
              variant="outline"
              className={subjectChipClassName}
            >
              <span className="truncate">{subject}</span>
            </Badge>
          ))}
          {hiddenSubjectCount > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={overflowChipClassName}
                >
                  + {hiddenSubjectCount} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-56 font-sans text-xs">
                <div className="flex flex-col gap-1">
                  {hiddenSubjects.map((subject) => (
                    <span key={subject}>{subject}</span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </>
    </TooltipProvider>
  );
}

export function DeanFacultyAnalysisTable() {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);
  const totalRows = deanAnalyticsSampleData.facultyAnalysis.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedRows = deanAnalyticsSampleData.facultyAnalysis.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Faculty Analysis
        </h2>
        <p className="mt-5 font-sans text-sm text-muted-foreground">
          Review faculty-specific subject coverage and jump directly to individual analysis.
        </p>
      </div>
      <Card className="m-0 gap-0 overflow-hidden rounded-2xl border-border/70 p-0 shadow-sm">
        <CardContent className="p-0">
          {isMobile ? (
            <div className="divide-y divide-border/70">
              {paginatedRows.map((faculty) => (
                <div key={faculty.facultyName} className="space-y-4 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar size="default" className="border border-border/70">
                      <AvatarFallback className="bg-slate-100 font-sans text-xs font-semibold text-slate-700">
                        {faculty.facultyInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-semibold text-foreground">
                        {faculty.facultyName}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 font-sans text-sm">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Subjects
                      </p>
                      <FacultySubjects subjects={faculty.subjects} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Positive Rate
                        </p>
                        <p className="font-semibold text-foreground">
                          {faculty.overallPositiveRate}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Responses
                        </p>
                        <p className="font-semibold text-foreground">{faculty.responses}</p>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full font-sans text-brand-blue hover:text-brand-blue"
                    >
                      <Link href={`/dean/faculties/${faculty.facultySlug}/analysis`}>
                        View Analysis
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table className="w-full table-fixed [&_td]:whitespace-normal [&_th]:whitespace-normal">
              <TableHeader>
                <TableRow className="border-border/70 bg-muted/60 hover:bg-muted/60">
                  <TableHead className="w-[24%] px-4 py-4 font-sans text-xs font-semibold text-muted-foreground lg:px-5">
                    Faculty
                  </TableHead>
                  <TableHead className="w-[32%] px-4 py-4 font-sans text-xs font-semibold text-muted-foreground lg:px-5">
                    Subjects
                  </TableHead>
                  <TableHead className="w-[16%] px-4 py-4 font-sans text-xs font-semibold text-muted-foreground lg:px-5">
                    Overall Positive Rate
                  </TableHead>
                  <TableHead className="w-[10%] px-4 py-4 font-sans text-xs font-semibold text-muted-foreground lg:px-5">
                    Responses
                  </TableHead>
                  <TableHead className="w-[18%] px-4 py-4 text-right font-sans text-xs font-semibold text-muted-foreground lg:px-5">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-b-0">
                {paginatedRows.map((faculty) => (
                  <TableRow key={faculty.facultyName} className="border-border/70">
                    <TableCell className="px-4 py-4 lg:px-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar size="default" className="border border-border/70">
                          <AvatarFallback className="bg-slate-100 font-sans text-xs font-semibold text-slate-700">
                            {faculty.facultyInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate font-sans text-sm font-semibold text-foreground">
                          {faculty.facultyName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 lg:px-5">
                      <FacultySubjects subjects={faculty.subjects} />
                    </TableCell>
                    <TableCell className="px-4 py-4 font-sans text-sm font-semibold text-foreground lg:px-5">
                      {faculty.overallPositiveRate}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-sans text-sm font-semibold text-foreground lg:px-5">
                      {faculty.responses}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right lg:px-5">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-auto max-w-full whitespace-nowrap px-3 py-2 font-sans text-brand-blue hover:text-brand-blue"
                      >
                        <Link href={`/dean/faculties/${faculty.facultySlug}/analysis`}>
                          View Analysis
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3 pt-4 font-sans text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="text-xs sm:text-sm">
          Showing {paginatedRows.length} of {totalRows} faculty records
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-6">
          <div className="flex items-center gap-3">
            <span>Rows per page</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-w-16 justify-between font-sans"
                >
                  <span>{rowsPerPage}</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-16">
                <DropdownMenuRadioGroup
                  value={String(rowsPerPage)}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  {rowsPerPageOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option}
                      value={String(option)}
                      className="font-sans text-sm"
                    >
                      {option}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                className="border-border/70"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                className="border-border/70"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
