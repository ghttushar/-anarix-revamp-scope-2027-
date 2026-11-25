import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface SegmentItem<V extends string> {
  value: V;
  label: string;
  /** With an icon and `iconOnly`, the label becomes the tooltip. */
  icon?: LucideIcon;
  count?: number;
}

interface Props<V extends string> {
  value: V;
  onChange: (value: V) => void;
  items: SegmentItem<V>[];
  iconOnly?: boolean;
  "aria-label"?: string;
  className?: string;
}

/**
 * A segmented switch (h-8): a table's view switch (Products | Orders) and a chart's type switch (line | bar | area).
 * One look everywhere: a muted track with the selected segment raised on the card color.
 */
export function BarSegmented<V extends string>({ value, onChange, items, iconOnly, className, ...rest }: Props<V>) {
  return (
    <div
      role="radiogroup"
      aria-label={rest["aria-label"]}
      className={cn("inline-flex h-[var(--k-control-h)] shrink-0 items-center gap-0.5 rounded-md bg-track p-0.5", className)}
    >
      {items.map((it) => {
        const on = it.value === value;
        const Icon = it.icon;
        const button: ReactNode = (
          <button
            key={it.value}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={it.label}
            onClick={() => onChange(it.value)}
            className={cn(
              "inline-flex h-[calc(var(--k-control-h)-4px)] items-center justify-center gap-1.5 rounded-[5px] text-xs font-medium transition-colors",
              iconOnly && Icon ? "w-[calc(var(--k-control-h)-4px)]" : "px-2.5",
              on ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {!(iconOnly && Icon) && it.label}
            {it.count !== undefined && (
              <span className={cn("rounded px-1 text-2xs tabular-nums", on ? "bg-muted text-muted-foreground" : "text-muted-foreground/80")}>
                {it.count}
              </span>
            )}
          </button>
        );
        if (!(iconOnly && Icon)) return button;
        return (
          <Tooltip key={it.value}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">{it.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
