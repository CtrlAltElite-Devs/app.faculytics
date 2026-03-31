import { CircleDot } from "lucide-react";

import type { DeanEvaluationFacultyRow } from "./mock-faculty-data";

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

type FacultyListProps = {
  facultyRows: DeanEvaluationFacultyRow[];
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

function getStatusClassName(statusTone: DeanEvaluationFacultyRow["statusTone"]) {
  return statusTone === "ready"
    ? "border-emerald-500/30 text-emerald-600"
    : "border-amber-500/30 text-amber-600";
}

export function FacultyList({ facultyRows }: FacultyListProps) {
  return (
    <div className="data-table-wrapper">
      <Table>
        <TableHeader className="data-table-header">
          <TableRow>
            <TableHead className="data-table-head w-[28%]">Faculty</TableHead>
            <TableHead className="data-table-head w-[24%]">Department</TableHead>
            <TableHead className="data-table-head w-[28%]">Subjects</TableHead>
            <TableHead className="data-table-head w-[10%]">Status</TableHead>
            <TableHead className="data-table-head w-[10%] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facultyRows.map((faculty) => (
            <TableRow key={faculty.id} className="data-table-row">
              <TableCell className="data-table-cell">
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    {faculty.profilePicture ? (
                      <AvatarImage src={faculty.profilePicture} alt={faculty.fullName} />
                    ) : null}
                    <AvatarFallback>{getInitials(faculty.fullName)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{faculty.fullName}</span>
                </div>
              </TableCell>
              <TableCell className="data-table-cell text-muted-foreground whitespace-normal">
                {faculty.departmentName ?? "Department pending"}
              </TableCell>
              <TableCell className="data-table-cell text-muted-foreground whitespace-normal">
                {faculty.subjects.length
                  ? faculty.subjects.join(", ")
                  : "Faculty subjects will appear once live data is available."}
              </TableCell>
              <TableCell className="data-table-cell">
                <Badge variant="outline" className={getStatusClassName(faculty.statusTone)}>
                  <CircleDot className="size-3.5" />
                  {faculty.statusLabel}
                </Badge>
              </TableCell>
              <TableCell className="data-table-cell text-right">
                <Button variant="outline" disabled>
                  Evaluate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
