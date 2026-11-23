import { useRef, useState, type ReactNode } from "react";
import { AreaChart, BarChart3, FileSpreadsheet, ImageDown, Info, LineChart, Maximize2, MoreHorizontal, ScatterChart } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarDivider, BarIconButton, BarSegmented, CHART_HEIGHT, CHART_TYPE_ORDER, type ChartHeight } from "@/components/bars";
import { cn } from "@/lib/utils";

/**
 * The chart bar: one header for every visualization, with fixed zones (components/bars/README.md):
 *
 *   Title · context ⓘ          [setting chips… (variable)] | [line bar area] | ⋯ ⤢
 *
 * Title on the left; this chart's settings (metrics, frequency, compare…) as chips in the middle; the chart type
 * switch, the ⋯ menu (Download PNG / CSV) and Expand always last, in that order. The legend sits under the plot.
 */

export type ChartKind = (typeof CHART_TYPE_ORDER)[number];

const CHART_KIND_ITEMS = {
  line: { value: "line", label: "Line", icon: LineChart },
  bar: { value: "bar", label: "Bar", icon: BarChart3 },
  area: { value: "area", label: "Area", icon: AreaChart },
  scatter: { value: "scatter", label: "Scatter", icon: ScatterChart },
} as const;

/** One tooltip look for every chart. */
export const chartTooltipStyle: React.CSSProperties = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 11,
  boxShadow: "0 4px 12px rgba(16,24,40,0.08)",
};

export interface CsvExport {
  filename: string;
  rows: Record<string, string | number | null | undefined>[];
}

interface ChartBarProps {
  title: string;
  context?: ReactNode;
  info?: string;
  controls?: ReactNode;
  chartType?: ChartKind;
  onChartTypeChange?: (t: ChartKind) => void;
  chartTypes?: ChartKind[];
  /** Download PNG (from the plot) — off for charts that are not drawn as SVG. */
  onDownloadPng?: () => void;
  /** Download CSV of the plotted rows. */
  onDownloadCsv?: () => void;
  onExpand?: () => void;
  className?: string;
}

