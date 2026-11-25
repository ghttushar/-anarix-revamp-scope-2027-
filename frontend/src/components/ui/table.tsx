import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The app's one table style: "Pulse".
 *  - hairline rows, no column lines, small caps header labels, tabular numbers
 *  - totals live in the header (TableTotalsRow), right under the column labels
 *  - crosshair hover: the hovered cell's column lights up with its row, and the sorted column is tinted
 *    (CSS in index.css under `.pulse-table`; layered as a background-image so opaque sticky cells stay opaque)
 */

const isStickyCell = (cell: HTMLTableCellElement) => cell.classList.contains("sticky") || cell.style.position === "sticky";

/**
 * Sticky columns stack from the left by their real widths. Tables mark cells `sticky` (or pin them with an inline
 * position); the hard-coded `left-[Npx]` offsets they carry assume fixed widths and drift as content, the root font
 * size or pinning change. This measures the sticky header columns and sets every sticky cell's `left` to the summed
 * width of the sticky columns before it, so a totals label spanning the sticky columns pins at 0 with them.
 */
function layoutStickyColumns(table: HTMLTableElement) {
  const headRow = table.tHead?.rows[0] ?? table.rows[0];
  if (!headRow) return;
  const stickyWidth: number[] = []; // per column index: width if that column is sticky, else 0
  let col = 0;
  for (const cell of Array.from(headRow.cells)) {
    const w = isStickyCell(cell) ? cell.getBoundingClientRect().width / cell.colSpan : 0;
    for (let i = 0; i < cell.colSpan; i++) stickyWidth[col + i] = w;
    col += cell.colSpan;
  }
  if (!stickyWidth.some(Boolean)) return;
  const leftOf = (index: number) => stickyWidth.slice(0, index).reduce((sum, w) => sum + (w || 0), 0);
  for (const row of Array.from(table.rows)) {
    let c = 0;
    for (const cell of Array.from(row.cells)) {
      if (isStickyCell(cell)) {
        const left = `${leftOf(c)}px`;
        if (cell.style.left !== left) cell.style.left = left;
      }
      c += cell.colSpan;
    }
  }
}

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTableElement | null>(null);
    const setRef = (node: HTMLTableElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };
    // Re-measure after every render (rows, pinning, edit mode) and whenever the table resizes.
    React.useLayoutEffect(() => {
      if (innerRef.current) layoutStickyColumns(innerRef.current);
    });
    React.useEffect(() => {
      const table = innerRef.current;
      if (!table || typeof ResizeObserver === "undefined") return;
      const ro = new ResizeObserver(() => layoutStickyColumns(table));
      ro.observe(table);
      return () => ro.disconnect();
    }, []);
    return (
      <div className="relative w-full overflow-auto">
        <table ref={setRef} className={cn("pulse-table w-full caption-bottom border-collapse text-xs", className)} {...props} />
      </div>
    );
  },
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("bg-card [&_tr]:border-b", className)} {...props} />,
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-card font-medium [&>tr]:last:border-b-0", className)} {...props} />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("relative border-b border-border/60 transition-colors data-[state=selected]:bg-selected hover:bg-hover", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

/**
 * The header's second row: each column's total (and its change) right under its label, so a table carries its own
 * KPI strip. The first cell holds the label, e.g. "Total (12 campaigns)".
 */
const TableTotalsRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      data-totals
      className={cn(
        "border-b border-border bg-card hover:bg-card",
        // Same size as the body cells (the table's text-xs); medium weight marks it as the total without a jump.
        "[&>td]:bg-card [&>td]:pb-2.5 [&>td]:pt-0 [&>td]:align-top [&>td]:font-medium [&>td]:leading-tight [&>td]:text-foreground",
        "[&>td:first-child]:pt-0.5",
        className,
      )}
      {...props}
    />
  ),
);
TableTotalsRow.displayName = "TableTotalsRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-10 px-2 py-2 first:pl-3 last:pr-3 text-left align-middle text-caption font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-2",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("px-2 py-2.5 first:pl-3 last:pr-3 align-middle whitespace-nowrap tabular-nums [&:has([role=checkbox])]:pr-2", className)} {...props} />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  ),
);
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableTotalsRow, TableCell, TableCaption };
