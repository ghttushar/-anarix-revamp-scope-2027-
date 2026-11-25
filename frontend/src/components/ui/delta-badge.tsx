import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaBadgeProps {
  value: number; // percentage change
  className?: string;
}

/**
 * A period change: a small tinted pill (gain / risk), as on Signals and the product website. 11px is the type
 * scale's floor, so it stays readable while sitting quietly under the value it describes.
 */
export function DeltaBadge({ value, className }: DeltaBadgeProps) {
  if (value === 0) return null;

  const isPositive = value > 0;

  return (
    <span
      className={cn(
        "mt-0.5 inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-2xs font-medium leading-tight tabular-nums",
        isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
        className
      )}
    >
      {isPositive ? <ArrowUp className="h-2.5 w-2.5" strokeWidth={2.5} /> : <ArrowDown className="h-2.5 w-2.5" strokeWidth={2.5} />}
      {isPositive ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}
