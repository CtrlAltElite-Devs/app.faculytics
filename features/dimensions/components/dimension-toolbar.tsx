"use client";

import { ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getQuestionnaireTypeLabel } from "@/features/questionnaires/constants";
import {
  isSeededQuestionnaireTypeCode,
  type QuestionnaireTypeCode,
  type QuestionnaireTypeSummary,
} from "@/features/questionnaires/types";

type DimensionStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

const STATUS_FILTER_LABELS: Record<DimensionStatusFilter, string> = {
  ALL: "All statuses",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

type TypeFilter = QuestionnaireTypeCode;

type DimensionTypeOption = Pick<QuestionnaireTypeSummary, "code" | "name">;

type DimensionToolbarProps = {
  typeOptions: DimensionTypeOption[];
  typeFilter: TypeFilter;
  statusFilter: DimensionStatusFilter;
  searchValue: string;
  onTypeFilterChange: (value: TypeFilter) => void;
  onStatusFilterChange: (value: DimensionStatusFilter) => void;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
};

export type { DimensionStatusFilter, TypeFilter };

export function DimensionToolbar({
  typeOptions,
  typeFilter,
  statusFilter,
  searchValue,
  onTypeFilterChange,
  onStatusFilterChange,
  onSearchChange,
  onCreateClick,
}: DimensionToolbarProps) {
  const selectedType = typeOptions.find((type) => type.code === typeFilter) ?? null;
  const selectedTypeLabel = selectedType
    ? getQuestionnaireTypeLabel(typeFilter, selectedType.name)
    : null;

  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-col gap-3 lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between gap-3">
              {selectedTypeLabel ??
                (isSeededQuestionnaireTypeCode(typeFilter)
                  ? getQuestionnaireTypeLabel(typeFilter)
                  : "")}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-56">
            <DropdownMenuRadioGroup
              value={typeFilter}
              onValueChange={(v) => onTypeFilterChange(v as TypeFilter)}
            >
              {typeOptions.map((type) => (
                <DropdownMenuRadioItem key={type.code} value={type.code}>
                  {getQuestionnaireTypeLabel(type.code, type.name)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search dimensions..."
            className="pl-9"
            aria-label="Search dimensions"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between gap-3">
              {STATUS_FILTER_LABELS[statusFilter]}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={(v) => onStatusFilterChange(v as DimensionStatusFilter)}
            >
              {(Object.keys(STATUS_FILTER_LABELS) as DimensionStatusFilter[]).map((key) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {STATUS_FILTER_LABELS[key]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="button" variant="brand" className="w-full" onClick={onCreateClick}>
          Create Dimension
        </Button>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex lg:min-w-0 lg:flex-wrap lg:items-start lg:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn("w-full justify-between gap-3 lg:w-auto lg:min-w-72 lg:max-w-[26rem]")}
            >
              <span className="truncate">
                {selectedTypeLabel ??
                  (isSeededQuestionnaireTypeCode(typeFilter)
                    ? getQuestionnaireTypeLabel(typeFilter)
                    : "")}
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[18rem] max-w-[24rem]">
            <DropdownMenuRadioGroup
              value={typeFilter}
              onValueChange={(v) => onTypeFilterChange(v as TypeFilter)}
            >
              {typeOptions.map((type) => (
                <DropdownMenuRadioItem key={type.code} value={type.code}>
                  <span className="truncate">
                    {getQuestionnaireTypeLabel(type.code, type.name)}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-3">
          <Button type="button" variant="brand" className="shrink-0" onClick={onCreateClick}>
            Create Dimension
          </Button>

          <div className="relative min-w-[15rem] flex-1 lg:max-w-xs xl:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dimensions..."
              className="pl-9"
              aria-label="Search dimensions"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-auto shrink-0 justify-between gap-3"
              >
                {STATUS_FILTER_LABELS[statusFilter]}
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={(v) => onStatusFilterChange(v as DimensionStatusFilter)}
              >
                {(Object.keys(STATUS_FILTER_LABELS) as DimensionStatusFilter[]).map((key) => (
                  <DropdownMenuRadioItem key={key} value={key}>
                    {STATUS_FILTER_LABELS[key]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
