import { Badge } from "@/components/ui/badge";
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

// TODO: Add quick actions on rows
// such as preview, deprecate, publish
export function QuestionnaireTable({ rows }: QuestionnaireTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4">Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="pr-4">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="px-4 font-medium">v{row.versionNumber}</TableCell>
              <TableCell>
                <Badge
                  variant="ghost"
                  className={cn("font-medium", STATUS_BADGE_CLASS_NAMES[row.status])}
                >
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(row.publishedAt)}</TableCell>
              <TableCell className="pr-4">{formatDate(row.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
