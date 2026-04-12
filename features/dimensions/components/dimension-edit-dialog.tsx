"use client";

import type { AxiosError } from "axios";
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
import { useUpdateDimension } from "@/features/dimensions/hooks/use-update-dimension";
import {
  editDimensionSchema,
  type EditDimensionFormValues,
} from "@/features/dimensions/schemas/dimension.schemas";
import type { Dimension } from "@/features/dimensions/types";

type DimensionEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dimension: Dimension | null;
};

export function DimensionEditDialog({ open, onOpenChange, dimension }: DimensionEditDialogProps) {
  const updateMutation = useUpdateDimension();

  const form = useForm<EditDimensionFormValues>({
    resolver: zodResolver(editDimensionSchema),
    defaultValues: {
      displayName: "",
    },
  });

  useEffect(() => {
    if (dimension) {
      form.reset({ displayName: dimension.displayName });
    }
  }, [dimension, form]);

  const onSubmit = async (values: EditDimensionFormValues) => {
    if (!dimension) return;

    try {
      await updateMutation.mutateAsync({
        id: dimension.id,
        payload: { displayName: values.displayName },
      });
      toast.success("Dimension updated.");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      const message =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ??
        "Unable to update dimension.";
      toast.error(message);
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
          <DialogTitle>Edit dimension</DialogTitle>
          <DialogDescription>
            Update the display name for <strong>{dimension?.code}</strong>. The dimension code stays
            the same.
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
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Classroom management"
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
