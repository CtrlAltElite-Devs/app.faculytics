import { Button } from "@/components/ui/button";

type DeanAnalyticsErrorStateProps = {
  onRetry: () => void;
  message?: string;
};

export function DeanAnalyticsErrorState({
  onRetry,
  message = "Unable to load analytics right now.",
}: DeanAnalyticsErrorStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
      <p className="max-w-xl font-sans text-sm text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" className="mt-5 font-sans" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
