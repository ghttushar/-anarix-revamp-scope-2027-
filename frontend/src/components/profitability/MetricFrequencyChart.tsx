import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { ProfitabilitySummary, TrendDataPoint } from "@/types/profitability";
import { cn } from "@/lib/utils";
import { METRIC_COLORS } from "@/lib/constants/metrics";
import { BarChip } from "@/components/bars";
import { ChartCard } from "@/components/charts/ChartCard";
import { AXIS, CURSOR_BAND, CURSOR_LINE, ChartTooltip, GRID, seriesGradients, VALUE_AXIS, areaSeries, barSeries, compactCurrency, compactNumber, gradientId, lineSeries } from "@/components/charts/theme";

export type MetricKey =
  | "gmv" | "authSales" | "orders" | "units"
  | "adCost" | "netProfit" | "cogs" | "estPayout"
  | "returns" | "cancelled";

export const METRIC_DEFS: { key: MetricKey; label: string; format: "currency" | "number"; color: string }[] = [
  { key: "gmv",        label: "GMV",          format: "currency", color: METRIC_COLORS.gmv },
  { key: "authSales",  label: "Auth Sales",   format: "currency", color: METRIC_COLORS.authSales },
  { key: "netProfit",  label: "Net Profit",   format: "currency", color: METRIC_COLORS.netProfit },
  { key: "adCost",     label: "Ad Cost",      format: "currency", color: METRIC_COLORS.adCost },
  { key: "cogs",       label: "COGS",         format: "currency", color: METRIC_COLORS.cogs },
  { key: "estPayout",  label: "Est. Payout",  format: "currency", color: METRIC_COLORS.estPayout },
  { key: "orders",     label: "Orders",       format: "number",   color: METRIC_COLORS.orders },
  { key: "units",      label: "Units",        format: "number",   color: METRIC_COLORS.units },
  { key: "returns",    label: "Returns",      format: "number",   color: METRIC_COLORS.returns },
  { key: "cancelled",  label: "Cancelled",    format: "number",   color: METRIC_COLORS.cancelled },
];

/** Profitability's mood colours (profit-kit.css): net profit mint, sales lilac, costs peach, fees/ads rose. */
const PF_COLORS: Record<MetricKey, string> = {
  gmv: "hsl(229, 65%, 57%)",
  authSales: "hsl(214, 80%, 58%)",
  netProfit: "hsl(162, 52%, 38%)",
  adCost: "hsl(350, 58%, 56%)",
  cogs: "hsl(33, 80%, 52%)",
  estPayout: "hsl(262, 52%, 62%)",
  orders: "hsl(199, 70%, 50%)",
  units: "hsl(173, 58%, 39%)",
  returns: "hsl(20, 78%, 55%)",
  cancelled: "hsl(330, 52%, 58%)",
};
const colorOf = (m: MetricKey) => PF_COLORS[m];
/** Series draw in one after another. */
const drawIn = (i: number) => ({ isAnimationActive: true, animationDuration: 900, animationBegin: i * 140, animationEasing: "ease-out" as const });

export type Frequency = "daily" | "weekly" | "monthly";

const MAX_METRICS = 4;

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function getValue(s: ProfitabilitySummary, key: MetricKey): number {
  if (key === "cogs") return s.breakdown.cogs;
  return (s as any)[key] ?? 0;
}

function getDelta(curr: number, prev: number) {
  if (!prev) return { value: 0, trend: "neutral" as const };
  const pct = ((curr - prev) / Math.abs(prev)) * 100;
  if (Math.abs(pct) < 0.1) return { value: 0, trend: "neutral" as const };
  return { value: pct, trend: pct > 0 ? ("up" as const) : ("down" as const) };
}

