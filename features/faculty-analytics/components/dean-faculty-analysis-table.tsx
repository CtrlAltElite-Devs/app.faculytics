"use client";

import { ChevronDown } from "lucide-react";

import { FacultySubjects } from "@/features/faculty-analytics/components/faculty-subjects";
import type { FacultyListItemDto, PaginationMetaDto } from "@/features/faculty-analytics/types";
import { DEFAULT_PAGE_SIZE_OPTIONS, getPaginationItems } from "@/lib/pagination";
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

type DeanFacultyAnalysisTableProps = {
  facultyList: readonly FacultyListItemDto[];
  pagination: PaginationMetaDto;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
};

function getFacultyInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DeanFacultyAnalysisTable({
  facultyList,
  pagination,
  onPageChange,
  onRowsPerPageChange,
}: DeanFacultyAnalysisTableProps) {
  const currentPage = pagination.currentPage > 0 ? pagination.currentPage : 1;
  const totalPages = Math.max(pagination.totalPages, 1);
  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <div className="space-y-5">
      <div className="data-table-wrapper">
        <Table className="w-full table-fixed [&_td]:whitespace-normal [&_th]:whitespace-normal">
          <TableHeader className="data-table-header">
            <TableRow>
              <TableHead className="data-table-head w-[28%] px-2 text-[11px] md:px-3 md:text-xs lg:px-5">
                Faculty
              </TableHead>
              <TableHead className="data-table-head w-[54%] px-2 text-[11px] md:px-3 md:text-xs lg:px-5">
                Subjects
              </TableHead>
              <TableHead className="data-table-head w-[18%] px-2 text-right text-[11px] md:px-3 md:text-xs lg:px-5">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b-0">
            {facultyList.map((faculty) => (
              <TableRow key={faculty.id} className="data-table-row w-full">
                <TableCell className="data-table-cell px-2 md:px-3 lg:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar size="default" className="hidden border border-border/70 xl:flex">
                      <AvatarFallback className="bg-slate-100 font-sans text-xs font-semibold text-slate-700">
                        {getFacultyInitials(faculty.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate font-sans text-xs font-semibold text-foreground md:text-sm">
                      {faculty.fullName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="data-table-cell w-0 px-2 md:px-3 lg:px-5">
                  <div className="w-full min-w-0">
                    <FacultySubjects subjects={faculty.subjects} />
                  </div>
                </TableCell>
                <TableCell className="data-table-cell px-2 text-right md:px-3 lg:px-5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled
                    title="Faculty analysis detail is not wired yet."
                    className="h-auto max-w-full px-1 py-2 font-sans text-brand-blue/70 disabled:pointer-events-none disabled:opacity-100 md:px-2 xl:px-3"
                  >
                    <span className="md:hidden">View</span>
                    <span className="hidden md:inline xl:hidden">Details</span>
                    <span className="hidden xl:inline">View Analysis</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 pt-4 font-sans text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="text-xs sm:text-sm">
          Showing {pagination.itemCount} of {pagination.totalItems} faculty records
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
                  <span>{pagination.itemsPerPage}</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-16">
                <DropdownMenuRadioGroup
                  value={String(pagination.itemsPerPage)}
                  onValueChange={(value) => {
                    onRowsPerPageChange(Number(value));
                  }}
                >
                  {DEFAULT_PAGE_SIZE_OPTIONS.map((option) => (
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
                        onPageChange(Math.max(currentPage - 1, 1));
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
                          onPageChange(item);
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
                        onPageChange(Math.min(currentPage + 1, totalPages));
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
