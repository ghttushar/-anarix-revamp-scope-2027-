/**
 * The three app-wide bars share one set of rules (see ./README.md):
 *  - PageBar (page level metric bar), under every page heading
 *  - DataTableToolbar, above every table
 *  - ChartCard's bar, on top of every chart
 *
 * Constant controls sit at fixed ends and never move; variable controls go in the middle slot as dropdown chips.
 * Every control in a bar is h-8 (2rem: 36px at this app's 18px root).
 */

/** Height of every control inside a bar (chips, icon buttons, segmented controls, primary buttons): Tailwind h-8. */
export const BAR_CONTROL_HEIGHT = "2rem";

/** The one style every dropdown chip in every bar uses. */
export const BAR_CHIP_CLASS =
  "inline-flex h-8 max-w-full items-center gap-1.5 rounded-md border border-control-border bg-control px-2.5 text-xs whitespace-nowrap transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-selected disabled:pointer-events-none disabled:opacity-50";

/**
 * The fixed order of the table toolbar's icon actions, grouped. A table only switches actions on or off; it never
 * reorders them, so the same icon is always in the same place on every table.
 */
export const TABLE_TOOLBAR_ORDER = [
  ["edit"],
  ["delta", "sort", "filter", "columns"],
  ["upload", "export"],
] as const;

/** The fixed order of chart types in a chart bar's type switch. */
export const CHART_TYPE_ORDER = ["line", "bar", "area", "scatter"] as const;

/** Chart heights: pick one of these instead of a one-off number. */
export const CHART_HEIGHT = { sm: 240, md: 300, lg: 400 } as const;
export type ChartHeight = keyof typeof CHART_HEIGHT;
