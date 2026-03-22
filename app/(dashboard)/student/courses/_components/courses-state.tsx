import { Loader2 } from "lucide-react";

type CoursesStateProps = {
  state: "loading" | "error" | "empty";
};

export function CoursesState({ state }: CoursesStateProps) {
  if (state === "loading") {
    return (
      <div className="col-span-full flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        <p className="text-sm">Fetching your enrolled courses...</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="col-span-full rounded-lg border border-dashed p-6 text-sm text-destructive">
        Unable to load enrolled courses right now.
      </div>
    );
  }

  return (
    <div className="col-span-full rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
      You are not enrolled in any courses yet.
    </div>
  );
}
