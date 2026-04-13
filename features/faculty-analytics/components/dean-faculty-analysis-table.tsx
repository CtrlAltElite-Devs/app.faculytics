"use client";

import Link from "next/link";

import { PaginationFooter } from "@/components/shared/pagination-footer";
import { FacultySubjects } from "@/features/faculty-analytics/components/faculty-subjects";
import { buildDeanFacultyAnalysisHref } from "@/features/faculty-analytics/lib/faculty-analysis-routes";
import type { FacultyListItemDto, PaginationMetaDto } from "@/features/faculty-analytics/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  selectedSemesterId: string;
  selectedSemesterLabel: string;
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
  selectedSemesterId,
  selectedSemesterLabel,
  onPageChange,
  onRowsPerPageChange,
}: DeanFacultyAnalysisTableProps) {
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
                      {faculty.profilePicture ? (
                        <AvatarImage src={faculty.profilePicture} alt={faculty.fullName} />
                      ) : null}
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
                    asChild
                    variant="secondary"
                    size="sm"
                    className="h-auto max-w-full px-3 py-2 font-sans"
                  >
                    <Link
                      href={buildDeanFacultyAnalysisHref({
                        facultyId: faculty.id,
                        facultyName: faculty.fullName,
                        semesterId: selectedSemesterId,
                        semesterLabel: selectedSemesterLabel,
                      })}
                    >
                      View Analysis
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationFooter
        itemCount={pagination.itemCount}
        totalItems={pagination.totalItems}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        itemLabel="faculty records"
        rowsPerPage={pagination.itemsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        onPageChange={onPageChange}
      />
    </div>
  );
}
