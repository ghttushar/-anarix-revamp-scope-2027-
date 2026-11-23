/**
 * One color per metric, used by every chart, picker dot and legend in the app. A metric keeps its color everywhere
 * (Ad Spend is the same blue on Campaign Manager, Impact Analysis and Glance). Real color values, not CSS variables,
 * so exports (PNG) and canvases draw them too.
 */
export const METRIC_COLORS = {
  // Advertising
  adSpend: "hsl(229, 65%, 57%)",
  adSales: "hsl(152, 55%, 40%)",
  roas: "hsl(38, 90%, 50%)",
  impressions: "hsl(230, 29%, 66%)",
  clicks: "hsl(199, 78%, 48%)",
  ctr: "hsl(262, 52%, 62%)",
  cpc: "hsl(234, 30%, 30%)",
  acos: "hsl(0, 72%, 56%)",
  orders: "hsl(173, 58%, 39%)",
  units: "hsl(199, 70%, 55%)",
  cvr: "hsl(285, 50%, 58%)",
  aov: "hsl(20, 78%, 55%)",
  // Profitability
  gmv: "hsl(229, 65%, 57%)",
  authSales: "hsl(173, 58%, 39%)",
  netProfit: "hsl(152, 55%, 40%)",
  adCost: "hsl(38, 90%, 50%)",
  cogs: "hsl(262, 52%, 62%)",
  estPayout: "hsl(199, 78%, 48%)",
  returns: "hsl(20, 78%, 55%)",
  cancelled: "hsl(330, 58%, 55%)",
} as const;

export type ColoredMetric = keyof typeof METRIC_COLORS;

/** For series that are not a named metric (brands, products, tiers): pick in this order. */
export const SERIES_COLORS = [
  "hsl(229, 65%, 57%)",
  "hsl(173, 58%, 39%)",
  "hsl(38, 90%, 50%)",
  "hsl(330, 58%, 55%)",
  "hsl(262, 52%, 62%)",
  "hsl(199, 78%, 48%)",
  "hsl(152, 55%, 40%)",
  "hsl(20, 78%, 55%)",
] as const;

/** The most series a chart shows at once; metric pickers cap at this. */
export const MAX_CHART_SERIES = 4;
