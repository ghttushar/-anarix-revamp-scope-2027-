import { useState } from "react";
import { ChevronRight, ChevronsUpDown } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { PnLRow } from "@/types/profitability";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** Each part of the story wears its Profitability mood: sales lilac, cost of goods peach, expenses rose,
 *  orders and units sky, and the bottom line (profit, margin) mint. */
function toneOf(parameter: string): string | null {
  const p = parameter.toLowerCase();
  if (p.includes("profit") || p.includes("margin")) return "pf-tone-mint";
  if (p.includes("cogs")) return "pf-tone-peach";
  if (p.includes("expense")) return "pf-tone-rose";
  if (p.includes("order") || p.includes("unit")) return "pf-tone-sky";
  if (p.includes("sales")) return "pf-tone-lilac";
  return null;
}
const isBottomLine = (parameter: string) => /profit|margin/i.test(parameter) && !/%/.test(parameter);

interface PnLParameterTableProps {
  data: PnLRow[];
  weeks: string[];
  showDeltas?: boolean;
}

export function PnLParameterTable({ data, weeks, showDeltas = false }: PnLParameterTableProps) {
  const { formatCurrency } = useCurrency();
  const formatValue = (value: number | null, isCurrency: boolean = true): string => {
    if (value === null) return "-";
    if (isCurrency) return formatCurrency(value);
    return new Intl.NumberFormat("en-US").format(value);
  };

  const collectExpandableIds = (rows: PnLRow[]): string[] => {
    const ids: string[] = [];
    rows.forEach((row) => {
      if (row.children && row.children.length > 0) {
        ids.push(row.id);
        ids.push(...collectExpandableIds(row.children));
      }
    });
    return ids;
  };

  const allExpandableIds = collectExpandableIds(data);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    data.forEach((row) => {
      if (row.isExpanded) initial.add(row.id);
    });
    return initial;
  });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedRows(new Set(allExpandableIds));
  const collapseAll = () => setExpandedRows(new Set());

  const allExpanded = allExpandableIds.length > 0 && allExpandableIds.every((id) => expandedRows.has(id));

  const renderRow = (row: PnLRow, isCurrency: boolean = true, inherited: string | null = null, childIndex = 0) => {
    const isExpanded = expandedRows.has(row.id);
    const hasChildren = row.children && row.children.length > 0;
    const top = row.indent === 0;
    const tone = top ? toneOf(row.parameter) : inherited;
    const bottomLine = top && isBottomLine(row.parameter);
    // Section heads (and the bottom-line rows) carry their mood as a fill; their children rise in when opened.
    const filled = top && tone && (row.isParent || bottomLine);
    const fig = (v: number | null) => (bottomLine && v !== null ? (v < 0 ? "text-destructive font-semibold" : "text-success font-semibold") : undefined);

    return (
      <>
        <TableRow
          key={row.id}
          style={!top ? { ["--pf-i" as string]: childIndex } : undefined}
          className={cn("group", tone, row.isParent && "font-medium", !top && "pf-rise")}
        >
          <TableCell className={cn("sticky left-0 z-10 transition-colors", filled ? "pf-fill pf-bar" : "bg-card", !filled && tone && top && "pf-bar")}>
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${row.indent * 20}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleRow(row.id)}
                  className="p-0.5 hover:bg-card/70 rounded cursor-pointer"
                >
                  <ChevronRight className={cn("h-3.5 w-3.5 transition-transform duration-200", isExpanded && "rotate-90")} />
                </button>
              ) : (
                <span className="w-4" />
              )}
              {top && tone && <span className="pf-dot" />}
              <span className={cn("text-sm", bottomLine && "font-semibold")}>{row.parameter}</span>
            </div>
          </TableCell>
          {weeks.map((week) => (
            <TableCell key={week} className={cn("text-right text-sm", filled && "pf-fill-soft")}>
              <div className="flex items-center justify-end gap-1">
                <span className={fig(row.weeklyValues[week])}>{formatValue(row.weeklyValues[week], isCurrency)}</span>
                {showDeltas && row.weeklyValues[week] !== null && (
                  <DeltaBadge value={getDelta(row.id, week)} />
                )}
              </div>
            </TableCell>
          ))}
          <TableCell className={cn("text-right font-medium text-sm", filled && "pf-fill-soft")}>
            <div className="flex items-center justify-end gap-1">
              <span className={cn(fig(row.total), filled && !bottomLine && "pf-text")}>{formatValue(row.total, isCurrency)}</span>
              {showDeltas && row.total !== null && (
                <DeltaBadge value={getDelta(row.id, "total")} />
              )}
            </div>
          </TableCell>
        </TableRow>
        {hasChildren &&
          isExpanded &&
          row.children!.map((child, i) =>
            renderRow(child, !child.parameter.toLowerCase().includes("unit"), tone, i)
          )}
      </>
    );
  };

  return (
    <div data-table-frame className="pf-hero rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-card">
              <TableHead className="sticky top-0 left-0 z-20 bg-card min-w-[200px]">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={allExpanded ? collapseAll : expandAll}
                        className="p-0.5 hover:bg-hover rounded cursor-pointer"
                      >
                        <ChevronsUpDown className={cn("h-3.5 w-3.5 transition-transform duration-300", allExpanded && "rotate-180")} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{allExpanded ? "Collapse all" : "Expand all"}</TooltipContent>
                  </Tooltip>
                  <span>Parameter / Date</span>
                </div>
              </TableHead>
              {weeks.map((week) => (
                <TableHead key={week} className="pf-tone-lilac pf-head sticky top-0 z-10 bg-card text-right min-w-[100px] text-xs">
                  {week}
                </TableHead>
              ))}
              <TableHead className="pf-tone-mint pf-head sticky top-0 z-10 bg-card text-right min-w-[120px] font-semibold text-xs">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) =>
              renderRow(row, !row.parameter.toLowerCase().includes("unit"))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
