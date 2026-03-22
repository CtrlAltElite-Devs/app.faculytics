import { ArchiveX, Eye, MoreVertical, PencilLine, Rocket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { QuestionnaireVersionItem } from "@/features/questionnaires/types";

type QuestionnaireTableProps = {
  rows: QuestionnaireVersionItem[];
  onEditDraft?: (row: QuestionnaireVersionItem) => void;
  onViewVersion?: (row: QuestionnaireVersionItem) => void;
  onPublishVersion?: (row: QuestionnaireVersionItem) => void;
  onDeprecateVersion?: (row: QuestionnaireVersionItem) => void;
  disableActions?: boolean;
};

const STATUS_BADGE_CLASS_NAMES = {
  DRAFT: "badge-status-draft",
  ACTIVE: "badge-status-active",
  DEPRECATED: "badge-status-deprecated",
} as const;

function formatDate(value?: string | null) {
  if (!value) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function QuestionnaireTable({
  rows,
  onEditDraft,
  onViewVersion,
  onPublishVersion,
  onDeprecateVersion,
  disableActions = false,
}: QuestionnaireTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[18%] px-4">Version</TableHead>
            <TableHead className="w-[22%]">Status</TableHead>
            <TableHead className="w-[20%]">Published</TableHead>
            <TableHead className="w-[20%]">Created</TableHead>
            <TableHead className="w-[20%] pl-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="px-4 font-medium tabular-nums">v{row.versionNumber}</TableCell>
              <TableCell>
                <Badge
                  variant="ghost"
                  className={cn("font-medium", STATUS_BADGE_CLASS_NAMES[row.status])}
                >
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(row.publishedAt)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(row.createdAt)}
              </TableCell>
              <TableCell className="pl-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-9 p-0"
                      disabled={disableActions}
                      aria-label={`Actions for version ${row.versionNumber}`}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {row.status === "DRAFT" && onEditDraft ? (
                      <DropdownMenuItem disabled={disableActions} onClick={() => onEditDraft(row)}>
                        <PencilLine className="size-4" />
                        Edit
                      </DropdownMenuItem>
                    ) : null}
                    {row.status !== "DRAFT" && onViewVersion ? (
                      <DropdownMenuItem disabled={disableActions} onClick={() => onViewVersion(row)}>
                        <Eye className="size-4" />
                        View
                      </DropdownMenuItem>
                    ) : null}
                    {row.status === "DRAFT" && onPublishVersion ? (
                      <DropdownMenuItem disabled={disableActions} onClick={() => onPublishVersion(row)}>
                        <Rocket className="size-4" />
                        Publish
                      </DropdownMenuItem>
                    ) : null}
                    {(row.status === "DRAFT" || row.status === "ACTIVE") && onDeprecateVersion ? (
                      <DropdownMenuItem disabled={disableActions} onClick={() => onDeprecateVersion(row)}>
                        <ArchiveX className="size-4" />
                        Deprecate
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
