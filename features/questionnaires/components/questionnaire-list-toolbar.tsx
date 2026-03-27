"use client";

import Link from "next/link";

import { QuestionnaireSearchInput } from "@/features/questionnaires/components/questionnaire-search-input";
import { QuestionnaireStatusFilter } from "@/features/questionnaires/components/questionnaire-status-filter";
import { QuestionnaireTypeButtonGroup } from "@/features/questionnaires/components/questionnaire-type-button-group";
import { Button } from "@/components/ui/button";
import type {
  QuestionnaireStatusFilter as StatusFilter,
  QuestionnaireTypeCode,
} from "@/features/questionnaires/types";

type QuestionnaireListToolbarProps = {
  availableTypes: QuestionnaireTypeCode[];
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
        <QuestionnaireTypeButtonGroup
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

      <div className="hidden lg:flex lg:min-w-0 lg:flex-row lg:items-center lg:gap-3">
        <QuestionnaireTypeButtonGroup
          types={availableTypes}
          value={activeType}
          onValueChange={onTypeChange}
          className="lg:shrink-0"
        />

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          {!hasDraftVersion ? (
            <Button asChild variant="brand" className="shrink-0">
              <Link href={createDraftHref}>Create Draft</Link>
            </Button>
          ) : null}
          <QuestionnaireSearchInput
            value={searchValue}
            onChange={onSearchChange}
            className="relative w-full min-w-0 lg:w-2/5 lg:flex-none xl:w-1/6"
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
