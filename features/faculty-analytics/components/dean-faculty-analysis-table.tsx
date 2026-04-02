"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { FacultySubjects } from "@/features/faculty-analytics/components/faculty-subjects";
import type { DeanFacultyAnalysisRecord } from "@/features/faculty-analytics/lib/analytics-sample-data";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const rowsPerPageOptions = [5, 10, 20, 50] as const;

export function DeanFacultyAnalysisTable({
  facultyAnalysis,
}: {
  facultyAnalysis: readonly DeanFacultyAnalysisRecord[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);
  const totalRows = facultyAnalysis.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const paginatedRows = paginateArray(facultyAnalysis, currentPage, rowsPerPage);
  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Faculty Analytics
        </h2>
        <p className="mt-5 font-sans text-sm text-muted-foreground">
          Browse faculty-level analytics and open individual analysis views.
        </p>
      </div>
      <div className="data-table-wrapper">
        <Table className="w-full table-fixed [&_td]:whitespace-normal [&_th]:whitespace-normal">
          <TableHeader className="data-table-header">
            <TableRow>
              <TableHead className="data-table-head w-[24%] px-2 text-[11px] md:px-3 md:text-xs lg:px-5">
                Faculty
              </TableHead>
              <TableHead className="data-table-head w-[28%] px-2 text-[11px] md:px-3 md:text-xs lg:px-5">
                Subjects
              </TableHead>
              <TableHead className="data-table-head w-[18%] px-2 text-[11px] md:px-3 md:text-xs lg:px-5">
                Overall Positive Rate
              </TableHead>
              <TableHead className="data-table-head w-[12%] px-2 text-[11px] md:px-3 md:text-xs lg:px-5">
                Responses
              </TableHead>
              <TableHead className="data-table-head w-[18%] px-2 text-right text-[11px] md:px-3 md:text-xs lg:px-5">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b-0">
            {paginatedRows.map((faculty) => (
              <TableRow key={faculty.facultyName} className="data-table-row">
                <TableCell className="data-table-cell px-2 md:px-3 lg:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar size="default" className="hidden border border-border/70 xl:flex">
                      <AvatarFallback className="bg-slate-100 font-sans text-xs font-semibold text-slate-700">
                        {faculty.facultyInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate font-sans text-xs font-semibold text-foreground md:text-sm">
                      {faculty.facultyName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="data-table-cell px-2 md:px-3 lg:px-5">
                  <div className="min-w-0">
                    <FacultySubjects subjects={faculty.subjects} />
                  </div>
                </TableCell>
                <TableCell className="data-table-cell px-2 font-medium text-foreground md:px-3 lg:px-5">
                  {faculty.overallPositiveRate}
                </TableCell>
                <TableCell className="data-table-cell px-2 font-medium text-foreground md:px-3 lg:px-5">
                  {faculty.responses}
                </TableCell>
                <TableCell className="data-table-cell px-2 text-right md:px-3 lg:px-5">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-auto max-w-full px-1 py-2 font-sans text-brand-blue hover:text-brand-blue md:px-2 xl:px-3"
                  >
                    <Link href={`/dean/faculties/${faculty.facultySlug}/analysis`}>
                      <span className="md:hidden">View</span>
                      <span className="hidden md:inline xl:hidden">Details</span>
                      <span className="hidden xl:inline">View Analysis</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={currentPage === 1}
                    tabIndex={currentPage === 1 ? -1 : undefined}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage((page) => Math.max(page - 1, 1));
                      }
                    }}
                  />
                </PaginationItem>
                {paginationItems.map((item, index) =>
                  item === "..." ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={item === currentPage}
                        aria-disabled={item === currentPage}
                        tabIndex={item === currentPage ? -1 : undefined}
                        className={item === currentPage ? "pointer-events-none" : undefined}
                        onClick={(event) => {
                          event.preventDefault();
                          setCurrentPage(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={currentPage === totalPages}
                    tabIndex={currentPage === totalPages ? -1 : undefined}
                    className={
                      currentPage === totalPages ? "pointer-events-none opacity-50" : undefined
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage((page) => Math.min(page + 1, totalPages));
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
