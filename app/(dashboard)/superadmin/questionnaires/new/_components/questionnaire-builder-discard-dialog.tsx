import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";

type QuestionnaireBuilderDiscardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function QuestionnaireBuilderDiscardDialog({
  open,
  onOpenChange,
  onConfirm,
}: QuestionnaireBuilderDiscardDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Discard unsaved changes?"
      description="Returning to the questionnaire list will discard any unsaved changes in this draft."
      cancelLabel="Keep editing"
      confirmLabel="Discard changes"
      confirmVariant="destructive"
      onConfirm={onConfirm}
    />
  );
}
