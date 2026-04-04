"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { QuestionnaireSearchInput } from "@/features/questionnaires/components/questionnaire-search-input";
import { QuestionnaireStatusFilter } from "@/features/questionnaires/components/questionnaire-status-filter";
import { QuestionnaireTypeDropdown } from "@/features/questionnaires/components/questionnaire-type-dropdown";
import { useCreateVersionFromTemplate } from "@/features/questionnaires/hooks/use-create-version-from-template";
import { isAxiosErrorWithStatus } from "@/lib/api-errors";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type {
  QuestionnaireStatusFilter as StatusFilter,
  QuestionnaireTypeCode,
  QuestionnaireTypeSummary,
  QuestionnaireVersionItem,
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
  questionnaireId: string | null;
  templateVersions: QuestionnaireVersionItem[];
};

type TemplateChoice = "scratch" | "template";

function formatVersionLabel(v: QuestionnaireVersionItem) {
  const date = v.publishedAt
    ? new Date(v.publishedAt).toLocaleDateString()
    : new Date(v.createdAt).toLocaleDateString();
  return `v${v.versionNumber} — ${v.status} (${date})`;
}

export function QuestionnaireListToolbar({
  availableTypes,
  activeType,
  statusFilter,
  searchValue,
  hasDraftVersion,
  onTypeChange,
  onStatusFilterChange,
  onSearchChange,
  questionnaireId,
  templateVersions,
}: QuestionnaireListToolbarProps) {
  const router = useRouter();
  const createFromTemplate = useCreateVersionFromTemplate();

  const [modalOpen, setModalOpen] = useState(false);
  const [choice, setChoice] = useState<TemplateChoice>("scratch");
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");

  const createDraftHref = `/superadmin/questionnaires/new?type=${activeType}`;
  const hasTemplates = templateVersions.length > 0 && questionnaireId !== null;

  function handleCreateDraftClick() {
    if (hasTemplates) {
      setChoice("scratch");
      setSelectedVersionId(templateVersions[0].id);
      setModalOpen(true);
    } else {
      router.push(createDraftHref);
    }
  }

  function handleConfirm() {
    if (choice === "scratch") {
      setModalOpen(false);
      router.push(createDraftHref);
      return;
    }

    if (!questionnaireId || !selectedVersionId) return;

    createFromTemplate.mutate(
      { questionnaireId, sourceVersionId: selectedVersionId },
      {
        onSuccess: (data) => {
          setModalOpen(false);
          router.push(`/superadmin/questionnaires/new?type=${activeType}&versionId=${data.id}`);
        },
        onError: (error) => {
          if (isAxiosErrorWithStatus(error, 409)) {
            toast.error("A draft already exists — edit it or deprecate it first.");
          } else {
            toast.error("Failed to create version from template.");
          }
        },
      }
    );
  }

  const createDraftButton = !hasDraftVersion ? (
    <Button variant="brand" className="shrink-0" onClick={handleCreateDraftClick}>
      Create Draft
    </Button>
  ) : null;

  const createDraftButtonMobile = !hasDraftVersion ? (
    <Button variant="brand" className="w-full min-w-0" onClick={handleCreateDraftClick}>
      Create Draft
    </Button>
  ) : null;

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
          <div className={hasDraftVersion ? "w-full" : "grid grid-cols-2 gap-3"}>
            <QuestionnaireStatusFilter
              value={statusFilter}
              onValueChange={onStatusFilterChange}
              className="w-full min-w-0 justify-between gap-3"
            />
            {createDraftButtonMobile}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:min-w-0 lg:flex-wrap lg:items-start lg:gap-3">
        <QuestionnaireTypeDropdown
          types={availableTypes}
          value={activeType}
          onValueChange={onTypeChange}
          className="lg:w-auto lg:max-w-[26rem] lg:shrink-0"
        />

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-3">
          {createDraftButton}
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

      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!createFromTemplate.isPending) setModalOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new draft</DialogTitle>
            <DialogDescription>
              Start from scratch or use a previous version as a template.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={choice === "scratch" ? "default" : "outline"}
                className="h-auto py-3"
                onClick={() => setChoice("scratch")}
              >
                Start from scratch
              </Button>
              <Button
                variant={choice === "template" ? "default" : "outline"}
                className="h-auto py-3"
                onClick={() => setChoice("template")}
              >
                Use a template
              </Button>
            </div>

            {choice === "template" && (
              <div className="space-y-2">
                <Label htmlFor="template-version-select">Select version</Label>
                <select
                  id="template-version-select"
                  value={selectedVersionId}
                  onChange={(e) => setSelectedVersionId(e.target.value)}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {templateVersions.map((v) => (
                    <option key={v.id} value={v.id}>
                      {formatVersionLabel(v)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={createFromTemplate.isPending}
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              disabled={
                createFromTemplate.isPending || (choice === "template" && !selectedVersionId)
              }
              onClick={handleConfirm}
            >
              {createFromTemplate.isPending ? "Creating\u2026" : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
