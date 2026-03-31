"use client";

import Link from "next/link";

import { QuestionnaireSearchInput } from "@/features/questionnaires/components/questionnaire-search-input";
import { QuestionnaireStatusFilter } from "@/features/questionnaires/components/questionnaire-status-filter";
import { QuestionnaireTypeDropdown } from "@/features/questionnaires/components/questionnaire-type-dropdown";
import { Button } from "@/components/ui/button";
import type {
  QuestionnaireStatusFilter as StatusFilter,
  QuestionnaireTypeCode,
  QuestionnaireTypeSummary,
} from "@/features/questionnaires/types";

type QuestionnaireListToolbarProps = {
  availableTypes: QuestionnaireTypeSummary[];
  activeType: QuestionnaireTypeCode;
  statusFilter: StatusFilter;
  searchValue: string;
  hasDraftVersion: boolean;
  onTypeChange: (nextType: QuestionnaireTypeCode) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onSearchChange: (value: string) => void;
};

export function QuestionnaireListToolbar({
  availableTypes,
  activeType,
  statusFilter,
  searchValue,
  hasDraftVersion,
  onTypeChange,
  onStatusFilterChange,
  onSearchChange,
}: QuestionnaireListToolbarProps) {
  const createDraftHref = `/superadmin/questionnaires/new?type=${activeType}`;

  return (
    <>
      <div className="flex flex-col gap-3 lg:hidden">
        <QuestionnaireTypeDropdown
          types={availableTypes}
          value={activeType}
          onValueChange={onTypeChange}
        />
        <div className="flex flex-col gap-3">
          <QuestionnaireSearchInput
            value={searchValue}
            onChange={onSearchChange}
            className="relative w-full"
          />
          <QuestionnaireStatusFilter
            value={statusFilter}
            onValueChange={onStatusFilterChange}
            className="w-full justify-between gap-3"
          />
        </div>
        {!hasDraftVersion ? (
          <Button asChild variant="brand" className="w-full">
            <Link href={createDraftHref}>Create Draft</Link>
          </Button>
        ) : null}
      </div>

      <div className="hidden lg:flex lg:min-w-0 lg:flex-wrap lg:items-start lg:gap-3">
        <QuestionnaireTypeDropdown
          types={availableTypes}
          value={activeType}
          onValueChange={onTypeChange}
          className="lg:w-auto lg:max-w-[26rem] lg:shrink-0"
        />

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-3">
          {!hasDraftVersion ? (
            <Button asChild variant="brand" className="shrink-0">
              <Link href={createDraftHref}>Create Draft</Link>
            </Button>
          ) : null}
          <QuestionnaireSearchInput
            value={searchValue}
            onChange={onSearchChange}
            className="relative min-w-[15rem] flex-1 lg:max-w-xs xl:max-w-sm"
          />
          <QuestionnaireStatusFilter
            value={statusFilter}
            onValueChange={onStatusFilterChange}
            className="w-auto shrink-0 justify-between gap-3"
          />
        </div>
      </div>
    </>
  );
}
