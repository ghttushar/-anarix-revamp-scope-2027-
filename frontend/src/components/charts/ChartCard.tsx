import { useState, type ReactNode } from "react";
import { AreaChart, BarChart3, Info, LineChart, Maximize2, ScatterChart } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChip, BarDensity, BarIconButton, CHART_HEIGHT, CHART_TYPE_ORDER, type ChartHeight } from "@/components/bars";
import { cn } from "@/lib/utils";

/**
 * The chart bar: one header for every visualization (components/bars/README.md).
 *
 *   Title · context ⓘ                                [settings…] [chart type ▾]  ⤢
 *
 * The title on the left; everything else is compact and right-aligned: this chart's settings as chips (metrics,
 * frequency, compare…), then the chart type as a dropdown, then Expand, always last. The legend is centred under the
 * plot. Charts draw with the shared theme in ./theme.tsx.
 */

export type ChartKind = (typeof CHART_TYPE_ORDER)[number];

const CHART_KINDS: Record<ChartKind, { label: string; Icon: typeof LineChart }> = {
  line: { label: "Line", Icon: LineChart },
  bar: { label: "Bar", Icon: BarChart3 },
  area: { label: "Area", Icon: AreaChart },
  scatter: { label: "Scatter", Icon: ScatterChart },
};

/** Kept for charts that style Recharts' default tooltip; new charts use ChartTooltip from ./theme. */
export const chartTooltipStyle: React.CSSProperties = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 11,
  boxShadow: "0 4px 12px rgba(16,24,40,0.08)",
};

interface ChartBarProps {
  title: string;
  context?: ReactNode;
  info?: string;
  controls?: ReactNode;
  chartType?: ChartKind;
  onChartTypeChange?: (t: ChartKind) => void;
  chartTypes?: ChartKind[];
  onExpand?: () => void;
  className?: string;
}

/** The header row of a chart. ChartCard draws it for you; use it on its own only for a chart outside a card. */
export function ChartBar({ title, context, info, controls, chartType, onChartTypeChange, chartTypes, onExpand, className }: ChartBarProps) {
  const kinds = (chartTypes ?? []).slice().sort((a, b) => CHART_TYPE_ORDER.indexOf(a) - CHART_TYPE_ORDER.indexOf(b));
  const Current = chartType ? CHART_KINDS[chartType].Icon : null;
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-x-3 gap-y-2", className)} data-chart-bar>
      <div className="flex min-w-0 items-baseline gap-1.5">
        <h3 className="truncate font-heading text-sm font-semibold text-foreground">{title}</h3>
        {context && <span className="truncate text-xs text-muted-foreground">· {context}</span>}
        {info && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label="About this chart" className="self-center text-muted-foreground hover:text-foreground">
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[260px] text-xs">{info}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <BarDensity value="compact">
        <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-1">
          {controls}
          {kinds.length > 1 && chartType && onChartTypeChange && Current && (
            <BarChip
              icon={<Current />}
              value={chartType}
              onChange={(v) => onChartTypeChange(v as ChartKind)}
              options={kinds.map((k) => {
                const { label, Icon } = CHART_KINDS[k];
                return { value: k, label, icon: <Icon /> };
              })}
              align="end"
            />
          )}
          {onExpand && <BarIconButton icon={Maximize2} label="Expand" onClick={onExpand} />}
        </div>
      </BarDensity>
    </div>
  );
}

export interface LegendItem {
  key: string;
  label: string;
  color: string;
  active?: boolean;
}

/** The legend: always under the plot, centred. Click a series to hide or show it when onToggle is given. */
export function ChartLegend({ items, onToggle, className }: { items: LegendItem[]; onToggle?: (key: string) => void; className?: string }) {
  if (!items.length) return null;
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3", className)} data-chart-legend>
      {items.map((it) => {
        const Comp = onToggle ? "button" : "span";
        return (
          <Comp
            key={it.key}
            {...(onToggle ? { type: "button" as const, onClick: () => onToggle(it.key), "aria-pressed": it.active !== false } : {})}
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-opacity",
              onToggle && "hover:text-foreground",
              it.active === false && "opacity-40",
            )}
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: it.color }} />
            {it.label}
          </Comp>
        );
      })}
    </div>
  );
}

interface ChartCardProps extends Omit<ChartBarProps, "onExpand"> {
  /** Plot height: a preset, a number of px, "fill" (grow with the card, at least 240px) or "auto" (the content decides). */
  height?: ChartHeight | number | "fill" | "auto";
  /** Series under the plot. */
  legend?: LegendItem[];
  onLegendToggle?: (key: string) => void;
  /** Anything else under the plot (a gradient scale). Replaces `legend` when both are given. */
  footer?: ReactNode;
  /** Renders the plot. `height` is the px height to draw at ("100%" when the plot fills). */
  children: (size: { height: number | "100%"; expanded: boolean }) => ReactNode;
  bodyClassName?: string;
}

/** A visualization card: the chart bar, the plot, the legend, and an Expand dialog that repeats the same bar. */
export function ChartCard({ height = "md", legend, onLegendToggle, footer, children, className, bodyClassName, ...bar }: ChartCardProps) {
  const [expanded, setExpanded] = useState(false);
  const px = typeof height === "number" ? height : height === "fill" || height === "auto" ? null : CHART_HEIGHT[height];
  const under = footer ?? (legend ? <ChartLegend items={legend} onToggle={onLegendToggle} /> : null);

  return (
    <div className={cn("flex min-w-0 flex-col rounded-lg border border-border bg-card p-4", className)} data-chart-card>
      <ChartBar {...bar} onExpand={() => setExpanded(true)} />
      <div className={cn("mt-3 min-w-0", height === "fill" && "min-h-[240px] flex-1", bodyClassName)} style={px ? { height: px } : undefined}>
        {children({ height: px ?? "100%", expanded: false })}
      </div>
      {under}

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="flex h-[80vh] w-[92vw] max-w-6xl flex-col gap-3">
          <DialogTitle className="sr-only">{bar.title}</DialogTitle>
          <DialogDescription className="sr-only">Expanded chart</DialogDescription>
          <ChartBar {...bar} className="pr-8" />
          <div className="min-h-0 flex-1">{expanded && children({ height: "100%", expanded: true })}</div>
          {under}
        </DialogContent>
      </Dialog>
    </div>
  );
}
