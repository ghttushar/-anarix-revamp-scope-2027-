import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ProfitabilityProduct } from "@/types/profitability";
import { SERIES_COLORS } from "@/lib/constants/metrics";
import { BarChip } from "@/components/bars";
import { ChartBar, ChartLegend, type ChartKind } from "@/components/charts/ChartCard";
import { AXIS, CURSOR_BAND, CURSOR_LINE, ChartTooltip, GRID, seriesGradients, VALUE_AXIS, areaSeries, barSeries, compactCurrency, gradientId, lineSeries } from "@/components/charts/theme";
import { ChartType } from "@/components/charts/ChartContainer";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductTrendsModalProps {
  product: ProfitabilityProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const METRICS_OPTIONS = [
  { key: "orderSales", label: "Order Sales", color: SERIES_COLORS[0] },
  { key: "totalSales", label: "Total Sales", color: SERIES_COLORS[1] },
  { key: "commission", label: "Commission on Product", color: SERIES_COLORS[2] },
];

export function ProductTrendsModal({ product, isOpen, onClose }: ProductTrendsModalProps) {
  const { formatCurrency } = useCurrency();
  const [frequency, setFrequency] = useState("weekly");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["orderSales", "totalSales"]);
  const [chartType, setChartType] = useState<ChartType>("line");
  const plotRef = useRef<HTMLDivElement>(null);

  if (!product) return null;

  const weeklyData = product.weeklyData || {};
  const chartData = Object.entries(weeklyData).map(([week, value]) => ({
    week,
    orderSales: value,
    totalSales: value * 1.08,
    commission: value * 0.15,
  }));

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  const activeOptions = METRICS_OPTIONS.filter((m) => selectedMetrics.includes(m.key));

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
  };

  const axes = (
    <>
      <CartesianGrid {...GRID} />
      <XAxis {...AXIS} dataKey="week" minTickGap={16} />
      <YAxis {...VALUE_AXIS} tickFormatter={compactCurrency} />
    </>
  );
  const tip = (bar?: boolean) => (
    <Tooltip cursor={bar ? CURSOR_BAND : CURSOR_LINE} content={<ChartTooltip valueOf={(_, v) => formatCurrency(v)} />} />
  );
  const margin = { top: 8, right: 4, left: 0, bottom: 0 };
  const renderChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      {chartType === "bar" ? (
        <BarChart data={chartData} margin={margin} barGap={2}>
          {axes}
          {tip(true)}
          {activeOptions.map((m) => <Bar key={m.key} dataKey={m.key} name={m.label} {...barSeries(m.color)} />)}
        </BarChart>
      ) : chartType === "area" ? (
        <AreaChart data={chartData} margin={margin}>
          {seriesGradients(activeOptions.map((m) => ({ id: gradientId("ptm", m.key), color: m.color })))}
          {axes}
          {tip()}
          {activeOptions.map((m) => <Area key={m.key} dataKey={m.key} name={m.label} {...areaSeries(m.color, gradientId("ptm", m.key))} />)}
        </AreaChart>
      ) : (
        <LineChart data={chartData} margin={margin}>
          {axes}
          {tip()}
          {activeOptions.map((m) => <Line key={m.key} dataKey={m.key} name={m.label} {...lineSeries(m.color)} />)}
        </LineChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-base">Product Trends</DialogTitle>
          <DialogDescription className="sr-only">View product trends over time</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Product info */}
          <div className="flex items-center gap-3">
            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md border border-border object-cover flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm line-clamp-1">{product.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{product.itemId}</span><span>•</span><span>{product.sku}</span><span>•</span><span>{formatCurrency(product.price)}</span>
              </div>
            </div>
          </div>

          {/* The shared chart bar: settings as chips, then the type switch and the ⋯ menu. */}
          <ChartBar
            title="Trend"
            controls={
              <>
                <BarChip
                  multiple
                  label="Metrics"
                  value={selectedMetrics}
                  onChange={setSelectedMetrics}
                  options={METRICS_OPTIONS.map((m) => ({ value: m.key, label: m.label, color: m.color }))}
                  align="end"
                />
                <BarChip
                  value={frequency}
                  onChange={setFrequency}
                  options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"].map((f) => ({ value: f.toLowerCase(), label: f }))}
                  align="end"
                />
              </>
            }
            chartType={chartType as ChartKind}
            onChartTypeChange={(k) => setChartType(k as ChartType)}
            chartTypes={["line", "bar", "area"]}
          />

          <div>
            <div ref={plotRef} className="h-[260px]">
              {renderChart()}
            </div>
            <ChartLegend items={activeOptions.map((m) => ({ key: m.key, label: m.label, color: m.color }))} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
