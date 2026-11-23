import { MetricConfig, MetricKey } from "@/types/campaign";

import { METRIC_COLORS } from "./metrics";

// Chart colors locked per metric (one registry for the whole app: ./metrics.ts)
export const CHART_COLORS: Record<MetricKey, string> = {
  adSpend: METRIC_COLORS.adSpend,
  adSales: METRIC_COLORS.adSales,
  roas: METRIC_COLORS.roas,
  impressions: METRIC_COLORS.impressions,
  clicks: METRIC_COLORS.clicks,
  ctr: METRIC_COLORS.ctr,
  cpc: METRIC_COLORS.cpc,
  acos: METRIC_COLORS.acos,
};

export const METRIC_CONFIGS: MetricConfig[] = [
  { key: "adSpend", label: "Ad Spend", color: CHART_COLORS.adSpend, format: "currency", yAxisId: "left" },
  { key: "adSales", label: "Ad Sales", color: CHART_COLORS.adSales, format: "currency", yAxisId: "left" },
  { key: "roas", label: "ROAS", color: CHART_COLORS.roas, format: "decimal", yAxisId: "right" },
  { key: "impressions", label: "Impressions", color: CHART_COLORS.impressions, format: "number", yAxisId: "right" },
  { key: "clicks", label: "Clicks", color: CHART_COLORS.clicks, format: "number", yAxisId: "right" },
  { key: "ctr", label: "CTR", color: CHART_COLORS.ctr, format: "percentage", yAxisId: "right" },
  { key: "cpc", label: "CPC", color: CHART_COLORS.cpc, format: "currency", yAxisId: "right" },
  { key: "acos", label: "ACOS", color: CHART_COLORS.acos, format: "percentage", yAxisId: "right" },
];

export const MAX_VISIBLE_METRICS = 4;

export const DEFAULT_SELECTED_METRICS: MetricKey[] = ["adSpend", "adSales", "roas", "acos"];
