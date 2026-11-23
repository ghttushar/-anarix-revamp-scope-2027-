import { METRIC_COLORS } from "@/lib/constants/metrics";
import { BarChip } from "@/components/bars";
import type { ImpactMetricKey } from "@/lib/utils/impactSeries";

export interface ImpactMetricOption {
  key: ImpactMetricKey | string;
  label: string;
  color: string;
  available: boolean; // true if mock data carries this metric
}

export const IMPACT_METRIC_OPTIONS: ImpactMetricOption[] = [
  { key: "impressions", label: "Impressions", color: METRIC_COLORS.impressions, available: true },
  { key: "clicks",      label: "Clicks",      color: METRIC_COLORS.clicks, available: true },
  { key: "ctr",         label: "CTR",         color: METRIC_COLORS.ctr, available: true },
  { key: "adSpend",     label: "Ad Spend",    color: METRIC_COLORS.adSpend, available: true },
  { key: "adSales",     label: "Ad Sales",    color: METRIC_COLORS.adSales, available: true },
  { key: "roas",        label: "ROAS",        color: METRIC_COLORS.roas,  available: true },
  { key: "acos",        label: "ACOS",        color: METRIC_COLORS.acos,   available: true },
  { key: "orders",      label: "Orders",      color: METRIC_COLORS.orders, available: false },
  { key: "units",       label: "Units",       color: METRIC_COLORS.units, available: false },
  { key: "cpc",         label: "CPC",         color: METRIC_COLORS.cpc, available: false },
  { key: "cvr",         label: "CVR",         color: METRIC_COLORS.cvr, available: false },
  { key: "aov",         label: "AOV",         color: METRIC_COLORS.aov,  available: false },
];

export const MAX_IMPACT_METRICS = 4;

interface Props {
  selected: ImpactMetricKey[];
  onChange: (next: ImpactMetricKey[]) => void;
}

/** The Impact metric picker: a chip in the chart bar (up to ${MAX_IMPACT_METRICS}; metrics without data yet are listed as coming soon). */
export function ImpactMetricMultiSelect({ selected, onChange }: Props) {
  return (
    <BarChip
      multiple
      label="Metrics"
      value={selected}
      onChange={(v) => onChange(v as ImpactMetricKey[])}
      max={MAX_IMPACT_METRICS}
      align="end"
      options={IMPACT_METRIC_OPTIONS.map((o) => ({
        value: o.key as string,
        label: o.label,
        color: o.color,
        disabled: !o.available,
        description: o.available ? undefined : "Coming soon",
      }))}
    />
  );
}
