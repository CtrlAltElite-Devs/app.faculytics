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
      description="Going back to questionnaires will discard the unsaved changes in this builder."
      cancelLabel="Keep editing"
      confirmLabel="Discard changes"
      confirmVariant="destructive"
      onConfirm={onConfirm}
    />
  );
}
