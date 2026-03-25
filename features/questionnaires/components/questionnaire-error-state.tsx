import { Button } from "@/components/ui/button";

type QuestionnaireErrorStateProps = {
  onRetry: () => void;
};

export function QuestionnaireErrorState({ onRetry }: QuestionnaireErrorStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
      <p className="max-w-xl text-sm text-muted-foreground">Unable to load questionnaires.</p>
      <Button type="button" variant="outline" className="mt-5" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
