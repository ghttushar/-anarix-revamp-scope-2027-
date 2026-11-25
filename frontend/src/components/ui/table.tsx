import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The app's one table style: "Pulse".
 *  - hairline rows, no column lines, small caps header labels, tabular numbers
 *  - totals live in the header (TableTotalsRow), right under the column labels
 *  - crosshair hover: the hovered cell's column lights up with its row, and the sorted column is tinted
 *    (CSS in index.css under `.pulse-table`; layered as a background-image so opaque sticky cells stay opaque)
 */

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("pulse-table w-full caption-bottom border-collapse text-xs", className)} {...props} />
    </div>
  ),
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
      className={cn("relative border-b border-border/60 transition-colors data-[state=selected]:bg-primary/5 hover:bg-muted/50", className)}
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
        "[&>td]:bg-card [&>td]:pb-2.5 [&>td]:pt-0 [&>td]:align-top [&>td]:text-sm [&>td]:font-semibold [&>td]:leading-tight [&>td]:text-foreground",
        "[&>td:first-child]:pt-0.5 [&>td:first-child]:text-2xs [&>td:first-child]:font-medium [&>td:first-child]:text-muted-foreground",
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
        "h-10 px-4 py-2 text-left align-middle text-caption font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("px-4 py-2.5 align-middle whitespace-nowrap tabular-nums [&:has([role=checkbox])]:pr-0", className)} {...props} />
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
