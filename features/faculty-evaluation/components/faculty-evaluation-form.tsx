"use client";

import { useCallback, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionnaireFormRenderer } from "@/features/questionnaires/components/form/questionnaire-form-renderer";
import { QuestionnaireRatingScaleInstructions } from "@/features/questionnaires/components/questionnaire-rating-scale-instructions";
import { useMe } from "@/features/auth/hooks/use-me";
import { FacultyEvaluationPageShell } from "@/features/faculty-evaluation/components/faculty-evaluation-page-shell";
import { useRoleSubmitFacultyEvaluation } from "@/features/faculty-evaluation/hooks/use-role-submit-faculty-evaluation";
import { useAutoSaveDraft } from "@/features/questionnaires/hooks/use-save-draft";
import { collectRequiredIds } from "@/features/questionnaires/lib/evaluation-validation";
import type {
  FacultyEvaluationReadyData,
  FacultyEvaluationRoleContext,
} from "@/features/faculty-evaluation/types";
import type { QuestionnaireFormValues } from "@/features/questionnaires/types";

type FacultyEvaluationFormProps = {
  role: FacultyEvaluationRoleContext;
  semesterLabel: string;
  returnHref: string;
  data: FacultyEvaluationReadyData;
};

export function FacultyEvaluationForm({
  role,
  semesterLabel,
  returnHref,
  data,
}: FacultyEvaluationFormProps) {
  const formValuesRef = useRef<QuestionnaireFormValues | null>(null);
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const meQuery = useMe();
  const { mutate, isPending, invalidateAndNavigate } = useRoleSubmitFacultyEvaluation(returnHref);

  const { debouncedSave, cancel: cancelAutoSave } = useAutoSaveDraft({
    versionId: data.activeVersion.id,
    facultyId: data.facultyId,
    semesterId: data.semesterId,
    onStatusChange: setDraftStatus,
  });

  const handleChange = useCallback(
    (values: QuestionnaireFormValues) => {
      formValuesRef.current = values;
      debouncedSave(values);
    },
    [debouncedSave]
  );

  const handleSubmit = useCallback(() => {
    const values = formValuesRef.current;
    if (!values) return;

    const respondentId = meQuery.data?.id;
    if (!respondentId) {
      toast.error("Unable to identify your account. Please try again.");
      return;
    }

    const requiredIds = data.model.sections.flatMap(collectRequiredIds);
    const unanswered = requiredIds.filter((id) => !(id in values.answers));

    if (unanswered.length > 0) {
      toast.error(`Please answer all required questions. ${unanswered.length} remaining.`);
      return;
    }

    if (
      data.model.qualitative.enabled &&
      data.model.qualitative.required &&
      !values.qualitativeComment.trim()
    ) {
      toast.error("Please provide your comments before submitting.");
      return;
    }

    cancelAutoSave();

    // TODO: Remove `respondentId` once the backend derives final submission identity from JWT.
    mutate(
      {
        versionId: data.activeVersion.id,
        respondentId,
        facultyId: data.facultyId,
        semesterId: data.semesterId,
        answers: values.answers,
        qualitativeComment: values.qualitativeComment || undefined,
      },
      {
        onSuccess: () => setShowSuccessDialog(true),
      }
    );
  }, [cancelAutoSave, data, meQuery.data?.id, mutate]);

  return (
    <FacultyEvaluationPageShell
      role={role}
      facultyName={data.facultyName}
      semesterLabel={semesterLabel}
      questionnaireTypeName={data.selectedType.name}
      backHref={returnHref}
    >
      <div className="mt-8">
        <QuestionnaireRatingScaleInstructions />
      </div>

      <div className="mt-8">
        <QuestionnaireFormRenderer
          key={`${data.selectedTypeId}:${data.draftHydrationKey}`}
          model={data.model}
          mode="interactive"
          defaultValues={data.defaultValues}
          onChange={handleChange}
          facultyName={data.facultyName}
          progressTrailing={
            draftStatus !== "idle" ? (
              <Badge
                variant="ghost"
                className={
                  draftStatus === "error"
                    ? "badge-status-deprecated"
                    : draftStatus === "saved"
                      ? "badge-status-active"
                      : "badge-status-draft"
                }
              >
                {draftStatus === "saving" && "Saving draft..."}
                {draftStatus === "saved" && "Draft saved"}
                {draftStatus === "error" && "Draft save failed"}
              </Badge>
            ) : null
          }
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <Button variant="brand" onClick={handleSubmit} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Evaluation"
          )}
        </Button>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent
          className="text-center sm:max-w-md"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader className="items-center">
            <CheckCircle2 className="size-12 text-green-500" />
            <DialogTitle className="font-playfair text-xl">Evaluation Submitted</DialogTitle>
            <DialogDescription className="text-center">
              Your evaluation has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button variant="brand" onClick={invalidateAndNavigate}>
              Back to Evaluation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FacultyEvaluationPageShell>
  );
}
