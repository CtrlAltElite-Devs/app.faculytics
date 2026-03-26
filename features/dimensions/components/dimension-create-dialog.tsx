"use client";

import type { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Loader2 } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateDimension } from "@/features/dimensions/hooks/use-create-dimension";
import {
  createDimensionSchema,
  type CreateDimensionFormValues,
} from "@/features/dimensions/schemas/dimension.schemas";
import {
  QUESTIONNAIRE_TYPE_LABELS,
  QUESTIONNAIRE_TYPES,
} from "@/features/questionnaires/constants";
import type { QuestionnaireType } from "@/features/questionnaires/types";

type DimensionCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DimensionCreateDialog({ open, onOpenChange }: DimensionCreateDialogProps) {
  const createMutation = useCreateDimension();

  const form = useForm<CreateDimensionFormValues>({
    resolver: zodResolver(createDimensionSchema),
    defaultValues: {
      displayName: "",
      questionnaireType: undefined,
      code: "",
    },
  });

  const onSubmit = async (values: CreateDimensionFormValues) => {
    try {
      await createMutation.mutateAsync({
        displayName: values.displayName,
        questionnaireType: values.questionnaireType as QuestionnaireType,
        code: values.code || undefined,
      });
      toast.success("Dimension created.");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      const message =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ??
        "Unable to create dimension.";
      toast.error(message);
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
          <DialogTitle>Create Dimension</DialogTitle>
          <DialogDescription>
            Add a new dimension code for questionnaire sections.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="displayName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Display Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g. Classroom Management"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error?.message ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="questionnaireType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Questionnaire Type</FieldLabel>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between gap-3"
                        aria-invalid={fieldState.invalid}
                      >
                        {field.value
                          ? QUESTIONNAIRE_TYPE_LABELS[field.value as QuestionnaireType]
                          : "Select a type"}
                        <ChevronDown className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-56">
                      <DropdownMenuRadioGroup
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        {QUESTIONNAIRE_TYPES.map((type) => (
                          <DropdownMenuRadioItem key={type} value={type}>
                            {QUESTIONNAIRE_TYPE_LABELS[type]}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                  <FieldLabel>
                    Code <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g. CLASSROOM_MGMT"
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
