"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { deanAnalyticsSampleData } from "@/features/dean/lib/analytics-sample-data";
import { FacultySubjects } from "@/features/dean/components/faculty-subjects";
import { getPaginationItems, paginateArray } from "@/lib/pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { useIsMobile } from "@/lib/use-mobile";

const rowsPerPageOptions = [5, 10, 20, 50] as const;

export function DeanFacultyAnalysisTable() {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);
  const totalRows = deanAnalyticsSampleData.facultyAnalysis.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const paginatedRows = paginateArray(
    deanAnalyticsSampleData.facultyAnalysis,
    currentPage,
    rowsPerPage
  );
  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Faculty Analysis
        </h2>
        <p className="mt-5 font-sans text-sm text-muted-foreground">
          Review faculty-specific subject coverage and jump directly to individual analysis.
        </p>
      </div>
      <div className="data-table-wrapper">
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
                      <p className="font-semibold text-white">{faculty.overallPositiveRate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Responses
                      </p>
                      <p className="font-semibold text-white">{faculty.responses}</p>
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
            <TableHeader className="data-table-header">
              <TableRow>
                <TableHead className="data-table-head w-[24%]">Faculty</TableHead>
                <TableHead className="data-table-head w-[32%]">Subjects</TableHead>
                <TableHead className="data-table-head w-[16%]">Overall Positive Rate</TableHead>
                <TableHead className="data-table-head w-[10%]">Responses</TableHead>
                <TableHead className="data-table-head w-[18%] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-b-0">
              {paginatedRows.map((faculty) => (
                <TableRow key={faculty.facultyName} className="data-table-row">
                  <TableCell className="data-table-cell">
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
                  <TableCell className="data-table-cell">
                    <FacultySubjects subjects={faculty.subjects} />
                  </TableCell>
                  <TableCell className="data-table-cell font-medium text-white">
                    {faculty.overallPositiveRate}
                  </TableCell>
                  <TableCell className="data-table-cell font-medium text-white">
                    {faculty.responses}
                  </TableCell>
                  <TableCell className="data-table-cell text-right">
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
      </div>
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
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                className="border-border/70 font-sans"
              >
                <ChevronLeft className="size-4" />
                <span className="text-white">Previous</span>
              </Button>
              <div className="flex items-center gap-1">
                {paginationItems.map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 font-sans text-sm text-muted-foreground"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={item}
                      type="button"
                      variant={item === currentPage ? "brand" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(item)}
                      className="min-w-9 border-border/70 px-3 font-sans"
                    >
                      {item}
                    </Button>
                  )
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                className="border-border/70 font-sans"
              >
                <span className="text-white">Next</span>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