/** The header row of a chart. ChartCard draws it for you; use it on its own only for a chart outside a card. */
export function ChartBar({ title, context, info, controls, chartType, onChartTypeChange, chartTypes, onDownloadPng, onDownloadCsv, onExpand, className }: ChartBarProps) {
  const kinds = (chartTypes ?? []).slice().sort((a, b) => CHART_TYPE_ORDER.indexOf(a) - CHART_TYPE_ORDER.indexOf(b));
  const hasMenu = onDownloadPng || onDownloadCsv;
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
      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
        {controls}
        {kinds.length > 1 && chartType && onChartTypeChange && (
          <>
            {controls && <BarDivider />}
            <BarSegmented
              value={chartType}
              onChange={(v) => onChartTypeChange(v as ChartKind)}
              items={kinds.map((k) => CHART_KIND_ITEMS[k])}
              iconOnly
              aria-label="Chart type"
            />
          </>
        )}
        {(hasMenu || onExpand) && <BarDivider />}
        <div className="flex items-center gap-0.5">
          {hasMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <BarIconButton icon={MoreHorizontal} label="More" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {onDownloadPng && (
                  <DropdownMenuItem className="gap-2 text-xs" onClick={onDownloadPng}>
                    <ImageDown className="h-3.5 w-3.5" /> Download PNG
                  </DropdownMenuItem>
                )}
                {onDownloadCsv && (
                  <DropdownMenuItem className="gap-2 text-xs" onClick={onDownloadCsv}>
                    <FileSpreadsheet className="h-3.5 w-3.5" /> Download CSV
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {onExpand && <BarIconButton icon={Maximize2} label="Expand" onClick={onExpand} />}
        </div>
      </div>
    </div>
  );
}

export interface LegendItem {
  key: string;
  label: string;
  color: string;
  active?: boolean;
}

/** The legend: always under the plot, left-aligned. Click a series to hide or show it when onToggle is given. */
export function ChartLegend({ items, onToggle, className }: { items: LegendItem[]; onToggle?: (key: string) => void; className?: string }) {
  if (!items.length) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 pt-2", className)} data-chart-legend>
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

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "chart";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Download rows as a CSV file. */
export function downloadCsv({ filename, rows }: CsvExport) {
  if (!rows.length) return toast.info("Nothing to export");
  const cols = Array.from(rows.reduce((s, r) => { Object.keys(r).forEach((k) => s.add(k)); return s; }, new Set<string>()));
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8" }), filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

/** Download the first SVG inside `root` as a PNG (2x), with CSS variables and classes resolved to real colors. */
export async function downloadSvgAsPng(root: HTMLElement | null, filename: string) {
  const svg = root?.querySelector<SVGSVGElement>("svg.recharts-surface") ?? root?.querySelector<SVGSVGElement>("svg");
  if (!svg) return toast.info("This chart can't be saved as an image");
  const { width, height } = svg.getBoundingClientRect();
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const src = [svg, ...Array.from(svg.querySelectorAll("*"))];
  const dst = [clone, ...Array.from(clone.querySelectorAll("*"))];
  src.forEach((el, i) => {
    const cs = getComputedStyle(el as Element);
    const d = dst[i] as SVGElement;
    for (const prop of ["fill", "stroke", "stop-color", "opacity", "fill-opacity", "stroke-opacity", "stroke-width", "font-size", "font-family", "font-weight"]) {
      const v = cs.getPropertyValue(prop);
      if (v) d.style.setProperty(prop, v);
    }
  });
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  const data = new XMLSerializer().serializeToString(clone);
  const img = new Image();
  const url = URL.createObjectURL(new Blob([data], { type: "image/svg+xml;charset=utf-8" }));
  await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; img.src = url; });
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = getComputedStyle(root!).backgroundColor || "#ffffff";
  if (ctx.fillStyle === "rgba(0, 0, 0, 0)" || ctx.fillStyle === "#000000") ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  canvas.toBlob((b) => b && triggerDownload(b, filename.endsWith(".png") ? filename : `${filename}.png`), "image/png");
}

interface ChartCardProps extends Omit<ChartBarProps, "onDownloadPng" | "onDownloadCsv" | "onExpand"> {
  /** Plot height: a preset, a number of px, "fill" (grow with the card, at least 240px) or "auto" (the content decides). */
  height?: ChartHeight | number | "fill" | "auto";
  /** Rows for Download CSV. */
  csv?: () => CsvExport;
  /** Offer Download PNG (default true; turn off for plots that are not SVG). */
  png?: boolean;
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
export function ChartCard({ height = "md", csv, png = true, legend, onLegendToggle, footer, children, className, bodyClassName, ...bar }: ChartCardProps) {
  const [expanded, setExpanded] = useState(false);
  const plotRef = useRef<HTMLDivElement>(null);
  const bigRef = useRef<HTMLDivElement>(null);
  const px = typeof height === "number" ? height : height === "fill" || height === "auto" ? null : CHART_HEIGHT[height];
  const name = slug(bar.title);

  const handlers = (ref: React.RefObject<HTMLDivElement>) => ({
    onDownloadPng: png ? () => void downloadSvgAsPng(ref.current, name) : undefined,
    onDownloadCsv: csv ? () => downloadCsv({ ...csv(), filename: csv().filename || name }) : undefined,
  });

  const under = footer ?? (legend ? <ChartLegend items={legend} onToggle={onLegendToggle} /> : null);

  return (
    <div className={cn("flex min-w-0 flex-col rounded-lg border border-border bg-card p-4", className)} data-chart-card>
      <ChartBar {...bar} {...handlers(plotRef)} onExpand={() => setExpanded(true)} />
      <div
        ref={plotRef}
        className={cn("mt-3 min-w-0", height === "fill" && "min-h-[240px] flex-1", bodyClassName)}
        style={px ? { height: px } : undefined}
      >
        {children({ height: px ?? "100%", expanded: false })}
      </div>
      {under}

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="flex h-[80vh] w-[92vw] max-w-6xl flex-col gap-3">
          <DialogTitle className="sr-only">{bar.title}</DialogTitle>
          <DialogDescription className="sr-only">Expanded chart</DialogDescription>
          <ChartBar {...bar} {...handlers(bigRef)} className="pr-8" />
          <div ref={bigRef} className="min-h-0 flex-1">
            {expanded && children({ height: "100%", expanded: true })}
          </div>
          {under}
        </DialogContent>
      </Dialog>
    </div>
  );
}
