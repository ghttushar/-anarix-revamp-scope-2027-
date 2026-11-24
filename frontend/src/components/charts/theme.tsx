import type { ReactNode } from "react";

/**
 * One look for every chart in the app (Recharts):
 *  - quiet axes: no axis or tick lines, small muted labels
 *  - horizontal-only dashed grid
 *  - smooth 2px lines without dots (a ringed dot only on hover)
 *  - areas filled with a soft top-to-bottom gradient
 *  - rounded, slim bars
 *  - one tooltip card (ChartTooltip) and a dashed hover guide
 * Spread these into the Recharts components: <XAxis {...AXIS} dataKey="date" />, <Line {...lineSeries(color)} … />.
 */

export const AXIS = {
  tick: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
  axisLine: false,
  tickLine: false,
  tickMargin: 8,
} as const;

/** The value axis: same look, a little narrower. */
export const VALUE_AXIS = { ...AXIS, width: 48 } as const;

export const GRID = {
  vertical: false,
  stroke: "hsl(var(--border))",
  strokeDasharray: "4 4",
} as const;

/** The hover guide for line and area charts (pass to <Tooltip cursor={…} />). */
export const CURSOR_LINE = { stroke: "hsl(var(--muted-foreground))", strokeOpacity: 0.4, strokeWidth: 1, strokeDasharray: "4 4" };
/** The hover band for bar charts. */
export const CURSOR_BAND = { fill: "hsl(var(--muted))", fillOpacity: 0.6 };

export const lineSeries = (color: string) => ({
  type: "monotone" as const,
  stroke: color,
  strokeWidth: 2,
  dot: false as const,
  activeDot: { r: 4, strokeWidth: 2, stroke: "hsl(var(--card))", fill: color },
});

/** Pair with <SeriesGradients> (same id). */
export const areaSeries = (color: string, gradientId: string) => ({
  ...lineSeries(color),
  fill: `url(#${gradientId})`,
  fillOpacity: 1,
});

export const barSeries = (color: string) => ({
  fill: color,
  radius: [4, 4, 0, 0] as [number, number, number, number],
  maxBarSize: 22,
});

/** Soft top-to-bottom fills for area series. Call it inside the chart: <AreaChart>{seriesGradients([...])}…</AreaChart>.
 *  (A plain <defs> element: Recharts drops custom child components, so this is a function, not a component.) */
export function seriesGradients(series: { id: string; color: string }[]) {
  return (
    <defs>
      {series.map((s) => (
        <linearGradient key={s.id} id={s.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={s.color} stopOpacity={0} />
        </linearGradient>
      ))}
    </defs>
  );
}

/** A safe gradient id from a series key. */
export const gradientId = (scope: string, key: string) => `grad-${scope}-${key}`.replace(/[^a-zA-Z0-9_-]/g, "_");

const compactFmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
/** 1.2k, 34k, 1.5M — for value axes. */
export const compactNumber = (v: number) => compactFmt.format(v);
/** $1.2k, $34k — for currency value axes. */
export const compactCurrency = (v: number) => `${v < 0 ? "-" : ""}$${compactFmt.format(Math.abs(v))}`;

interface TooltipEntry {
  dataKey?: string | number;
  name?: string | number;
  value?: number | string;
  color?: string;
  stroke?: string;
  fill?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: ReactNode;
  /** The series' display name from its key (dataKey or name). */
  nameOf?: (key: string) => string;
  /** The series' display value. */
  valueOf?: (key: string, value: number) => ReactNode;
  /** The header (the x value), e.g. a formatted date. */
  labelOf?: (label: ReactNode) => ReactNode;
  /** A footer line under the rows. */
  footer?: ReactNode;
}

/** The one tooltip card. Pass as <Tooltip content={<ChartTooltip nameOf={…} valueOf={…} />} />. */
export function ChartTooltip({ active, payload, label, nameOf, valueOf, labelOf, footer }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[160px] rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">{labelOf ? labelOf(label) : label}</p>
      <div className="space-y-1">
        {payload.map((p, i) => {
          const key = String(p.dataKey ?? p.name ?? i);
          const color = (typeof p.color === "string" && !p.color.startsWith("url(") ? p.color : undefined) ?? p.stroke ?? p.fill;
          return (
            <div key={key + i} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
                {nameOf ? nameOf(String(p.name ?? key)) : String(p.name ?? key)}
              </span>
              <span className="font-medium tabular-nums text-foreground">
                {valueOf && typeof p.value === "number" ? valueOf(key, p.value) : String(p.value ?? "—")}
              </span>
            </div>
          );
        })}
      </div>
      {footer && <div className="mt-1.5 border-t border-border pt-1.5">{footer}</div>}
    </div>
  );
}
