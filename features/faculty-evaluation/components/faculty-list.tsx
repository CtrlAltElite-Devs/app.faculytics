import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EvaluateActionMenu } from "@/features/faculty-evaluation/components/evaluate-action-menu";
import type {
  FacultyEvaluationRoleContext,
  FacultyEvaluationRow,
} from "@/features/faculty-evaluation/types";
import type { QuestionnaireTypeSummary } from "@/features/questionnaires/types";

type FacultyListProps = {
  facultyRows: FacultyEvaluationRow[];
  role: FacultyEvaluationRoleContext;
  semesterId: string;
  semesterLabel: string;
  questionnaireTypes: QuestionnaireTypeSummary[];
  typesLoading?: boolean;
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

export function FacultyList({
  facultyRows,
  role,
  semesterId,
  semesterLabel,
  questionnaireTypes,
  typesLoading = false,
}: FacultyListProps) {
  return (
    <div className="data-table-wrapper">
      <Table>
        <TableHeader className="data-table-header">
          <TableRow>
            <TableHead className="data-table-head w-[30%]">Faculty</TableHead>
            <TableHead className="data-table-head w-[50%]">Subjects</TableHead>
            <TableHead className="data-table-head w-[20%] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facultyRows.map((faculty) => {
            return (
              <TableRow key={faculty.id} className="data-table-row">
                <TableCell className="data-table-cell">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm">
                      {faculty.profilePicture ? (
                        <AvatarImage src={faculty.profilePicture} alt={faculty.fullName} />
                      ) : null}
                      <AvatarFallback>{getInitials(faculty.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <span className="block truncate font-medium">{faculty.fullName}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="data-table-cell text-muted-foreground whitespace-normal">
                  {faculty.subjects.length
                    ? faculty.subjects.join(", ")
                    : "Faculty subjects will appear once scoped teaching assignments are available."}
                </TableCell>
                <TableCell className="data-table-cell text-right">
                  <EvaluateActionMenu
                    facultyId={faculty.id}
                    facultyName={faculty.fullName}
                    semesterId={semesterId}
                    semesterLabel={semesterLabel}
                    role={role}
                    questionnaireTypes={questionnaireTypes}
                    disabled={typesLoading}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
