import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { QuestionnaireVersionItem } from "@/types/questionnaires";

type QuestionnaireTableProps = {
  rows: QuestionnaireVersionItem[];
  onEditDraft?: (row: QuestionnaireVersionItem) => void;
  onViewVersion?: (row: QuestionnaireVersionItem) => void;
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

export function QuestionnaireTable({ rows, onEditDraft, onViewVersion }: QuestionnaireTableProps) {
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
              <TableCell>
                {row.status === "DRAFT" && onEditDraft ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => onEditDraft(row)}>
                    Edit
                  </Button>
                ) : row.status !== "DRAFT" && onViewVersion ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => onViewVersion(row)}>
                    View
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
