import { Loader2 } from "lucide-react";

type FacultyStateProps = {
  state: "loading" | "error" | "empty";
  message?: string;
};

export function FacultyState({ state, message }: FacultyStateProps) {
  if (state === "loading") {
    return (
      <div className="col-span-full flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        <p className="text-sm">{message ?? "Fetching faculty members..."}</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="col-span-full rounded-lg border border-dashed p-6 text-sm text-destructive">
        {message ?? "Unable to load faculty members right now."}
      </div>
    );
  }

  return (
    <div className="col-span-full rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
      No faculty members are available for evaluation for the selected semester.
    </div>
  );
}
