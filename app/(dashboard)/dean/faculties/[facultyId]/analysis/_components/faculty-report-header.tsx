"use client";

import { ChevronDown, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FacultyReportHeaderProps = {
  backHref: string;
  facultyName: string;
  semesterLabel: string;
  questionnaireTypeLabel: string;
  questionnaireTypeCode: string;
  availableQuestionnaireTypes: Array<{
    code: string;
    label: string;
  }>;
  isQuestionnaireTypeLoading: boolean;
  isRefreshing: boolean;
  onQuestionnaireTypeChange: (value: string) => void;
  onRefresh: () => void;
};

export function FacultyReportHeader({
  backHref,
  facultyName,
  semesterLabel,
  questionnaireTypeLabel,
  questionnaireTypeCode,
  availableQuestionnaireTypes,
  isQuestionnaireTypeLoading,
  isRefreshing,
  onQuestionnaireTypeChange,
  onRefresh,
}: FacultyReportHeaderProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0">
        <h1 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          {facultyName}
        </h1>
        <p className="mt-4 max-w-3xl font-sans text-sm text-muted-foreground">
          Review per-question faculty evaluation results for{" "}
          <span className="font-bold text-foreground">{semesterLabel}</span>.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end xl:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm sm:w-64"
              disabled={isQuestionnaireTypeLoading || availableQuestionnaireTypes.length === 0}
            >
              <span className="truncate">{questionnaireTypeLabel}</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
          >
            <DropdownMenuRadioGroup
              value={questionnaireTypeCode}
              onValueChange={onQuestionnaireTypeChange}
            >
              {availableQuestionnaireTypes.map((type) => (
                <DropdownMenuRadioItem
                  key={type.code}
                  value={type.code}
                  className="font-sans text-sm"
                >
                  {type.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="outline"
          className="w-full px-4 py-2.5 font-sans text-sm sm:w-auto"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full px-4 py-2.5 font-sans text-sm sm:w-auto"
        >
          <Link href={backHref}>Back to Faculties</Link>
        </Button>
      </div>
    </div>
  );
}
