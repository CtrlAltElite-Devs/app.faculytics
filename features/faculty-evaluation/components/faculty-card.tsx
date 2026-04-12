import { BookOpenText } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { EvaluateActionMenu } from "@/features/faculty-evaluation/components/evaluate-action-menu";
import type {
  FacultyEvaluationRoleContext,
  FacultyEvaluationRow,
} from "@/features/faculty-evaluation/types";
import type { QuestionnaireTypeSummary } from "@/features/questionnaires/types";

type FacultyCardProps = {
  faculty: FacultyEvaluationRow;
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

export function FacultyCard({
  faculty,
  role,
  semesterId,
  semesterLabel,
  questionnaireTypes,
  typesLoading = false,
}: FacultyCardProps) {
  return (
    <Card className="h-full gap-0 overflow-hidden py-0">
      <CardContent className="flex h-full flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Avatar className="size-11 border border-border/70">
            {faculty.profilePicture ? (
              <AvatarImage src={faculty.profilePicture} alt={faculty.fullName} />
            ) : null}
            <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
              {getInitials(faculty.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <h2 className="font-playfair text-xl font-semibold leading-tight text-foreground">
              {faculty.fullName}
            </h2>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2.5">
            <BookOpenText className="mt-0.5 size-4 shrink-0" />
            <p className="line-clamp-2">
              {faculty.subjects.length
                ? faculty.subjects.join(", ")
                : "Faculty subjects will appear once scoped teaching assignments are available."}
            </p>
          </div>
        </div>

        <EvaluateActionMenu
          facultyId={faculty.id}
          facultyName={faculty.fullName}
          semesterId={semesterId}
          semesterLabel={semesterLabel}
          role={role}
          questionnaireTypes={questionnaireTypes}
          disabled={typesLoading}
          className="mt-auto w-full"
        />
      </CardContent>
    </Card>
  );
}
