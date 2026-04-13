"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdateQuestionnaireTypeManagement } from "@/features/questionnaires/hooks/use-update-questionnaire-type-management";
import {
  editQuestionnaireTypeManagementSchema,
  type EditQuestionnaireTypeManagementFormValues,
} from "@/features/questionnaires/schemas/questionnaire-type-management.schemas";
import type { QuestionnaireTypeManagementEntity } from "@/features/questionnaires/types";
import { resolveApiErrorMessage } from "@/lib/api-errors";

type QuestionnaireTypeEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionnaireType: QuestionnaireTypeManagementEntity | null;
};

export function QuestionnaireTypeEditDialog({
  open,
  onOpenChange,
  questionnaireType,
}: QuestionnaireTypeEditDialogProps) {
  const updateMutation = useUpdateQuestionnaireTypeManagement();

  const form = useForm<EditQuestionnaireTypeManagementFormValues>({
    resolver: zodResolver(editQuestionnaireTypeManagementSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (questionnaireType) {
      form.reset({
        name: questionnaireType.name,
        description: questionnaireType.description ?? "",
      });
    }
  }, [form, questionnaireType]);

  const onSubmit = async (values: EditQuestionnaireTypeManagementFormValues) => {
    if (!questionnaireType) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: questionnaireType.id,
        payload: {
          name: values.name,
          description: values.description || undefined,
        },
      });
      toast.success("Questionnaire type updated.");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(resolveApiErrorMessage(error, "The questionnaire type could not be updated."));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !updateMutation.isPending) {
          form.reset();
          onOpenChange(false);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit questionnaire type</DialogTitle>
          <DialogDescription>
            Update the metadata for <strong>{questionnaireType?.code}</strong>. The type code cannot
            be changed after creation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Code</FieldLabel>
              <Input value={questionnaireType?.code ?? ""} disabled readOnly />
            </Field>

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.error?.message ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Description <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.error?.message ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : null}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={updateMutation.isPending}
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
