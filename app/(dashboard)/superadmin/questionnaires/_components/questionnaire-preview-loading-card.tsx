import { Loader2 } from "lucide-react";

type QuestionnairePreviewLoadingCardProps = {
  message: string;
};

export function QuestionnairePreviewLoadingCard({ message }: QuestionnairePreviewLoadingCardProps) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 text-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
