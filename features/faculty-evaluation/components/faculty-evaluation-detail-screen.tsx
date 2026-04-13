"use client";

import { useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { FacultyEvaluationForm } from "@/features/faculty-evaluation/components/faculty-evaluation-form";
import { FacultyEvaluationPageShell } from "@/features/faculty-evaluation/components/faculty-evaluation-page-shell";
import { useFacultyEvaluationDetail } from "@/features/faculty-evaluation/hooks/use-faculty-evaluation-detail";
import type { FacultyEvaluationRoleContext } from "@/features/faculty-evaluation/types";
import { formatDateTime } from "@/lib/date";

type FacultyEvaluationDetailScreenProps = {
  role: FacultyEvaluationRoleContext;
  facultyId: string;
};

function getSelectedQuestionnaireTypeName(
  detailResult: ReturnType<typeof useFacultyEvaluationDetail>,
  selectedTypeId: string | null
) {
  if (detailResult.status === "ready") {
    return detailResult.data.selectedType.name;
  }

  if (!selectedTypeId) {
    return undefined;
  }

  return detailResult.availableTypes.find((type) => type.id === selectedTypeId)?.name;
}

export function FacultyEvaluationDetailScreen({
  role,
  facultyId,
}: FacultyEvaluationDetailScreenProps) {
  const searchParams = useSearchParams();
  const facultyName = searchParams.get("facultyName") ?? "";
  const semesterId = searchParams.get("semesterId") ?? "";
  const semesterLabel = searchParams.get("semesterLabel") ?? "Selected semester";
  const selectedTypeId = searchParams.get("typeId");

  const detailResult = useFacultyEvaluationDetail({
    facultyId,
    facultyName,
    semesterId,
    selectedTypeId,
  });
  const returnHref = semesterId
    ? `${role.rolePath}/evaluation?semesterId=${semesterId}`
    : `${role.rolePath}/evaluation`;
  const selectedTypeName = getSelectedQuestionnaireTypeName(detailResult, selectedTypeId);

  if (detailResult.status === "ready") {
    return (
      <FacultyEvaluationForm
        role={role}
        semesterLabel={semesterLabel}
        returnHref={returnHref}
        data={detailResult.data}
      />
    );
  }

  return (
    <FacultyEvaluationPageShell
      role={role}
      facultyName={facultyName || undefined}
      semesterLabel={semesterLabel}
      questionnaireTypeName={selectedTypeName}
      backHref={returnHref}
    >
      <div className="mt-8 rounded-lg border border-dashed p-6 text-sm">
        {detailResult.status === "already-submitted" ? (
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <p className="font-medium text-foreground">Evaluation already submitted.</p>
            {detailResult.submittedAt ? (
              <Badge variant="secondary">
                Submitted {formatDateTime(detailResult.submittedAt)}
              </Badge>
            ) : null}
          </div>
        ) : (
          <p
            className={
              detailResult.status === "error" ? "text-destructive" : "text-muted-foreground"
            }
          >
            {detailResult.message}
          </p>
        )}
      </div>
    </FacultyEvaluationPageShell>
  );
}
