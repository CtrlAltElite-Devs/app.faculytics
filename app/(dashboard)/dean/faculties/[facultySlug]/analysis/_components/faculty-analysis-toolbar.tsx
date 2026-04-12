"use client";

import { ChevronDown, Upload } from "lucide-react";
import { useId, useState } from "react";

import type { SemesterKey } from "@/features/faculty-analytics";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const semesterLabels: Record<SemesterKey, string> = {
  firstSemester: "First Semester",
  secondSemester: "Second Semester",
  summerSemester: "Summer",
};

export function FacultyAnalysisToolbar({
  selectedSemester,
  onSemesterChange,
}: {
  selectedSemester: SemesterKey;
  onSemesterChange: (semester: SemesterKey) => void;
}) {
  const fileInputId = useId();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-w-44 justify-between font-sans"
          >
            <span>{semesterLabels[selectedSemester]}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuRadioGroup
            value={selectedSemester}
            onValueChange={(value) => onSemesterChange(value as SemesterKey)}
          >
            {(Object.entries(semesterLabels) as Array<[SemesterKey, string]>).map(
              ([value, label]) => (
                <DropdownMenuRadioItem key={value} value={value} className="font-sans text-sm">
                  {label}
                </DropdownMenuRadioItem>
              )
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="font-sans">
            Import File
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-playfair text-2xl font-semibold tracking-tight">
              Upload File
            </DialogTitle>
            <DialogDescription className="font-sans text-sm">
              Import feedback data to generate or merge with the existing data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <label
              htmlFor={fileInputId}
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 bg-muted/30 px-6 py-10 text-center transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                <Upload className="size-5" />
              </span>
              <div className="space-y-1">
                <p className="font-sans text-sm font-medium text-foreground">
                  Click to choose a file
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  Accepted formats: CSV, XLSX, XLS, and PDF.
                </p>
              </div>
            </label>
            <input
              id={fileInputId}
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              className="sr-only"
              onChange={(event) => {
                setSelectedFileName(event.target.files?.[0]?.name ?? null);
              }}
            />
            <div className="rounded-xl border border-border/70 bg-background px-4 py-3">
              <p className="font-sans text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Selected File
              </p>
              <p className="mt-2 font-sans text-sm text-foreground">
                {selectedFileName ?? "No file selected yet."}
              </p>
            </div>
          </div>
          <DialogFooter showCloseButton className="pt-2">
            <Button type="button" variant="brand" className="font-sans">
              Upload File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button type="button" variant="brand" size="sm" className="font-sans">
        Export Report
      </Button>
    </div>
  );
}
