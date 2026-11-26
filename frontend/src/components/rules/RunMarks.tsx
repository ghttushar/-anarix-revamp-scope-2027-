import type { ReactNode } from "react";
import { Hand } from "lucide-react";
import { AnxHistory, AnxSchedule } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { EntityStatus, RunStatus, RunTrigger } from "@/data/mockRuleHistory";

const STATUS_STYLE: Record<RunStatus | EntityStatus, { label: string; cls: string }> = {
  success: { label: "Success", cls: "bg-success/10 text-success" },
  partial: { label: "Partial", cls: "bg-warning/10 text-warning" },
  failed: { label: "Failed", cls: "bg-destructive/10 text-destructive" },
  skipped: { label: "Skipped", cls: "bg-muted text-muted-foreground" },
};

/** A run's or an entity's status: the kit's small tinted pill with a dot. */
export function StatusPill({ status, className }: { status: RunStatus | EntityStatus; className?: string }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={cn("k-status inline-flex h-[18px] items-center whitespace-nowrap rounded-full px-1.5 text-2xs font-medium leading-none", s.cls, className)}>
      {s.label}
    </span>
  );
}

/** Scheduled or manual, as a quiet icon + label. */
export function TriggerMark({ trigger }: { trigger: RunTrigger }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-body">
      {trigger === "scheduled" ? <AnxSchedule className="h-3.5 w-3.5 text-muted-foreground" /> : <Hand className="h-3.5 w-3.5 text-muted-foreground" />}
      {trigger === "scheduled" ? "Scheduled" : "Manual"}
    </span>
  );
}

/** A screen's empty state: a soft icon tile, a title, one line, and an optional action. */
export function HistoryEmpty({ title, hint, action, icon }: { title: string; hint: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-tint text-primary">
        {icon ?? <AnxHistory className="h-5 w-5" />}
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-xs text-muted-foreground">{hint}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** Download rows as a CSV file (client-side). */
export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [header, ...rows].map((r) => r.map(esc).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
