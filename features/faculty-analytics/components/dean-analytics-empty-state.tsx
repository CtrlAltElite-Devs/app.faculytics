import { Button } from "@/components/ui/button";

type DeanAnalyticsEmptyStateProps = {
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function DeanAnalyticsEmptyState({
  description,
  actionLabel,
  onAction,
}: DeanAnalyticsEmptyStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
      <p className="max-w-xl font-sans text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button
          type="button"
          variant="brand"
          size="sm"
          className="mt-5 font-sans"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
