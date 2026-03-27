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
import { useMe } from "@/features/auth/hooks/use-me";
import { QuestionnaireFormRenderer } from "@/features/questionnaires/components/form/questionnaire-form-renderer";
import { QuestionnaireRatingScaleInstructions } from "@/features/questionnaires/components/questionnaire-rating-scale-instructions";
import { useAutoSaveDraft } from "@/features/questionnaires/hooks/use-save-draft";
import { useSubmitEvaluation } from "@/features/questionnaires/hooks/use-submit-evaluation";
import { collectRequiredIds } from "@/features/questionnaires/lib/evaluation-validation";
import type { QuestionnaireFormValues } from "@/features/questionnaires/types";

import { EvaluationPageShell } from "./evaluation-page-shell";

type EvaluationFormProps = {
  courseId: string;
  courseName: string;
  courseShortname: string;
  facultyName: string;
  enrollmentSectionName?: string;
  activeVersion: { id: string };
  faculty: { id: string };
  semester: { id: string };
  model: Parameters<typeof QuestionnaireFormRenderer>[0]["model"];
  defaultValues: Partial<QuestionnaireFormValues> | undefined;
  draftHydrationKey: string;
};

export function EvaluationForm({
  courseId,
  courseName,
  courseShortname,
  facultyName,
  enrollmentSectionName,
  activeVersion,
  faculty,
  semester,
  model,
  defaultValues,
  draftHydrationKey,
}: EvaluationFormProps) {
  const formValuesRef = useRef<QuestionnaireFormValues | null>(null);
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const meQuery = useMe();
  const { mutate, isPending, invalidateAndNavigate } = useSubmitEvaluation();

  const { debouncedSave, cancel: cancelAutoSave } = useAutoSaveDraft({
    versionId: activeVersion.id,
    facultyId: faculty.id,
    semesterId: semester.id,
    courseId,
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

    const requiredIds = model.sections.flatMap(collectRequiredIds);
    const unanswered = requiredIds.filter((id) => !(id in values.answers));

    if (unanswered.length > 0) {
      toast.error(`Please answer all required questions. ${unanswered.length} remaining.`);
      return;
    }

    if (
      model.qualitative.enabled &&
      model.qualitative.required &&
      !values.qualitativeComment.trim()
    ) {
      toast.error("Please provide your comments before submitting.");
      return;
    }

    cancelAutoSave();
    mutate(
      {
        versionId: activeVersion.id,
        respondentId,
        facultyId: faculty.id,
        semesterId: semester.id,
        courseId,
        answers: values.answers,
        qualitativeComment: values.qualitativeComment || undefined,
      },
      {
        onSuccess: () => setShowSuccessDialog(true),
      }
    );
  }, [
    activeVersion.id,
    faculty.id,
    semester.id,
    courseId,
    meQuery.data?.id,
    model,
    cancelAutoSave,
    mutate,
  ]);

  return (
    <EvaluationPageShell
      courseName={courseName}
      courseShortname={courseShortname}
      facultyName={facultyName}
      enrollmentSectionName={enrollmentSectionName}
    >
      <div className="mt-8">
        <QuestionnaireRatingScaleInstructions />
      </div>

      <div className="mt-8">
        <QuestionnaireFormRenderer
          key={draftHydrationKey}
          model={model}
          mode="interactive"
          defaultValues={defaultValues}
          onChange={handleChange}
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
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="items-center">
            <CheckCircle2 className="size-12 text-green-500" />
            <DialogTitle className="font-playfair text-xl">Evaluation Submitted</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for your feedback. Your evaluation has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button variant="brand" onClick={invalidateAndNavigate}>
              Back to Courses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EvaluationPageShell>
  );
}
