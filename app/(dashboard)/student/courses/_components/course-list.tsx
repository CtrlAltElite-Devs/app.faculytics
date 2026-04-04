import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import type { EnrollmentResponseDto } from "@/features/enrollments/types";
import { decodeHtmlEntities } from "@/lib/string";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CourseListProps = {
  enrollments: EnrollmentResponseDto[];
  onSelectCourse: (enrollment: EnrollmentResponseDto) => void;
};

function getInstructorMeta(enrollment: EnrollmentResponseDto) {
  const instructorName = decodeHtmlEntities(enrollment.faculty?.fullName ?? "Teacher unavailable");
  const instructorInitials =
    instructorName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "T";

  return {
    instructorName,
    instructorInitials,
    instructorImageSrc: enrollment.faculty?.profilePicture,
  };
}

export function CourseList({ enrollments, onSelectCourse }: CourseListProps) {
  return (
    <div className="data-table-wrapper">
      <Table>
        <TableHeader className="data-table-header">
          <TableRow>
            <TableHead className="data-table-head w-[15%]">Code</TableHead>
            <TableHead className="data-table-head w-[30%]">Course</TableHead>
            <TableHead className="data-table-head w-[20%]">Instructor</TableHead>
            <TableHead className="data-table-head w-[15%]">Section</TableHead>
            <TableHead className="data-table-head w-[10%]">Status</TableHead>
            <TableHead className="data-table-head w-[10%] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => {
            const courseShortname = decodeHtmlEntities(enrollment.course.shortname);
            const courseFullname = decodeHtmlEntities(enrollment.course.fullname);
            const sectionName = enrollment.section?.name
              ? decodeHtmlEntities(enrollment.section.name)
              : "N/A";
            const { instructorName, instructorInitials, instructorImageSrc } =
              getInstructorMeta(enrollment);

            return (
              <TableRow key={enrollment.id} className="data-table-row">
                <TableCell className="data-table-cell">
                  <Badge className="rounded-md bg-brand-blue/25 px-2 py-1 text-sm font-medium text-brand-blue hover:bg-brand-blue/25">
                    {courseShortname}
                  </Badge>
                </TableCell>
                <TableCell className="data-table-cell font-medium whitespace-normal">
                  {courseFullname}
                </TableCell>
                <TableCell className="data-table-cell text-muted-foreground whitespace-normal">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm">
                      {instructorImageSrc ? (
                        <AvatarImage src={instructorImageSrc} alt={instructorName} />
                      ) : null}
                      <AvatarFallback>{instructorInitials}</AvatarFallback>
                    </Avatar>
                    <span>{instructorName}</span>
                  </div>
                </TableCell>
                <TableCell className="data-table-cell text-muted-foreground whitespace-normal">
                  {sectionName}
                </TableCell>
                <TableCell className="data-table-cell">
                  {enrollment.submission?.submitted ? (
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                      Submitted
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="data-table-cell text-right">
                  {enrollment.submission?.submitted ? (
                    <Button variant="outline" disabled>
                      <CheckCircle2 className="size-4" />
                      Submitted
                    </Button>
                  ) : (
                    <Button asChild variant="brand">
                      <Link
                        href={`/student/courses/${enrollment.course.id}/evaluation`}
                        onClick={() => onSelectCourse(enrollment)}
                      >
                        Give Feedback
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
  );
}
