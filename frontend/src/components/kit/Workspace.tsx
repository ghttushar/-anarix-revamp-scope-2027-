import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The "pro" kit's page structure: ONE sheet per workspace, split into zones by hairline dividers — no card per
 * section, no boxes inside boxes.
 *
 *   <Workspace>
 *     <Zone>…KPIs…</Zone>
 *     <Zone header={<ZoneHeader title="Performance" … />}>…chart…</Zone>
 *     <Zone flush>…table…</Zone>
 *   </Workspace>
 *
 * Inside a zone, dropdown chips go ghost (no fill until hover / open) via `data-zone` (see index.css).
 */
export function Workspace({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-workspace
      className={cn("min-w-0 overflow-hidden rounded-lg bg-card shadow-e1 divide-y divide-border", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

interface ZoneProps extends HTMLAttributes<HTMLDivElement> {
  /** A zone header (title, context, actions) on top of the content. */
  header?: ReactNode;
  /** No inner padding: for tables and other edge-to-edge content. */
  flush?: boolean;
}

export function Zone({ header, flush = false, className, children, ...rest }: ZoneProps) {
  return (
    <section data-zone className={cn("min-w-0", className)} {...rest}>
      {header}
      <div className={cn("min-w-0", !flush && "px-4 py-3", header && !flush && "pt-1")}>{children}</div>
    </section>
  );
}

interface ZoneHeaderProps {
  title: ReactNode;
  /** Muted context after the title (period, "Showing 12 items"). */
  context?: ReactNode;
  /** Right-aligned controls (ghost chips, icon buttons). */
  actions?: ReactNode;
  className?: string;
}

export function ZoneHeader({ title, context, actions, className }: ZoneHeaderProps) {
  return (
    <div className={cn("flex min-h-11 items-center gap-3 px-4 pt-2", className)}>
      <div className="flex min-w-0 flex-1 items-baseline gap-2">
        <h2 className="truncate text-sm font-semibold text-foreground">{title}</h2>
        {context && <span className="truncate text-xs text-muted-foreground">{context}</span>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </div>
  );
}
