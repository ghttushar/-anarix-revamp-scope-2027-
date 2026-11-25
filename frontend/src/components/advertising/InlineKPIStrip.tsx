import { ArrowDown, ArrowUp, Minus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface KPIItem {
  label: string;
  value: number;
  previousValue: number;
  format: "currency" | "number" | "percentage" | "decimal";
  accentColor?: string;
}

interface AvailableMetric {
  key: string;
  label: string;
  format: "currency" | "number" | "percentage" | "decimal";
}

interface InlineKPIStripProps {
  items: KPIItem[];
  availableMetrics?: AvailableMetric[];
  onMetricChange?: (index: number, metricKey: string) => void;
  /** "cards" (default): tinted tiles with a coloured left bar. "zone": the dense kit row (cells split by dividers, a
   *  colour dot per metric, plain-text deltas), for use inside a kit Workspace zone. */
  variant?: "cards" | "zone";
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case "currency":
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 100000) return `$${(value / 1000).toFixed(0)}K`;
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    case "percentage":
      return `${value.toFixed(2)}%`;
    case "decimal":
      return value.toFixed(2);
    case "number":
    default:
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 100000) return `${(value / 1000).toFixed(0)}K`;
      return new Intl.NumberFormat("en-US").format(value);
  }
}

function formatPrevValue(value: number, format: string): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    case "percentage":
      return `${value.toFixed(2)}%`;
    case "decimal":
      return value.toFixed(2);
    case "number":
    default:
      return new Intl.NumberFormat("en-US").format(value);
  }
}

function calculateDelta(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

const accentDots: Record<string, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  accent: "bg-accent",
};

const accentColors: Record<string, string> = {
  primary: "border-l-primary",
  success: "border-l-success",
  warning: "border-l-warning",
  destructive: "border-l-destructive",
  accent: "border-l-accent",
};

export function InlineKPIStrip({ items, availableMetrics, onMetricChange, variant = "cards" }: InlineKPIStripProps) {
  const isSwappable = !!(availableMetrics && onMetricChange);
  const zone = variant === "zone";

  return (
    <div
      data-inline-kpi-strip
      className={cn("flex overflow-x-auto", zone ? "divide-x divide-border" : "gap-1 rounded-lg bg-card p-1")}
    >
      {items.map((item, index) => {
        const delta = calculateDelta(item.value, item.previousValue);
        const isPositive = delta > 0;
        const isNeutral = delta === 0;
        const colorClass = accentColors[item.accentColor || "primary"] || "border-l-primary";

        const cardContent = (
          <div
            className={cn(
              "flex flex-1 flex-col gap-0.5 min-w-0",
              zone ? "px-4 py-3" : cn("border-l-4 bg-field px-3 py-2.5 first:rounded-l-md last:rounded-r-md", colorClass),
              isSwappable && "cursor-pointer hover:bg-hover transition-colors"
            )}
          >
            <div className="flex items-center justify-between">
              {isSwappable ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-2xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {zone && <span className={cn("mr-0.5 h-1.5 w-1.5 rounded-full", accentDots[item.accentColor || "primary"])} />}
                      {item.label}
                      <ChevronDown className="h-2.5 w-2.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-[240px] overflow-auto">
                    {availableMetrics!.map((metric) => (
                      <DropdownMenuItem
                        key={metric.key}
                        onClick={() => onMetricChange!(index, metric.key)}
                        className="text-xs cursor-pointer"
                      >
                        {metric.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <span className="flex items-center gap-1 text-2xs font-medium uppercase tracking-wider text-muted-foreground">
                  {zone && <span className={cn("mr-0.5 h-1.5 w-1.5 rounded-full", accentDots[item.accentColor || "primary"])} />}
                  {item.label}
                </span>
              )}
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xl font-semibold text-foreground leading-tight">
                {formatValue(item.value, item.format)}
              </span>
              <div
                className={cn(
                  "flex items-center gap-0.5 text-2xs font-medium shrink-0",
                  !zone && "rounded-full px-1.5 py-0.5",
                  isNeutral
                    ? cn("text-muted-foreground", !zone && "bg-muted")
                    : isPositive
                    ? cn("text-success", !zone && "bg-success/10")
                    : cn("text-destructive", !zone && "bg-destructive/10")
                )}
              >
                {isNeutral ? (
                  <Minus className="h-3 w-3" />
                ) : isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span>{Math.abs(delta).toFixed(1)}%</span>
              </div>
            </div>
            <span className="text-2xs text-muted-foreground">
              Prev 7 days: {formatPrevValue(item.previousValue, item.format)}
            </span>
          </div>
        );

        if (isSwappable) {
          return (
            <Tooltip key={`${item.label}-${index}`}>
              <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
              <TooltipContent>Click to change metric</TooltipContent>
            </Tooltip>
          );
        }

        return <div key={`${item.label}-${index}`} className="flex flex-1 min-w-0">{cardContent}</div>;
      })}
    </div>
  );
}