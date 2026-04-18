"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionnaireFormSummary } from "@/features/questionnaires/components/form/questionnaire-form-summary";
import type {
  QuestionnaireBuilderPreviewModel,
  QuestionnaireFormValues,
} from "@/features/questionnaires/types";

type EvaluationReviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: QuestionnaireBuilderPreviewModel;
  values: QuestionnaireFormValues | null;
  isSubmitting: boolean;
  onConfirm: () => void;
};

export function EvaluationReviewDialog({
  open,
  onOpenChange,
  model,
  values,
  isSubmitting,
  onConfirm,
}: EvaluationReviewDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isSubmitting && !next) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="max-w-3xl"
        onInteractOutside={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl">Review your evaluation</DialogTitle>
          <DialogDescription>
            Please review your answers below. You can go back to edit them or confirm to submit.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {values ? (
            <QuestionnaireFormSummary model={model} values={values} />
          ) : (
            <p className="text-sm text-muted-foreground">No answers to review.</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Edit
          </Button>
          <Button
            variant="brand"
            onClick={onConfirm}
            disabled={isSubmitting || !values}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Confirm & Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
