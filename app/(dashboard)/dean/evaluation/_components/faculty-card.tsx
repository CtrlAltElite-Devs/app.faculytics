import { BookOpenText, CircleDot } from "lucide-react";

import type { DeanEvaluationFacultyRow } from "./mock-faculty-data";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FacultyCardProps = DeanEvaluationFacultyRow;

function getInitials(fullName: string) {
  return (
    fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "F"
  );
}

function getStatusClassName(statusTone: DeanEvaluationFacultyRow["statusTone"]) {
  return statusTone === "ready"
    ? "border-emerald-500/30 text-emerald-600"
    : "border-amber-500/30 text-amber-600";
}

export function FacultyCard({
  fullName,
  profilePicture,
  departmentName,
  subjects,
  statusLabel,
  statusTone,
}: FacultyCardProps) {
  return (
    <Card className="h-full gap-0 overflow-hidden py-0">
      <CardContent className="flex h-full flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Avatar className="size-11 border border-border/70">
            {profilePicture ? <AvatarImage src={profilePicture} alt={fullName} /> : null}
            <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <h2 className="font-playfair text-xl font-semibold leading-tight text-foreground">
              {fullName}
            </h2>
            <p className="text-sm text-muted-foreground">{departmentName ?? "Department pending"}</p>
          </div>
        </div>

        <Badge variant="outline" className={`self-start ${getStatusClassName(statusTone)}`}>
          <CircleDot className="size-3.5" />
          {statusLabel}
        </Badge>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2.5">
            <BookOpenText className="mt-0.5 size-4 shrink-0" />
            <p className="line-clamp-2">
              {subjects.length ? subjects.join(", ") : "Faculty subjects will appear once live data is available."}
            </p>
          </div>
        </div>

        <Button variant="outline" className="mt-auto w-full" disabled>
          Evaluation flow coming next
        </Button>
      </CardContent>
    </Card>
  );
}
