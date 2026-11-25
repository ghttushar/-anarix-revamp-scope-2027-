import { cn } from "@/lib/utils";

export type StatusTone = "positive" | "neutral" | "caution" | "danger" | "info" | "muted";

const DOT: Record<StatusTone, string> = {
  positive: "bg-success",
  neutral: "bg-primary",
  caution: "bg-warning",
  danger: "bg-destructive",
  info: "bg-primary",
  muted: "bg-muted-foreground/50",
};

/** The kit's status mark: a dot and a label, no pill box (dense tables read cleaner without a box per cell). */
export function StatusDot({ tone, label, className }: { tone: StatusTone; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-foreground", className)}>
      <span aria-hidden className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT[tone])} />
      {label}
    </span>
  );
}
