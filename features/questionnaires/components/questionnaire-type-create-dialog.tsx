"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { useCreateQuestionnaireTypeManagement } from "@/features/questionnaires/hooks/use-create-questionnaire-type-management";
import { resolveCreateQuestionnaireTypeManagementErrorMessage } from "@/features/questionnaires/lib/questionnaire-type-management-errors";
import {
  createQuestionnaireTypeManagementSchema,
  type CreateQuestionnaireTypeManagementFormValues,
} from "@/features/questionnaires/schemas/questionnaire-type-management.schemas";

type QuestionnaireTypeCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QuestionnaireTypeCreateDialog({
  open,
  onOpenChange,
}: QuestionnaireTypeCreateDialogProps) {
  const createMutation = useCreateQuestionnaireTypeManagement();

  const form = useForm<CreateQuestionnaireTypeManagementFormValues>({
    resolver: zodResolver(createQuestionnaireTypeManagementSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const onSubmit = async (values: CreateQuestionnaireTypeManagementFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        code: values.code,
        description: values.description || undefined,
      });
      toast.success("Questionnaire type created.");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        resolveCreateQuestionnaireTypeManagementErrorMessage(
          error,
          "Unable to create questionnaire type."
        )
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !createMutation.isPending) {
          form.reset();
          onOpenChange(false);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Questionnaire Type</DialogTitle>
          <DialogDescription>
            Add a custom questionnaire type for Super Admin management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g. Peer Review"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error?.message ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Code</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g. PEER_REVIEW"
                    aria-invalid={fieldState.invalid}
                  />
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
                  <Input
                    {...field}
                    placeholder="e.g. Peer teaching evaluation"
                    aria-invalid={fieldState.invalid}
                  />
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
              disabled={createMutation.isPending}
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
