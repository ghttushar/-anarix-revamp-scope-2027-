import { forwardRef, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: LucideIcon;
  /** The action's name: the tooltip and the accessible label. */
  label: string;
  /** Extra tooltip line, e.g. a shortcut or "3 filters applied". */
  hint?: ReactNode;
  /** On (a toggle like Delta) or open: tinted. */
  active?: boolean;
  /** A count (filters applied) or a dot (true) in the corner. */
  badge?: number | boolean;
  tone?: "default" | "danger";
  tooltipSide?: "top" | "bottom" | "left" | "right";
}

/**
 * An icon-only bar action (32×32) with its name in a tooltip. Bars never spell actions out in text; the only labelled
 * button in a bar is its primary action (Run, Create…).
 */
export const BarIconButton = forwardRef<HTMLButtonElement, Props>(function BarIconButton(
  { icon: Icon, label, hint, active, badge, tone = "default", tooltipSide = "bottom", className, ...props },
  ref,
) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          aria-pressed={active}
          className={cn(
            "relative text-muted-foreground hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground",
            active && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
            tone === "danger" && active && "bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive",
            className,
          )}
          {...props}
        >
          <Icon />
          {badge !== undefined && badge !== false && badge !== 0 && (
            <span
              className={cn(
                "absolute -right-0.5 -top-0.5 flex items-center justify-center rounded-full bg-primary text-[9px] font-bold leading-none text-primary-foreground ring-2 ring-card",
                typeof badge === "number" ? "h-3.5 min-w-[14px] px-1" : "h-2 w-2",
              )}
            >
              {typeof badge === "number" ? badge : null}
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} className="text-xs">
        <p className="font-medium">{label}</p>
        {hint && <p className="text-muted-foreground">{hint}</p>}
      </TooltipContent>
    </Tooltip>
  );
});

/** A thin divider between groups of bar controls. */
export function BarDivider({ className }: { className?: string }) {
  return <div aria-hidden className={cn("mx-1 h-5 w-px shrink-0 bg-border", className)} />;
}
