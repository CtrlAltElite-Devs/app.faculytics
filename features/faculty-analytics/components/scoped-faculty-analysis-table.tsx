"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { PaginationFooter } from "@/components/shared/pagination-footer";
import { APP_ROLES } from "@/constants/roles";
import { useMe } from "@/features/auth/hooks/use-me";
import { FacultySubjects } from "@/features/faculty-analytics/components/faculty-subjects";
import {
  buildFacultySelfAnalysisHref,
  buildScopedFacultyAnalysisHref,
} from "@/features/faculty-analytics/lib/faculty-analysis-routes";
import type { FacultyListItemDto, PaginationMetaDto } from "@/features/faculty-analytics/types";
import { useAuthStore } from "@/stores/auth-store";
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

type ScopedFacultyAnalysisTableProps = {
  facultyList: readonly FacultyListItemDto[];
  pagination: PaginationMetaDto;
  selectedSemesterId: string;
  selectedSemesterLabel: string;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  scopeLabel: "Campus" | "Department" | "Program";
};

type FacultyAnalysisActionLinkOptions = {
  facultyId: string;
  facultyName: string;
  selectedSemesterId: string;
  selectedSemesterLabel: string;
  scopeLabel: ScopedFacultyAnalysisTableProps["scopeLabel"];
  currentUserId?: string;
};

function getFacultyInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function resolveFacultyAnalysisHref({
  facultyId,
  facultyName,
  selectedSemesterId,
  selectedSemesterLabel,
  scopeLabel,
  currentUserId,
}: FacultyAnalysisActionLinkOptions) {
  const isCurrentUser = scopeLabel === "Program" && currentUserId === facultyId;

  return {
    isCurrentUser,
    href: isCurrentUser
      ? buildFacultySelfAnalysisHref({
          semesterId: selectedSemesterId,
          semesterLabel: selectedSemesterLabel,
        })
      : buildScopedFacultyAnalysisHref({
          facultyId,
          facultyName,
          semesterId: selectedSemesterId,
          semesterLabel: selectedSemesterLabel,
          scopeLabel,
        }),
  };
}

export function ScopedFacultyAnalysisTable({
  facultyList,
  pagination,
  selectedSemesterId,
  selectedSemesterLabel,
  onPageChange,
  onRowsPerPageChange,
  scopeLabel,
}: ScopedFacultyAnalysisTableProps) {
  const router = useRouter();
  const meQuery = useMe();
  const setActiveRole = useAuthStore((state) => state.setActiveRole);
  const setPendingRedirectPath = useAuthStore((state) => state.setPendingRedirectPath);
  const actionButtonClassName =
    "h-auto px-2 py-2 text-center font-sans text-xs leading-none md:px-3 md:text-sm";

  return (
    <div className="space-y-5">
      <div className="data-table-wrapper">
        <Table className="w-full table-fixed [&_td]:whitespace-normal [&_th]:whitespace-normal">
          <TableHeader className="data-table-header">
            <TableRow>
              <TableHead className="data-table-head w-[28%] px-2 text-[11px] md:px-3 md:text-xs lg:px-5">
                Faculty
              </TableHead>
              <TableHead className="data-table-head w-[52%] px-2 text-[11px] md:w-[54%] md:px-3 md:text-xs lg:px-5">
                Subjects
              </TableHead>
              <TableHead className="data-table-head w-[20%] px-2 text-right text-[11px] md:w-[18%] md:px-3 md:text-xs lg:px-5">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b-0">
            {facultyList.map((faculty) => {
              const { isCurrentUser, href } = resolveFacultyAnalysisHref({
                facultyId: faculty.id,
                facultyName: faculty.fullName,
                selectedSemesterId,
                selectedSemesterLabel,
                scopeLabel,
                currentUserId: meQuery.data?.id,
              });

              return (
                <TableRow key={faculty.id} className="data-table-row w-full">
                  <TableCell className="data-table-cell px-2 md:px-3 lg:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar size="default" className="border border-border/70">
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
                    {isCurrentUser ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className={actionButtonClassName}
                        onClick={() => {
                          setPendingRedirectPath("/faculty/analytics");
                          setActiveRole(APP_ROLES.FACULTY);
                          router.push(href);
                        }}
                      >
                        <span className="sm:hidden">View</span>
                        <span className="hidden sm:inline">View Analysis</span>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className={actionButtonClassName}
                      >
                        <Link href={href} className="text-center leading-none">
                          <span className="sm:hidden">View</span>
                          <span className="hidden sm:inline">View Analysis</span>
                        </Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
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
