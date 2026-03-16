import { Button } from "@/components/ui/button";

type QuestionnaireEmptyStateProps = {
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function QuestionnaireEmptyState({
  description,
  actionLabel,
  onAction,
}: QuestionnaireEmptyStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
      <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button
          type="button"
          size={"sm"}
          className="mt-5 bg-brand-blue/80 text-white hover:bg-brand-blue/70 cursor-pointer"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
