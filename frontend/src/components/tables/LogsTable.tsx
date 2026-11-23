import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { SortableTableHead, getSortHandler } from "@/components/tables/SortableTableHead";
import { TablePagination } from "@/components/tables/TablePagination";
import LogViewLink, { breakable } from "@legacy/app/components/page-components/logs-details/logs-change-cell";
import { LOG_COLUMN_TIPS, logActionLabel } from "@legacy/constants/table-columns/logs-table-colmns.constant";
import { DATE_FORMAT_17 } from "@legacy/constants/datetime.constants";
import { LOG_ENTITY_TYPES, LOG_SOURCE_LABELS } from "@legacy/constants/logs.constants";
import type { ILogsData } from "@legacy/interfaces/logs/logs.interface";
import { getTitleCaseString } from "@legacy/utils";
import { convertUtcToTimezoneDate } from "@legacy/utils/datetime.utils";
import { cn } from "@/lib/utils";

interface LogsTableProps {
  rows: ILogsData[];
  isLoading?: boolean;
}

const dash = (value?: string | null) => (value ? value : "-");
const timeOf = (r: ILogsData) => r.timestamp || r.changedAt;

/**
 * The change log, drawn like the rest of this app's tables (bordered card, muted header row, sortable head,
 * shared pagination). Its content comes from anarix-ui's Logs page: the same columns, labels and View links.
 */
export function LogsTable({ rows, isLoading = false }: LogsTableProps) {
  const [sortField, setSortField] = useState<string | null>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const sorted = useMemo(() => {
    if (sortField !== "timestamp") return rows;
    const time = (r: ILogsData) => new Date(timeOf(r) ?? 0).getTime();
    return [...rows].sort((a, b) => (sortDirection === "asc" ? time(a) - time(b) : time(b) - time(a)));
  }, [rows, sortField, sortDirection]);

  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);
  const onSort = getSortHandler(sortField, setSortField, sortDirection, (d) => { setSortDirection(d); setPage(1); });
  const head = (label: string) => <span title={LOG_COLUMN_TIPS[label]}>{label}</span>;
  const plain = { sortField: null, sortDirection: "asc" as const, onSort: undefined };

  return (
    <div className="np-app rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <tr className="bg-muted/30 hover:bg-muted/30">
            <SortableTableHead field="entity" isFixed className="min-w-[220px]" {...plain}>{head("Entity")}</SortableTableHead>
            <SortableTableHead field="entityType" className="min-w-[130px]" {...plain}>{head("Entity Type")}</SortableTableHead>
            <SortableTableHead field="service" className="min-w-[110px]" {...plain}>{head("Service")}</SortableTableHead>
            <SortableTableHead field="changes" className="min-w-[240px]" {...plain}>{head("Changes")}</SortableTableHead>
            <SortableTableHead field="from" className="min-w-[180px]" {...plain}>{head("From")}</SortableTableHead>
            <SortableTableHead field="to" className="min-w-[180px]" {...plain}>{head("To")}</SortableTableHead>
            <SortableTableHead field="through" className="min-w-[180px]" {...plain}>{head("Through")}</SortableTableHead>
            <SortableTableHead field="user" className="min-w-[140px]" {...plain}>{head("User")}</SortableTableHead>
            <SortableTableHead field="timestamp" className="min-w-[150px]" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>
              {head("Date & Time")}
            </SortableTableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }, (_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell colSpan={9}><div className="h-4 w-full animate-pulse rounded bg-muted" /></TableCell>
              </TableRow>
            ))
          ) : pageRows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">No logs for this period.</TableCell>
            </TableRow>
          ) : (
            pageRows.map((r, i) => {
              const name = r.entityName || r.entityId;
              const label = logActionLabel(r);
              const showValues = r.action !== "DELETE";
              const from = r.previousValue || r.from;
              const to = r.value || r.to;
              const time = timeOf(r);
              const [date, clock] = time
                ? convertUtcToTimezoneDate(time, DATE_FORMAT_17).split("|").map((part: string) => part.trim())
                : [null, null];
              return (
                <TableRow key={`${(page - 1) * pageSize + i}-${time ?? ""}`} className="align-top">
                  <TableCell>
                    <div className="font-medium text-foreground">{dash(name)}</div>
                    {r.entityId && r.entityId !== name && <div className="mt-0.5 text-xs text-muted-foreground">{r.entityId}</div>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.entityType ? LOG_ENTITY_TYPES[r.entityType] ?? getTitleCaseString(r.entityType) : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.service ? getTitleCaseString(r.service) : "-"}</TableCell>
                  <TableCell>
                    <div className="text-foreground" title={label}>{label}</div>
                    <div className="mt-0.5 empty:hidden">
                      <LogViewLink data={r} className="text-xs font-medium text-primary hover:underline cursor-pointer" />
                    </div>
                  </TableCell>
                  <TableCell className={cn("max-w-[220px] break-words", showValues && from ? "font-medium text-foreground" : "text-muted-foreground")}>
                    {showValues && from ? breakable(String(from)) : "-"}
                  </TableCell>
                  <TableCell className={cn("max-w-[220px] break-words", showValues && to ? "font-medium text-foreground" : "text-muted-foreground")}>
                    {showValues && to ? breakable(String(to)) : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.editSource ? LOG_SOURCE_LABELS[r.editSource] ?? getTitleCaseString(r.editSource) : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{dash(r.userName || r.userId)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {date ? (
                      <>
                        <div className="tabular-nums text-foreground">{date}</div>
                        {clock && <div className="mt-0.5 text-xs tabular-nums text-muted-foreground">{clock}</div>}
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={sorted.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
