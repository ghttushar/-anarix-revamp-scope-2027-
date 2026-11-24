import { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { SOVDataPoint } from "@/types/bi";
import { SERIES_COLORS } from "@/lib/constants/metrics";
import { AXIS, CURSOR_BAND, CURSOR_LINE, ChartTooltip, GRID, VALUE_AXIS, lineSeries } from "@/components/charts/theme";
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
    margin: { top: 8, right: 4, left: 0, bottom: 0 },
  };

  const color = (brand: string) => COLORS[brandNames.indexOf(brand) % COLORS.length];
  const axes = (
    <>
      <CartesianGrid {...GRID} />
      <XAxis {...AXIS} dataKey="timestamp" minTickGap={16} />
      <YAxis {...VALUE_AXIS} tickFormatter={(v) => `${v}%`} />
    </>
  );
  const tip = (bar?: boolean) => (
    <Tooltip
      cursor={bar ? CURSOR_BAND : CURSOR_LINE}
      content={<ChartTooltip nameOf={(k) => k.replace(/^brands\./, "")} valueOf={(_, v) => `${v.toFixed(1)}%`} />}
    />
  );

  const renderChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "line" ? (
        <LineChart {...commonProps}>
          {axes}
          {tip()}
          {activeBrands.map((brand) => <Line key={brand} dataKey={`brands.${brand}`} name={brand} {...lineSeries(color(brand))} />)}
        </LineChart>
      ) : chartType === "bar" ? (
        <BarChart {...commonProps}>
          {axes}
          {tip(true)}
          {activeBrands.map((brand, i) => (
            <Bar key={brand} dataKey={`brands.${brand}`} name={brand} stackId="1" fill={color(brand)} maxBarSize={28}
              radius={i === activeBrands.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
          ))}
        </BarChart>
      ) : (
        <AreaChart {...commonProps}>
          {axes}
          {tip()}
          {activeBrands.map((brand) => (
            <Area key={brand} dataKey={`brands.${brand}`} name={brand} stackId="1" {...lineSeries(color(brand))} strokeWidth={1.5} fill={color(brand)} fillOpacity={0.22} />
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
    >
      {renderChart(300)}
    </ChartContainer>
  );
}
