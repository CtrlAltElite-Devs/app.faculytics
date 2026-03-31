import { MoreVertical, PencilLine, Trash2 } from "lucide-react";

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
import type { QuestionnaireTypeManagementEntity } from "@/features/questionnaires/types";

type QuestionnaireTypeManagementTableProps = {
  rows: QuestionnaireTypeManagementEntity[];
  onEdit: (row: QuestionnaireTypeManagementEntity) => void;
  onDelete: (row: QuestionnaireTypeManagementEntity) => void;
};

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function QuestionnaireTypeManagementTable({
  rows,
  onEdit,
  onDelete,
}: QuestionnaireTypeManagementTableProps) {
  return (
    <div className="data-table-wrapper">
      <Table>
        <TableHeader className="data-table-header">
          <TableRow>
            <TableHead className="data-table-head w-[24%]">Name</TableHead>
            <TableHead className="data-table-head w-[18%]">Code</TableHead>
            <TableHead className="data-table-head w-[16%]">Kind</TableHead>
            <TableHead className="data-table-head w-[28%]">Description</TableHead>
            <TableHead className="data-table-head w-[14%]">Created</TableHead>
            <TableHead className="data-table-head w-[10%]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="data-table-row">
              <TableCell className="data-table-cell font-medium">{row.name}</TableCell>
              <TableCell className="data-table-cell font-mono text-xs text-muted-foreground">
                {row.code}
              </TableCell>
              <TableCell className="data-table-cell">
                <Badge
                  variant="ghost"
                  className={row.isSystem ? "badge-status-active" : "badge-status-draft"}
                >
                  {row.isSystem ? "System" : "Custom"}
                </Badge>
              </TableCell>
              <TableCell className="data-table-cell text-muted-foreground">
                {row.description?.trim() ? row.description : "No description"}
              </TableCell>
              <TableCell className="data-table-cell text-muted-foreground">
                {formatCreatedAt(row.createdAt)}
              </TableCell>
              <TableCell className="data-table-cell">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-9 p-0"
                      aria-label={`Actions for ${row.name}`}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(row)}>
                      <PencilLine className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={row.isSystem} onClick={() => onDelete(row)}>
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
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
