import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaBadgeProps {
  value: number; // percentage change
  className?: string;
}

/**
 * A period change: plain small coloured text (gain / risk), no chip, sitting quietly under the value it describes.
 * 11px is the type scale's floor.
 */
export function DeltaBadge({ value, className }: DeltaBadgeProps) {
  if (value === 0) return null;

  const isPositive = value > 0;

  return (
    <span
      className={cn(
        "mt-0.5 inline-flex items-center gap-0.5 text-2xs font-medium leading-tight tabular-nums",
        isPositive ? "text-success" : "text-destructive",
        className
      )}
    >
      {isPositive ? <ArrowUp className="h-2.5 w-2.5" strokeWidth={2.5} /> : <ArrowDown className="h-2.5 w-2.5" strokeWidth={2.5} />}
      {isPositive ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}
