import { forwardRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  icon: ReactNode;
  /** Tailwind classes for the icon tile's tint, e.g. "bg-primary/10". */
  tileClassName?: string;
  title: string;
  tag?: string;
  isNew?: boolean;
  description: string;
  actionLabel: string;
  onAction: () => void;
  /** Shown next to the button once connected. */
  status?: ReactNode;
  highlight?: boolean;
}

/** An entry under "Available integrations", in the same card style as the WhatsApp one. */
export const IntegrationOption = forwardRef<HTMLDivElement, Props>(function IntegrationOption(
  { icon, tileClassName, title, tag, isNew, description, actionLabel, onAction, status, highlight },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-4 transition-shadow duration-500",
        highlight && "ring-2 ring-primary/50 shadow-md"
      )}
    >
      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", tileClassName ?? "bg-primary/10")}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          {tag && (
            <span className="text-2xs uppercase tracking-wide text-muted-foreground border border-border rounded px-1.5 py-0.5">{tag}</span>
          )}
          {isNew && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-2xs font-semibold uppercase tracking-wide text-primary">New</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {status}
        <Button size="sm" onClick={onAction}>{actionLabel}</Button>
      </div>
    </div>
  );
});
