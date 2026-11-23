import { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { SOVDataPoint } from "@/types/bi";
import { SERIES_COLORS } from "@/lib/constants/metrics";
import { chartTooltipStyle } from "@/components/charts/ChartCard";
import { ChartContainer, ChartType, ChartMetric } from "@/components/charts/ChartContainer";

interface SOVChartProps {
  data: SOVDataPoint[];
  title?: string;
  subtitle?: string;
}

const COLORS = SERIES_COLORS;

export function SOVChart({ data, title = "Share of Voice Trend", subtitle }: SOVChartProps) {
  const [chartType, setChartType] = useState<ChartType>("area");
  const brandNames = data.length > 0 ? Object.keys(data[0].brands) : [];
  const [activeMetrics, setActiveMetrics] = useState<string[]>(brandNames);

  const metrics: ChartMetric[] = brandNames.map((name, i) => ({
    key: name,
    label: name,
    color: COLORS[i % COLORS.length],
    active: activeMetrics.includes(name),
  }));

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const activeBrands = brandNames.filter((b) => activeMetrics.includes(b));

  const commonProps = {
    data,
    margin: { top: 10, right: 10, left: 0, bottom: 0 },
  };

  const axes = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis dataKey="timestamp" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
      <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} tickFormatter={(v) => `${v}%`} />
      <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`${value.toFixed(1)}%`, ""]} />
    </>
  );

  const renderChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "line" ? (
        <LineChart {...commonProps}>
          {axes}
          {activeBrands.map((brand, i) => (
            <Line key={brand} type="monotone" dataKey={`brands.${brand}`} name={brand} stroke={COLORS[brandNames.indexOf(brand) % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
          ))}
        </LineChart>
      ) : chartType === "bar" ? (
        <BarChart {...commonProps}>
          {axes}
          {activeBrands.map((brand) => (
            <Bar key={brand} dataKey={`brands.${brand}`} name={brand} fill={COLORS[brandNames.indexOf(brand) % COLORS.length]} stackId="1" />
          ))}
        </BarChart>
      ) : (
        <AreaChart {...commonProps}>
          {axes}
          {activeBrands.map((brand) => (
            <Area key={brand} type="monotone" dataKey={`brands.${brand}`} name={brand} stackId="1" stroke={COLORS[brandNames.indexOf(brand) % COLORS.length]} fill={COLORS[brandNames.indexOf(brand) % COLORS.length]} fillOpacity={0.6} />
          ))}
        </AreaChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      metrics={metrics}
      onMetricToggle={toggleMetric}
      chartType={chartType}
      onChartTypeChange={setChartType}
      expandedChildren={renderChart(500)}
      legendAll
      csv={() => ({ filename: "share-of-voice", rows: data.map((p) => ({ time: p.timestamp, ...p.brands })) })}
    >
      {renderChart(300)}
    </ChartContainer>
  );
}
