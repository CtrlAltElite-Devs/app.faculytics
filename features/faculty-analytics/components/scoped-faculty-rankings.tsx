"use client";

import { LayoutGrid, Rows3 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScopedFacultyRankingsCardGrid } from "@/features/faculty-analytics/components/scoped-faculty-rankings-card-grid";
import { ScopedFacultyRankingsTable } from "@/features/faculty-analytics/components/scoped-faculty-rankings-table";
import type { ScopeLabel } from "@/features/faculty-analytics/components/scoped-dashboard-section-types";
import type { ScopedFacultyRankingRow } from "@/features/faculty-analytics/lib/scoped-analytics-view-model";

type FacultyRankingsViewMode = "card" | "list";

type ScopedFacultyRankingsProps = {
  facultyRankings: readonly ScopedFacultyRankingRow[];
  scopeLabel: ScopeLabel;
  selectedSemesterId: string | null;
  selectedSemesterLabel: string;
};

const STORAGE_KEY = "faculytics-faculty-rankings-view";

function getInitialFacultyRankingsViewMode(): FacultyRankingsViewMode {
  if (typeof window === "undefined") {
    return "list";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "card" || stored === "list" ? stored : "list";
}

type FacultyRankingsViewToggleProps = {
  value: FacultyRankingsViewMode;
  onValueChange: (next: FacultyRankingsViewMode) => void;
};

function FacultyRankingsViewToggle({ value, onValueChange }: FacultyRankingsViewToggleProps) {
  return (
    <ButtonGroup>
      <Button
        type="button"
        variant={value === "card" ? "brand" : "outline"}
        size="sm"
        className="px-3"
        aria-pressed={value === "card"}
        onClick={() => onValueChange("card")}
      >
        <LayoutGrid className="size-4" />
        Card
      </Button>
      <Button
        type="button"
        variant={value === "list" ? "brand" : "outline"}
        size="sm"
        className="px-3"
        aria-pressed={value === "list"}
        onClick={() => onValueChange("list")}
      >
        <Rows3 className="size-4" />
        List
      </Button>
    </ButtonGroup>
  );
}

export function ScopedFacultyRankings({
  facultyRankings,
  scopeLabel,
  selectedSemesterId,
  selectedSemesterLabel,
}: ScopedFacultyRankingsProps) {
  const [viewMode, setViewMode] = useState<FacultyRankingsViewMode>(
    getInitialFacultyRankingsViewMode
  );

  function handleViewModeChange(next: FacultyRankingsViewMode) {
    setViewMode(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }

  const isEmpty = facultyRankings.length === 0;

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Faculty Rankings</CardTitle>
        <CardDescription>
          Sorted by percentile and normalized score for the selected filters.
        </CardDescription>
        {!isEmpty ? (
          <CardAction>
            <FacultyRankingsViewToggle value={viewMode} onValueChange={handleViewModeChange} />
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 text-center">
            <p className="max-w-sm font-sans text-sm text-muted-foreground">
              Faculty rankings will appear once analyzed faculty data is available for this
              selection.
            </p>
          </div>
        ) : viewMode === "card" ? (
          <ScopedFacultyRankingsCardGrid
            facultyRankings={facultyRankings}
            scopeLabel={scopeLabel}
            selectedSemesterId={selectedSemesterId ?? ""}
            selectedSemesterLabel={selectedSemesterLabel}
          />
        ) : (
          <ScopedFacultyRankingsTable
            facultyRankings={facultyRankings}
            scopeLabel={scopeLabel}
            selectedSemesterId={selectedSemesterId ?? ""}
            selectedSemesterLabel={selectedSemesterLabel}
          />
        )}
      </CardContent>
    </Card>
  );
}
