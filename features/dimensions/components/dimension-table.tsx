import { MoreVertical, PencilLine, Power, PowerOff } from "lucide-react";

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
import type { Dimension } from "@/features/dimensions/types";

type DimensionTableProps = {
  rows: Dimension[];
  onEdit: (row: Dimension) => void;
  onToggleStatus: (row: Dimension) => void;
  disableActions?: boolean;
};

export function DimensionTable({
  rows,
  onEdit,
  onToggleStatus,
  disableActions = false,
}: DimensionTableProps) {
  return (
    <div className="data-table-wrapper">
      <Table>
        <TableHeader className="data-table-header">
          <TableRow>
            <TableHead className="data-table-head w-[30%]">Display Name</TableHead>
            <TableHead className="data-table-head w-[15%]">Code</TableHead>
            <TableHead className="data-table-head w-[15%]">Status</TableHead>
            <TableHead className="data-table-head w-[25%]">Type</TableHead>
            <TableHead className="data-table-head w-[15%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="data-table-row">
              <TableCell className="data-table-cell font-medium">{row.displayName}</TableCell>
              <TableCell className="data-table-cell font-mono text-xs text-muted-foreground">
                {row.code}
              </TableCell>
              <TableCell className="data-table-cell">
                <Badge
                  variant="ghost"
                  className={row.active ? "badge-status-active" : "badge-status-deprecated"}
                >
                  {row.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="data-table-cell text-muted-foreground">
                {row.questionnaireType.name}
              </TableCell>
              <TableCell className="data-table-cell">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-9 p-0"
                      disabled={disableActions}
                      aria-label={`Actions for ${row.displayName}`}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled={disableActions} onClick={() => onEdit(row)}>
                      <PencilLine className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={disableActions} onClick={() => onToggleStatus(row)}>
                      {row.active ? (
                        <>
                          <PowerOff className="size-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="size-4" />
                          Activate
                        </>
                      )}
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
