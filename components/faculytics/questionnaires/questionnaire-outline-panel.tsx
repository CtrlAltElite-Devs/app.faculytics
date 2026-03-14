"use client";

import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  QuestionnaireBuilderSectionNode,
  QuestionnaireBuilderValidationIssue,
} from "@/types/questionnaires";

type QuestionnaireOutlinePanelProps = {
  sections: QuestionnaireBuilderSectionNode[];
  selectedSectionId: string | null;
  sectionIssues: Record<string, QuestionnaireBuilderValidationIssue[]>;
  onSelect: (sectionId: string) => void;
  onAddRoot: () => void;
  onAddChild: (sectionId: string) => void;
  onMove: (sectionId: string, direction: "up" | "down") => void;
  onRemove: (sectionId: string) => void;
};

function OutlineNode({
  depth,
  node,
  selectedSectionId,
  sectionIssues,
  onSelect,
  onAddChild,
  onMove,
  onRemove,
}: {
  depth: number;
  node: QuestionnaireBuilderSectionNode;
  selectedSectionId: string | null;
  sectionIssues: Record<string, QuestionnaireBuilderValidationIssue[]>;
  onSelect: (sectionId: string) => void;
  onAddChild: (sectionId: string) => void;
  onMove: (sectionId: string, direction: "up" | "down") => void;
  onRemove: (sectionId: string) => void;
}) {
  const issueCount = sectionIssues[node.id]?.length ?? 0;
  const isSelected = node.id === selectedSectionId;
  const isLeaf = node.children.length === 0;

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex w-full items-start justify-between rounded-xl border px-3 py-3 text-left transition hover:border-brand-blue/40 hover:bg-accent/30",
          isSelected && "border-brand-blue bg-brand-blue/5"
        )}
        style={{ marginLeft: `${depth * 12}px` }}
      >
        <button type="button" className="min-w-0 flex-1 space-y-2 text-left" onClick={() => onSelect(node.id)}>
          <div className="flex items-center gap-2">
            {isLeaf ? (
              <ChevronRight className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
            <p className="truncate text-sm font-medium">{node.title || "Untitled section"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{isLeaf ? "Leaf" : "Parent"}</Badge>
            {isLeaf && (
              <Badge variant="outline">
                Weight {node.weight ?? "Unset"}
              </Badge>
            )}
            <Badge variant="outline">
              {node.questions.length} question{node.questions.length === 1 ? "" : "s"}
            </Badge>
            {issueCount > 0 && (
              <Badge variant="destructive">
                {issueCount} issue{issueCount === 1 ? "" : "s"}
              </Badge>
            )}
          </div>
        </button>
        <div className="ml-3 flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={(event) => {
              event.stopPropagation();
              onMove(node.id, "up");
            }}
            aria-label="Move section up"
          >
            <ArrowUp className="size-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={(event) => {
              event.stopPropagation();
              onMove(node.id, "down");
            }}
            aria-label="Move section down"
          >
            <ArrowDown className="size-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={(event) => {
              event.stopPropagation();
              onAddChild(node.id);
            }}
            aria-label="Add subsection"
          >
            <Plus className="size-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={(event) => {
              event.stopPropagation();
              onRemove(node.id);
            }}
            aria-label="Remove section"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>

      {node.children.map((child) => (
        <OutlineNode
          key={child.id}
          depth={depth + 1}
          node={child}
          selectedSectionId={selectedSectionId}
          sectionIssues={sectionIssues}
          onSelect={onSelect}
          onAddChild={onAddChild}
          onMove={onMove}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export function QuestionnaireOutlinePanel({
  sections,
  selectedSectionId,
  sectionIssues,
  onSelect,
  onAddRoot,
  onAddChild,
  onMove,
  onRemove,
}: QuestionnaireOutlinePanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-playfair text-lg">Structure</CardTitle>
        <Button type="button" size="sm" onClick={onAddRoot}>
          <Plus />
          Add root section
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
            Start with a root section, then add subsections or leaf questions from the editor.
          </div>
        ) : (
          sections.map((section) => (
            <OutlineNode
              key={section.id}
              depth={0}
              node={section}
              selectedSectionId={selectedSectionId}
              sectionIssues={sectionIssues}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onMove={onMove}
              onRemove={onRemove}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
