import { Button } from "@/components/ui/button";

type QuestionnaireEmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function QuestionnaireEmptyState({
  title,
  description: _description,
  actionLabel,
  onAction,
}: QuestionnaireEmptyStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">{title}</p>
      {actionLabel && onAction ? (
        <Button type="button" className="mt-5 bg-brand-blue/80 hover:bg-brand-blue/70 text-white" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
