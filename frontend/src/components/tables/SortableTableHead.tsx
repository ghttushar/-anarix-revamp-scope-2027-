import { ReactNode, CSSProperties, useState } from "react";
import { TableHead } from "@/components/ui/table";
import { ArrowUp, ArrowDown, ArrowUpDown, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MAX_PINNED_COLUMNS = 3;

interface SortableTableHeadProps {
  children: ReactNode;
  field: string;
  pinnedColumns?: Set<string>;
  onPinToggle?: (field: string) => void;
  className?: string;
  align?: "left" | "right" | "center";
  isFixed?: boolean;
  style?: CSSProperties;
  sortField?: string | null;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}

export function SortableTableHead({
  children,
  field,
  pinnedColumns,
  onPinToggle,
  className,
  align = "left",
  isFixed = false,
  style,
  sortField,
  sortDirection,
  onSort,
}: SortableTableHeadProps) {
  const isPinned = pinnedColumns?.has(field) ?? false;
  const isSorted = sortField === field;

  const sortButton = onSort && (
    <button
      onClick={(e) => { e.stopPropagation(); onSort(field); }}
      className={cn(
        "shrink-0 cursor-pointer p-0.5 rounded hover:bg-hover transition-colors",
        isSorted ? "opacity-100" : "opacity-40 hover:opacity-80"
      )}
      title={isSorted ? (sortDirection === "asc" ? "Sort descending" : "Clear sort") : "Sort ascending"}
    >
      {isSorted ? (
        sortDirection === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5 text-primary" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 text-primary" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5" />
      )}
    </button>
  );

  // Pin icon — only on non-fixed columns when onPinToggle is provided
  const pinButton = !isFixed && onPinToggle && (
    <button
      onClick={(e) => { e.stopPropagation(); onPinToggle(field); }}
      className={cn(
        "shrink-0 cursor-pointer p-0.5 rounded transition-all",
        isPinned
          ? "text-primary opacity-100 hover:bg-primary/10"
          : "opacity-40 hover:!opacity-80 hover:bg-hover text-muted-foreground"
      )}
      title={isPinned ? "Unpin column" : "Pin column"}
    >
      <Pin className={cn("h-3.5 w-3.5", isPinned && "fill-primary")} />
    </button>
  );

  // Active controls (sorted / pinned) sit in the row. Inactive ones take no width: they float over the cell's
  // free side on hover, so a column is only as wide as its label and values.
  const idleSort = onSort && !isSorted ? sortButton : null;
  const idlePin = pinButton && !isPinned ? pinButton : null;

  return (
    <TableHead
      className={cn("group/sort relative select-none", isSorted && "text-primary", className)}
      style={style}
      aria-sort={isSorted ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
    >
      <div
        className={cn(
          "flex items-center gap-1",
          align === "right" && "justify-end",
          align === "center" && "justify-center"
        )}
      >
        {isSorted && sortButton}
        <span>{children}</span>
        {isPinned && pinButton}
      </div>
      {(idleSort || idlePin) && (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 flex items-center gap-0.5 bg-card opacity-0 transition-opacity group-hover/sort:pointer-events-auto group-hover/sort:opacity-100",
            align === "right" ? "left-1" : "right-1"
          )}
        >
          {idleSort}
          {idlePin}
        </div>
      )}
    </TableHead>
  );
}

// Shared pin style utility
export function getPinnedStyle(
  field: string,
  pinnedColumns: Set<string>,
  allFields: string[],
  fixedOffset: number = 0,
  columnWidth: number = 150
): CSSProperties | undefined {
  if (!pinnedColumns.has(field)) return undefined;
  const pinnedFields = allFields.filter(f => pinnedColumns.has(f));
  const index = pinnedFields.indexOf(field);
  if (index === -1) return undefined;
  return {
    position: 'sticky' as const,
    left: fixedOffset + index * columnWidth,
    zIndex: 10,
  };
}

// Hook for pin state management
export function usePinning(allFields: string[], fixedOffset: number = 0, columnWidth: number = 150) {
  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(new Set());
  const handlePinToggle = (field: string) => {
    setPinnedColumns(prev => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
      } else {
        if (next.size >= MAX_PINNED_COLUMNS) {
          toast.warning(`You can pin up to ${MAX_PINNED_COLUMNS} columns. Unpin one to add another.`);
          return prev;
        }
        next.add(field);
      }
      return next;
    });
  };
  const ps = (field: string): CSSProperties | undefined =>
    getPinnedStyle(field, pinnedColumns, allFields, fixedOffset, columnWidth);
  const pc = (field: string, isHeader: boolean = false): string => {
    if (!pinnedColumns.has(field)) return "";
    return isHeader ? "bg-card" : "bg-card group-hover:bg-hover transition-colors";
  };
  return { pinnedColumns, handlePinToggle, ps, pc };
}

// Reusable sort hook logic
export function useSortState<T = string>(defaultField: T | null = null) {
  return {
    defaultSortField: defaultField,
    defaultSortDirection: "asc" as const,
  };
}

export function getSortHandler(
  sortField: string | null,
  setSortField: (f: string | null) => void,
  sortDirection: "asc" | "desc",
  setSortDirection: (d: "asc" | "desc") => void
) {
  return (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection("asc");
      } else {
        setSortDirection("desc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
}

export function sortData<T>(data: T[], sortField: string | null, sortDirection: "asc" | "desc"): T[] {
  if (!sortField) return data;
  return [...data].sort((a, b) => {
    const aVal = (a as any)[sortField];
    const bVal = (b as any)[sortField];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });
}