function DeltaPill({ value, trend }: { value: number; trend: "up" | "down" | "neutral" }) {
  if (trend === "neutral")
    return (
      <span className="text-2xs text-muted-foreground inline-flex items-center gap-0.5">
        <Minus className="h-2.5 w-2.5" /> 0%
      </span>
    );
  return (
    <span className={cn("text-2xs font-medium inline-flex items-center gap-0.5", trend === "up" ? "text-success" : "text-destructive")}>
      {trend === "up" ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
      {trend === "up" ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}

interface Props {
  summary: ProfitabilitySummary;
  compareTo: ProfitabilitySummary;
  trendData: TrendDataPoint[];
  selectedMetrics: MetricKey[];
  onSelectedMetricsChange: (next: MetricKey[]) => void;
  frequency: Frequency;
  onFrequencyChange: (f: Frequency) => void;
  formatCurrency: (v: number) => string;
  contextLabel?: string;
}

export function MetricFrequencyChart({
  summary, compareTo, trendData, selectedMetrics, onSelectedMetricsChange,
  frequency, onFrequencyChange, formatCurrency, contextLabel,
}: Props) {
  const [chartView, setChartView] = useState<"area" | "bar" | "line">("area");

  // Re-bucket the trend points based on frequency.
  // Source data has weekly-ish points. We approximate buckets by group size.
  const groupSize = frequency === "daily" ? 1 : frequency === "weekly" ? 1 : 4;
  const xLabel = frequency === "daily" ? "Day" : frequency === "weekly" ? "Week" : "Month";

  // Synthesize per-metric series by scaling the trend's order distribution
  // against the summary's actual metric total.
  const chartData = useMemo(() => {
    if (!trendData.length) return [];

    // Group trend data into buckets
    const buckets: { label: string; weight: number }[] = [];
    for (let i = 0; i < trendData.length; i += groupSize) {
      const slice = trendData.slice(i, i + groupSize);
      const weight = slice.reduce((sum, p) => sum + (p.orders || 0), 0);
      const label = frequency === "monthly"
        ? `${xLabel} ${buckets.length + 1}`
        : (slice[0]?.week ?? `${xLabel} ${buckets.length + 1}`);
      buckets.push({ label, weight });
    }

    const totalWeight = buckets.reduce((s, b) => s + b.weight, 0) || 1;

    return buckets.map((b, idx) => {
      const row: Record<string, any> = { label: b.label };
      const share = b.weight / totalWeight;
      selectedMetrics.forEach((m) => {
        const total = getValue(summary, m);
        row[m] = +(total * share).toFixed(2);
      });
      return row;
    });
  }, [trendData, groupSize, frequency, selectedMetrics, summary, xLabel]);

  const formatValue = (key: MetricKey, val: number) => {
    const def = METRIC_DEFS.find((d) => d.key === key);
    if (def?.format === "currency") return formatCurrency(val);
    return val.toLocaleString();
  };

  const nameOf = (k: string) => METRIC_DEFS.find((d) => d.key === k)?.label ?? k;
  const currencyAxis = selectedMetrics.every((m) => METRIC_DEFS.find((d) => d.key === m)?.format === "currency");

  const renderChart = (height: number | string) => {
    const common = (
      <>
        <CartesianGrid {...GRID} />
        <XAxis {...AXIS} dataKey="label" minTickGap={16} />
        <YAxis {...VALUE_AXIS} tickFormatter={currencyAxis ? compactCurrency : compactNumber} />
        <Tooltip
          cursor={chartView === "bar" ? CURSOR_BAND : CURSOR_LINE}
          content={<ChartTooltip nameOf={nameOf} valueOf={(k, v) => formatValue(k as MetricKey, v)} />}
        />
      </>
    );
    const margin = { top: 8, right: 8, left: 0, bottom: 0 };
    return (
      <ResponsiveContainer width="100%" height={height}>
        {chartView === "bar" ? (
          <BarChart data={chartData} margin={margin} barGap={2}>
            {common}
            {selectedMetrics.map((m, i) => <Bar key={m} dataKey={m} {...barSeries(colorOf(m))} {...drawIn(i)} />)}
          </BarChart>
        ) : chartView === "line" ? (
          <LineChart data={chartData} margin={margin}>
            {common}
            {selectedMetrics.map((m, i) => <Line key={m} dataKey={m} {...lineSeries(colorOf(m))} {...drawIn(i)} />)}
          </LineChart>
        ) : (
          <AreaChart data={chartData} margin={margin}>
            {seriesGradients(selectedMetrics.map((m) => ({ id: gradientId("mfc", m), color: colorOf(m) })))}
            {common}
            {selectedMetrics.map((m, i) => <Area key={m} dataKey={m} {...areaSeries(colorOf(m), gradientId("mfc", m))} {...drawIn(i)} />)}
          </AreaChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <ChartCard
      title="How the money moved"
      context={contextLabel}
      height="fill"
      className="pf-tone-lilac pf-topwash pf-hero pf-rise h-full"
      controls={
        <>
          <BarChip
            multiple
            label="Metrics"
            value={selectedMetrics}
            onChange={(v) => onSelectedMetricsChange(v as MetricKey[])}
            options={METRIC_DEFS.map((d) => ({ value: d.key, label: d.label, color: colorOf(d.key) }))}
            max={MAX_METRICS}
            align="end"
          />
          <BarChip value={frequency} onChange={(v) => onFrequencyChange(v as Frequency)} options={FREQUENCY_OPTIONS} align="end" />
        </>
      }
      chartType={chartView}
      onChartTypeChange={(t) => setChartView(t as typeof chartView)}
      chartTypes={["line", "bar", "area"]}
      legend={selectedMetrics.map((m) => {
        const def = METRIC_DEFS.find((d) => d.key === m)!;
        return { key: m, label: def.label, color: colorOf(m) };
      })}
    >
      {({ height }) =>
        selectedMetrics.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Select at least one metric to display the chart.
          </div>
        ) : (
          renderChart(height)
        )
      }
    </ChartCard>
  );
}
