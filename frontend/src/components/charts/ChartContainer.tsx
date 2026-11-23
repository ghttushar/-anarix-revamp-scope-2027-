import type { ReactNode } from "react";
import { BarChip } from "@/components/bars";
import { ChartCard, type ChartKind, type CsvExport } from "./ChartCard";

export type ChartType = "line" | "bar" | "area" | "pie";

export interface ChartMetric {
  key: string;
  label: string;
  color: string;
  active: boolean;
}

interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  metrics?: ChartMetric[];
  onMetricToggle?: (key: string) => void;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  availableChartTypes?: ChartType[];
  children: ReactNode;
  expandedChildren?: ReactNode;
  /** More settings for the chart bar's variable slot (chips). */
  extraControls?: ReactNode;
  /** List every series in the legend (inactive ones dimmed), not only the active ones. */
  legendAll?: boolean;
  csv?: () => CsvExport;
  /** Plot height in px (the children draw at this height). */
  height?: number;
  className?: string;
}

/**
 * A chart with a metric picker, on the shared ChartCard (the app's one chart bar). Kept for the charts written
 * against this API; new charts use ChartCard directly.
 */
export function ChartContainer({
  title = "Chart",
  subtitle,
  metrics,
  onMetricToggle,
  chartType,
  onChartTypeChange,
  availableChartTypes = ["line", "bar", "area"],
  children,
  expandedChildren,
  extraControls,
  legendAll,
  csv,
  height = 300,
  className,
}: ChartContainerProps) {
  const active = (metrics ?? []).filter((m) => m.active).map((m) => m.key);

  const controls = (
    <>
      {extraControls}
      {metrics && metrics.length > 0 && onMetricToggle && (
        <BarChip
          multiple
          label="Metrics"
          value={active}
          options={metrics.map((m) => ({ value: m.key, label: m.label, color: m.color }))}
          onChange={(next) => {
            const changed = next.find((k) => !active.includes(k)) ?? active.find((k) => !next.includes(k));
            if (changed) onMetricToggle(changed);
          }}
          summary={(sel) => `${sel.length}/${metrics.length}`}
          align="end"
        />
      )}
    </>
  );

  const legend = (metrics ?? [])
    .filter((m) => legendAll || m.active)
    .map((m) => ({ key: m.key, label: m.label, color: m.color, active: m.active }));

  return (
    <ChartCard
      title={title}
      context={subtitle}
      controls={controls}
      chartType={chartType === "pie" ? undefined : (chartType as ChartKind)}
      onChartTypeChange={(t) => onChartTypeChange(t as ChartType)}
      chartTypes={availableChartTypes.filter((t) => t !== "pie") as ChartKind[]}
      legend={legend}
      onLegendToggle={onMetricToggle}
      csv={csv}
      height={height}
      className={className}
    >
      {({ expanded }) => (expanded ? expandedChildren ?? children : children)}
    </ChartCard>
  );
}
