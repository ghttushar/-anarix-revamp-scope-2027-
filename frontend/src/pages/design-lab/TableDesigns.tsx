import { Fragment, useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronRight, ExternalLink, MoreHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { BarSegmented } from "@/components/bars";
import { Checkbox } from "@/components/ui/checkbox";
import { mockCampaigns } from "@/data/mockCampaigns";
import type { Campaign, CampaignStatus } from "@/types/campaign";
import { cn } from "@/lib/utils";

/**
 * Design lab: five table designs on the same data and the same toolbar, to pick one for the whole app.
 * Route: /design-lab/tables (not in the nav).
 */

type DesignId = "ledger" | "cards" | "grid" | "insight" | "grouped";

const DESIGNS: { value: DesignId; label: string; title: string; pitch: string; good: string; tradeoff: string }[] = [
  {
    value: "ledger",
    label: "1 · Ledger",
    title: "Ledger",
    pitch: "Dense finance table. Hairline rows, no column lines, small caps header, right-aligned tabular numbers, sticky header and name column.",
    good: "Most rows per screen; numbers line up perfectly for scanning and comparing.",
    tradeoff: "Quiet: status and change need colour to stand out.",
  },
  {
    value: "cards",
    label: "2 · Soft rows",
    title: "Soft rows",
    pitch: "Each row is its own rounded card on a tinted track, with breathing room between rows. Change sits under each value.",
    good: "Friendly and easy to read; a row feels like one object you can act on.",
    tradeoff: "~30% fewer rows per screen; less suited to 20+ column tables.",
  },
  {
    value: "grid",
    label: "3 · Grid",
    title: "Grid",
    pitch: "Spreadsheet feel: full cell borders, row numbers, zebra striping, compact rows, sortable headers, frozen first columns.",
    good: "Familiar to Excel users; precise for editing and bulk work.",
    tradeoff: "Busiest look of the five; lines compete with the data.",
  },
  {
    value: "insight",
    label: "4 · Insight",
    title: "Insight",
    pitch: "Comfortable rows that explain themselves: inline bars for spend, a sparkline for sales, ROAS and ACOS as health chips, two-line names.",
    good: "You see what is good or bad without reading every number.",
    tradeoff: "Heavier to render and taller rows; best for the key tables, not every list.",
  },
  {
    value: "grouped",
    label: "5 · Grouped",
    title: "Grouped",
    pitch: "Rows grouped (here by status) under collapsible group headers with subtotals; row actions appear on hover at the end of the row.",
    good: "Structure at a glance; subtotals answer 'how much is paused?' instantly.",
    tradeoff: "Needs a sensible grouping per table; flat lists don't benefit.",
  },
];

// ---------- shared data helpers ----------

const STATUS_LABEL: Record<CampaignStatus, string> = {
  live: "Live",
  paused: "Paused",
  archived: "Archived",
  scheduled: "Scheduled",
  out_of_budget: "Out of budget",
  completed: "Completed",
};
const STATUS_TONE: Record<CampaignStatus, string> = {
  live: "text-success bg-success/10",
  paused: "text-warning bg-warning/10",
  archived: "text-muted-foreground bg-muted",
  scheduled: "text-primary bg-primary/10",
  out_of_budget: "text-destructive bg-destructive/10",
  completed: "text-muted-foreground bg-muted",
};
const STATUS_DOT: Record<CampaignStatus, string> = {
  live: "bg-success",
  paused: "bg-warning",
  archived: "bg-muted-foreground/50",
  scheduled: "bg-primary",
  out_of_budget: "bg-destructive",
  completed: "bg-muted-foreground/50",
};

const money = (v: number, dp = 0) => `$${v.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const num = (v: number) => Math.round(v).toLocaleString("en-US");
/** A stable fake change vs the previous period, from the id and the column. */
const delta = (id: string, key: string) => {
  let h = 0;
  for (const ch of id + key) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return +(((h % 41) - 18) / 1.3).toFixed(1);
};
/** Lower is better for these. */
const INVERSE = new Set(["acos", "spend"]);
/** A stable fake 10-point series for sparklines. */
const series = (id: string) => Array.from({ length: 10 }, (_, i) => 40 + ((delta(id, "s" + i) + 14) * 2.2));

function Delta({ id, k, className }: { id: string; k: string; className?: string }) {
  const d = delta(id, k);
  const good = INVERSE.has(k) ? d < 0 : d > 0;
  if (d === 0) return <span className={cn("text-[10.5px] text-muted-foreground", className)}>0%</span>;
  return (
    <span className={cn("inline-flex items-center text-[10.5px] font-medium tabular-nums", good ? "text-success" : "text-destructive", className)}>
      {d > 0 ? "↑" : "↓"} {Math.abs(d)}%
    </span>
  );
}

function StatusPill({ s }: { s: CampaignStatus }) {
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium", STATUS_TONE[s])}>{STATUS_LABEL[s]}</span>;
}

function StatusDot({ s }: { s: CampaignStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[s])} />
      {STATUS_LABEL[s]}
    </span>
  );
}

function TypeTag({ c }: { c: Campaign }) {
  return <span className="rounded border border-border px-1 py-px text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{c.type}</span>;
}

type SortKey = "name" | "dailyBudget" | "spend" | "sales" | "roas" | "acos" | "orders" | "ctr";
const COLS: { key: SortKey; label: string; align?: "right"; render: (c: Campaign) => string }[] = [
  { key: "dailyBudget", label: "Budget", align: "right", render: (c) => money(c.dailyBudget) },
  { key: "spend", label: "Spend", align: "right", render: (c) => money(c.spend, 2) },
  { key: "sales", label: "Sales", align: "right", render: (c) => money(c.sales, 2) },
  { key: "roas", label: "ROAS", align: "right", render: (c) => `${c.roas.toFixed(2)}x` },
  { key: "acos", label: "ACOS", align: "right", render: (c) => `${c.acos.toFixed(1)}%` },
  { key: "orders", label: "Orders", align: "right", render: (c) => num(c.orders) },
  { key: "ctr", label: "CTR", align: "right", render: (c) => `${c.ctr.toFixed(2)}%` },
];

function totals(rows: Campaign[]) {
  const spend = rows.reduce((s, c) => s + c.spend, 0);
  const sales = rows.reduce((s, c) => s + c.sales, 0);
  return {
    dailyBudget: money(rows.reduce((s, c) => s + c.dailyBudget, 0)),
    spend: money(spend, 2),
    sales: money(sales, 2),
    roas: `${(spend ? sales / spend : 0).toFixed(2)}x`,
    acos: `${(sales ? (spend / sales) * 100 : 0).toFixed(1)}%`,
    orders: num(rows.reduce((s, c) => s + c.orders, 0)),
    ctr: `${(rows.reduce((s, c) => s + c.ctr, 0) / (rows.length || 1)).toFixed(2)}%`,
  } as Record<SortKey, string>;
}

interface VariantProps {
  rows: Campaign[];
  selected: Set<string>;
  toggle: (id: string) => void;
  toggleAll: () => void;
  showDeltas: boolean;
  sort: { key: SortKey; dir: "asc" | "desc" } | null;
  onSort: (k: SortKey) => void;
}

function SortIcon({ active, dir }: { active: boolean; dir?: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-30" />;
  return dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
}

const allState = (rows: Campaign[], selected: Set<string>) =>
  rows.length > 0 && rows.every((r) => selected.has(r.id)) ? true : rows.some((r) => selected.has(r.id)) ? "indeterminate" : false;

// ---------- 1. Ledger ----------
function Ledger({ rows, selected, toggle, toggleAll, showDeltas, sort, onSort }: VariantProps) {
  const t = totals(rows);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-[13px]">
          <thead className="sticky top-0 z-20">
            <tr className="bg-muted/60 backdrop-blur">
              <th className="sticky left-0 z-10 w-10 border-b border-border bg-muted/60 px-3 py-2">
                <Checkbox checked={allState(rows, selected)} onCheckedChange={toggleAll} aria-label="Select all" />
              </th>
              <th className="sticky left-10 z-10 border-b border-border bg-muted/60 px-3 py-2 text-left">
                <button onClick={() => onSort("name")} className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                  Campaign <SortIcon active={sort?.key === "name"} dir={sort?.dir} />
                </button>
              </th>
              <th className="border-b border-border px-3 py-2 text-left text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              {COLS.map((c) => (
                <th key={c.key} className="border-b border-border px-3 py-2 text-right">
                  <button onClick={() => onSort(c.key)} className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                    {c.label} <SortIcon active={sort?.key === c.key} dir={sort?.dir} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const on = selected.has(r.id);
              return (
                <tr key={r.id} className={cn("group", on ? "bg-primary/[0.04]" : "hover:bg-muted/40")}>
                  <td className={cn("sticky left-0 z-10 border-b border-border/70 px-3 py-2", on ? "bg-[hsl(var(--primary)/0.04)] shadow-[inset_2px_0_0_hsl(var(--primary))]" : "bg-card group-hover:bg-muted/40")}>
                    <Checkbox checked={on} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} />
                  </td>
                  <td className={cn("sticky left-10 z-10 border-b border-border/70 px-3 py-2", on ? "bg-[hsl(var(--primary)/0.04)]" : "bg-card group-hover:bg-muted/40")}>
                    <div className="flex items-center gap-2">
                      <span className="max-w-[220px] truncate font-medium text-foreground">{r.name}</span>
                      <TypeTag c={r} />
                    </div>
                  </td>
                  <td className="border-b border-border/70 px-3 py-2"><StatusDot s={r.status} /></td>
                  {COLS.map((c) => (
                    <td key={c.key} className="border-b border-border/70 px-3 py-2 text-right tabular-nums text-foreground">
                      {c.render(r)}
                      {showDeltas && <Delta id={r.id} k={c.key} className="ml-1.5" />}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="sticky bottom-0 z-20">
            <tr className="bg-card">
              <td className="sticky left-0 z-10 border-t-2 border-foreground/80 bg-card px-3 py-2" />
              <td className="sticky left-10 z-10 border-t-2 border-foreground/80 bg-card px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Total · {rows.length}</td>
              <td className="border-t-2 border-foreground/80 px-3 py-2" />
              {COLS.map((c) => (
                <td key={c.key} className="border-t-2 border-foreground/80 px-3 py-2 text-right font-semibold tabular-nums text-foreground">{t[c.key]}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ---------- 2. Soft rows ----------
function SoftRows({ rows, selected, toggle, toggleAll, showDeltas, sort, onSort }: VariantProps) {
  const t = totals(rows);
  return (
    <div className="rounded-xl bg-muted/40 p-2">
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full border-separate border-spacing-x-0 border-spacing-y-1.5 text-sm">
          <thead>
            <tr>
              <th className="w-10 px-4 py-1.5 text-left"><Checkbox checked={allState(rows, selected)} onCheckedChange={toggleAll} aria-label="Select all" /></th>
              <th className="px-3 py-1.5 text-left">
                <button onClick={() => onSort("name")} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">Campaign <SortIcon active={sort?.key === "name"} dir={sort?.dir} /></button>
              </th>
              <th className="px-3 py-1.5 text-left text-xs font-medium text-muted-foreground">Status</th>
              {COLS.map((c) => (
                <th key={c.key} className="px-3 py-1.5 text-right">
                  <button onClick={() => onSort(c.key)} className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">{c.label} <SortIcon active={sort?.key === c.key} dir={sort?.dir} /></button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const on = selected.has(r.id);
              const cell = cn("bg-card px-3 py-3 transition-shadow", on && "bg-primary/[0.05]");
              return (
                <tr key={r.id} className="group">
                  <td className={cn(cell, "rounded-l-lg border-y border-l pl-4", on ? "border-primary/40" : "border-transparent group-hover:border-border")}>
                    <Checkbox checked={on} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} />
                  </td>
                  <td className={cn(cell, "border-y", on ? "border-primary/40" : "border-transparent group-hover:border-border")}>
                    <p className="max-w-[240px] truncate font-medium text-foreground">{r.name}</p>
                    <p className="text-[11px] text-muted-foreground">{r.type === "auto" ? "Auto" : "Manual"} · {r.biddingStrategy}</p>
                  </td>
                  <td className={cn(cell, "border-y", on ? "border-primary/40" : "border-transparent group-hover:border-border")}><StatusPill s={r.status} /></td>
                  {COLS.map((c, i) => (
                    <td key={c.key} className={cn(cell, "border-y text-right", i === COLS.length - 1 && "rounded-r-lg border-r", on ? "border-primary/40" : "border-transparent group-hover:border-border")}>
                      <p className="tabular-nums text-foreground">{c.render(r)}</p>
                      {showDeltas && <Delta id={r.id} k={c.key} />}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-1 flex items-center justify-between rounded-lg px-4 py-2 text-xs text-muted-foreground">
        <span>{rows.length} campaigns</span>
        <span className="flex gap-5 tabular-nums">
          <span>Spend <b className="font-semibold text-foreground">{t.spend}</b></span>
          <span>Sales <b className="font-semibold text-foreground">{t.sales}</b></span>
          <span>ROAS <b className="font-semibold text-foreground">{t.roas}</b></span>
        </span>
      </div>
    </div>
  );
}

// ---------- 3. Grid ----------
function Grid({ rows, selected, toggle, toggleAll, showDeltas, sort, onSort }: VariantProps) {
  const [focus, setFocus] = useState<string | null>(null);
  const t = totals(rows);
  const th = "border border-border bg-muted px-2 py-1.5 text-[11.5px] font-semibold text-foreground";
  const td = "border border-border px-2 py-1 text-[12.5px]";
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className={cn(th, "sticky left-0 z-10 w-9 text-center text-muted-foreground")}>#</th>
              <th className={cn(th, "sticky left-9 z-10 w-9")}><Checkbox checked={allState(rows, selected)} onCheckedChange={toggleAll} aria-label="Select all" /></th>
              <th className={cn(th, "sticky left-[72px] z-10 text-left")}>
                <button onClick={() => onSort("name")} className="flex w-full items-center justify-between gap-2">Campaign <SortIcon active={sort?.key === "name"} dir={sort?.dir} /></button>
              </th>
              <th className={cn(th, "text-left")}>Status</th>
              {COLS.map((c) => (
                <th key={c.key} className={cn(th, "text-right")}>
                  <button onClick={() => onSort(c.key)} className="flex w-full items-center justify-end gap-1.5"><SortIcon active={sort?.key === c.key} dir={sort?.dir} />{c.label}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const on = selected.has(r.id);
              const zebra = i % 2 === 1 ? "bg-muted/30" : "bg-card";
              const cellCls = (k: string) => cn(td, focus === `${r.id}-${k}` && "outline outline-2 -outline-offset-2 outline-primary");
              return (
                <tr key={r.id} className={cn(on ? "bg-primary/[0.07]" : zebra, "hover:bg-primary/[0.04]")}>
                  <td className={cn(td, "sticky left-0 z-10 text-center text-[11px] text-muted-foreground", on ? "bg-primary/10" : "bg-muted")}>{i + 1}</td>
                  <td className={cn(td, "sticky left-9 z-10 text-center", on ? "bg-[hsl(var(--primary)/0.07)]" : i % 2 ? "bg-[hsl(var(--muted)/0.3)]" : "bg-card")}>
                    <Checkbox checked={on} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} />
                  </td>
                  <td onClick={() => setFocus(`${r.id}-name`)} className={cn(cellCls("name"), "sticky left-[72px] z-10 max-w-[240px] truncate font-medium", on ? "bg-[hsl(var(--primary)/0.07)]" : i % 2 ? "bg-[hsl(var(--muted)/0.3)]" : "bg-card")}>{r.name}</td>
                  <td onClick={() => setFocus(`${r.id}-status`)} className={cellCls("status")}>{STATUS_LABEL[r.status]}</td>
                  {COLS.map((c) => (
                    <td key={c.key} onClick={() => setFocus(`${r.id}-${c.key}`)} className={cn(cellCls(c.key), "text-right tabular-nums")}>
                      {c.render(r)}
                      {showDeltas && <Delta id={r.id} k={c.key} className="ml-1" />}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr className="bg-muted font-semibold">
              <td className={cn(td, "sticky left-0 z-10 bg-muted")} />
              <td className={cn(td, "sticky left-9 z-10 bg-muted")} />
              <td className={cn(td, "sticky left-[72px] z-10 bg-muted")}>Total</td>
              <td className={td} />
              {COLS.map((c) => <td key={c.key} className={cn(td, "text-right tabular-nums")}>{t[c.key]}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- 4. Insight ----------
function Spark({ id }: { id: string }) {
  const s = series(id);
  const max = Math.max(...s), min = Math.min(...s);
  const pts = s.map((v, i) => `${(i / (s.length - 1)) * 60},${18 - ((v - min) / (max - min || 1)) * 16}`).join(" ");
  const up = s[s.length - 1] >= s[0];
  return (
    <svg width="60" height="20" className="shrink-0" aria-hidden>
      <polyline points={pts} fill="none" stroke={up ? "hsl(var(--success))" : "hsl(var(--destructive))"} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
function Health({ value, good, bad, suffix, inverse }: { value: number; good: number; bad: number; suffix: string; inverse?: boolean }) {
  const isGood = inverse ? value <= good : value >= good;
  const isBad = inverse ? value >= bad : value <= bad;
  return (
    <span className={cn("inline-flex min-w-[58px] justify-center rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
      isGood ? "bg-success/10 text-success" : isBad ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning")}>
      {value.toFixed(suffix === "x" ? 2 : 1)}{suffix}
    </span>
  );
}
function Insight({ rows, selected, toggle, toggleAll, showDeltas, sort, onSort }: VariantProps) {
  const maxSpend = Math.max(...rows.map((r) => r.spend), 1);
  const head = (label: string, key?: SortKey, right?: boolean) => (
    <th className={cn("border-b border-border px-4 py-2.5", right ? "text-right" : "text-left")}>
      {key ? (
        <button onClick={() => onSort(key)} className={cn("inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground", right && "ml-auto")}>{label} <SortIcon active={sort?.key === key} dir={sort?.dir} /></button>
      ) : <span className="text-xs font-medium text-muted-foreground">{label}</span>}
    </th>
  );
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-card">
            <tr>
              <th className="w-10 border-b border-border px-4 py-2.5"><Checkbox checked={allState(rows, selected)} onCheckedChange={toggleAll} aria-label="Select all" /></th>
              {head("Campaign", "name")}
              {head("Status")}
              {head("Spend vs budget", "spend")}
              {head("Sales trend", "sales")}
              {head("ROAS", "roas", true)}
              {head("ACOS", "acos", true)}
              {head("Orders", "orders", true)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const on = selected.has(r.id);
              const pctBudget = Math.min(100, (r.spend / (r.dailyBudget * 30 || 1)) * 100);
              return (
                <tr key={r.id} className={cn(on ? "bg-primary/[0.04]" : "hover:bg-muted/30")}>
                  <td className="border-b border-border/60 px-4 py-3"><Checkbox checked={on} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} /></td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <p className="max-w-[230px] truncate font-medium text-foreground">{r.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{r.type === "auto" ? "Auto" : "Manual"} · {r.biddingStrategy} · {money(r.dailyBudget)}/day</p>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3"><StatusPill s={r.status} /></td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", pctBudget > 90 ? "bg-destructive" : "bg-primary")} style={{ width: `${(r.spend / maxSpend) * 100}%` }} />
                      </div>
                      <span className="tabular-nums text-foreground">{money(r.spend)}</span>
                      {showDeltas && <Delta id={r.id} k="spend" />}
                    </div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Spark id={r.id} />
                      <span className="tabular-nums text-foreground">{money(r.sales)}</span>
                      {showDeltas && <Delta id={r.id} k="sales" />}
                    </div>
                  </td>
                  <td className="border-b border-border/60 px-4 py-3 text-right"><Health value={r.roas} good={3} bad={1.5} suffix="x" /></td>
                  <td className="border-b border-border/60 px-4 py-3 text-right"><Health value={r.acos} good={25} bad={40} suffix="%" inverse /></td>
                  <td className="border-b border-border/60 px-4 py-3 text-right tabular-nums text-foreground">
                    {num(r.orders)}
                    {showDeltas && <Delta id={r.id} k="orders" className="ml-1.5" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- 5. Grouped ----------
function Grouped({ rows, selected, toggle, toggleAll, showDeltas, sort, onSort }: VariantProps) {
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const groups = useMemo(() => {
    const m = new Map<CampaignStatus, Campaign[]>();
    rows.forEach((r) => m.set(r.status, [...(m.get(r.status) ?? []), r]));
    return [...m.entries()];
  }, [rows]);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-card">
            <tr>
              <th className="w-10 border-b-2 border-foreground/80 px-3 py-2.5"><Checkbox checked={allState(rows, selected)} onCheckedChange={toggleAll} aria-label="Select all" /></th>
              <th className="border-b-2 border-foreground/80 px-3 py-2.5 text-left">
                <button onClick={() => onSort("name")} className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">Campaign <SortIcon active={sort?.key === "name"} dir={sort?.dir} /></button>
              </th>
              {COLS.map((c) => (
                <th key={c.key} className="border-b-2 border-foreground/80 px-3 py-2.5 text-right">
                  <button onClick={() => onSort(c.key)} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-foreground">{c.label} <SortIcon active={sort?.key === c.key} dir={sort?.dir} /></button>
                </th>
              ))}
              <th className="w-16 border-b-2 border-foreground/80" />
            </tr>
          </thead>
          <tbody>
            {groups.map(([status, list]) => {
              const open = !closed.has(status);
              const t = totals(list);
              return (
                <Fragment key={status}>
                  <tr className="bg-muted/50">
                    <td className="border-b border-border px-3 py-2" />
                    <td className="border-b border-border px-3 py-2">
                      <button
                        onClick={() => setClosed((p) => { const n = new Set(p); n.has(status) ? n.delete(status) : n.add(status); return n; })}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-foreground"
                      >
                        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                        <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} />
                        {STATUS_LABEL[status]}
                        <span className="rounded bg-card px-1.5 text-[10.5px] font-medium text-muted-foreground">{list.length}</span>
                      </button>
                    </td>
                    {COLS.map((c) => (
                      <td key={c.key} className="border-b border-border px-3 py-2 text-right text-xs font-semibold tabular-nums text-muted-foreground">{t[c.key]}</td>
                    ))}
                    <td className="border-b border-border" />
                  </tr>
                  {open && list.map((r) => {
                    const on = selected.has(r.id);
                    return (
                      <tr key={r.id} className={cn("group", on ? "bg-primary/[0.05]" : "hover:bg-muted/30")}>
                        <td className="border-b border-border/50 px-3 py-2.5"><Checkbox checked={on} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} /></td>
                        <td className="border-b border-border/50 px-3 py-2.5 pl-9">
                          <div className="flex items-center gap-2">
                            <span className="max-w-[220px] truncate text-foreground">{r.name}</span>
                            <TypeTag c={r} />
                          </div>
                        </td>
                        {COLS.map((c) => (
                          <td key={c.key} className="border-b border-border/50 px-3 py-2.5 text-right tabular-nums text-foreground">
                            {c.render(r)}
                            {showDeltas && <Delta id={r.id} k={c.key} className="ml-1.5" />}
                          </td>
                        ))}
                        <td className="border-b border-border/50 px-2 py-2.5">
                          <div className="flex justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <button aria-label="Open" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" /></button>
                            <button aria-label="More" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const VARIANTS: Record<DesignId, (p: VariantProps) => ReactNode> = {
  ledger: Ledger,
  cards: SoftRows,
  grid: Grid,
  insight: Insight,
  grouped: Grouped,
};

export default function TableDesigns() {
  const [design, setDesign] = useState<DesignId>("ledger");
  const [search, setSearch] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);

  const rows = useMemo(() => {
    let r = mockCampaigns.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    if (sort) {
      r = [...r].sort((a, b) => {
        const av = a[sort.key], bv = b[sort.key];
        const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return r;
  }, [search, sort]);

  const toggle = (id: string) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected((p) => (rows.every((r) => p.has(r.id)) ? new Set() : new Set(rows.map((r) => r.id))));
  const onSort = (k: SortKey) => setSort((s) => (s?.key !== k ? { key: k, dir: "desc" } : s.dir === "desc" ? { key: k, dir: "asc" } : null));

  const d = DESIGNS.find((x) => x.value === design)!;
  const Variant = VARIANTS[design];

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Table designs" subtitle="Five options on the same data and toolbar. Pick one to use across the app." />

        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          <BarSegmented value={design} onChange={(v) => setDesign(v as DesignId)} items={DESIGNS.map((x) => ({ value: x.value, label: x.label }))} aria-label="Table design" />
          <div className="grid gap-x-8 gap-y-1 text-sm md:grid-cols-[1.4fr_1fr_1fr]">
            <p className="text-foreground"><span className="font-semibold">{d.title}.</span> {d.pitch}</p>
            <p className="text-muted-foreground"><span className="font-medium text-success">Good for:</span> {d.good}</p>
            <p className="text-muted-foreground"><span className="font-medium text-warning">Trade-off:</span> {d.tradeoff}</p>
          </div>
        </div>

        <div className="space-y-2">
          <DataTableToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search campaigns..."
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
            onDownload={() => {}}
            selection={{ count: selected.size, onClear: () => setSelected(new Set()) }}
            primaryAction={{ label: "Create campaign" }}
          />
          <Variant rows={rows} selected={selected} toggle={toggle} toggleAll={toggleAll} showDeltas={showDeltas} sort={sort} onSort={onSort} />
        </div>
      </div>
    </AppLayout>
  );
}
