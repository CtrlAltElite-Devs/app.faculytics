import { Loader2 } from "lucide-react";

export function CoursesLoadingState() {
  return (
    <div className="col-span-full flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-muted-foreground">
      <Loader2 className="size-5 animate-spin" />
      <p className="text-sm">Fetching your enrolled courses...</p>
    </div>
  );
}
