import { Loader2 } from "lucide-react";

type QuestionnairePreviewLoadingCardProps = {
  message: string;
};

export function QuestionnairePreviewLoadingCard({ message }: QuestionnairePreviewLoadingCardProps) {
  return (
    <div className="flex min-h-[45vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
