import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown, ArrowRight, ArrowUp, ChevronDown, ExternalLink, MoreHorizontal, Pause, Pencil, Pin, PinOff, Play, Wallet,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { BarSegmented } from "@/components/bars";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockCampaigns } from "@/data/mockCampaigns";
import type { Campaign, CampaignStatus } from "@/types/campaign";
import { cn } from "@/lib/utils";

/**
 * Design lab, round 2: five table designs on the same data and toolbar, to pick one for the whole app.
 * Route: /design-lab/tables (not in the nav).
 */

type DesignId = "pulse" | "expand" | "heat" | "editorial" | "workbench";

const DESIGNS: { value: DesignId; label: string; title: string; pitch: string; good: string; tradeoff: string }[] = [
  {
    value: "pulse",
    label: "1 · Pulse",
    title: "Pulse",
    pitch: "The header is the KPI strip: every metric column shows its total and change right above its values. Hovering lights up the row and the column, like crosshairs.",
    good: "Totals and rows in one glance; no separate KPI cards needed above tables.",
    tradeoff: "A taller header (two lines).",
  },
  {
    value: "expand",
    label: "2 · Expand",
    title: "Expand",
    pitch: "A lean list (name, status, three key numbers, trend). Click a row and it opens in place: a trend chart, every metric with its change, and quick actions.",
    good: "Calm by default, deep on demand; no navigating away to see a campaign.",
    tradeoff: "Fewer columns visible at once; comparing hidden metrics needs expanding.",
  },
  {
    value: "heat",
    label: "3 · Heat",
    title: "Heat",
    pitch: "Every number sits on a soft tile shaded by how good or bad it is within its column: green is good, red is bad, blue is neutral volume (budget, spend).",
    good: "Outliers jump out instantly; great for scanning 50+ rows.",
    tradeoff: "Colourful; needs the legend the first time.",
  },
  {
    value: "editorial",
    label: "4 · Editorial",
    title: "Editorial",
    pitch: "Swiss and typographic: a big light rank number, the name with its context line, one hero metric set large, the supporting metrics quiet beside it. No grid lines.",
    good: "Reads like a report; perfect for ranked lists and leaderboards.",
    tradeoff: "Not for wide, many-column tables.",
  },
  {
    value: "workbench",
    label: "5 · Workbench",
    title: "Workbench",
    pitch: "Built for doing: change status from its chip, edit budget in the cell, ↑/↓ to move between rows, pin rows to the top. Actions appear at the end of the hovered row.",
    good: "Fastest for daily operators; no dialogs for routine edits.",
    tradeoff: "More interactive affordances to learn.",
  },
];

// ---------- shared ----------

const STATUS_LABEL: Record<CampaignStatus, string> = {
  live: "Live", paused: "Paused", archived: "Archived", scheduled: "Scheduled", out_of_budget: "Out of budget", completed: "Completed",
};
const STATUS_DOT: Record<CampaignStatus, string> = {
  live: "bg-success", paused: "bg-warning", archived: "bg-muted-foreground/40", scheduled: "bg-primary", out_of_budget: "bg-destructive", completed: "bg-muted-foreground/40",
};
const STATUS_CHIP: Record<CampaignStatus, string> = {
  live: "bg-success/10 text-success", paused: "bg-warning/10 text-warning", archived: "bg-muted text-muted-foreground",
  scheduled: "bg-primary/10 text-primary", out_of_budget: "bg-destructive/10 text-destructive", completed: "bg-muted text-muted-foreground",
};

const money = (v: number, dp = 0) => `$${v.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const compact = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : money(v));
const num = (v: number) => Math.round(v).toLocaleString("en-US");
const hash = (s: string) => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 997; return h; };
/** A stable fake change vs the previous period. */
const delta = (id: string, key: string) => +(((hash(id + key) % 41) - 18) / 1.3).toFixed(1);
const INVERSE = new Set(["acos", "spend", "cpc"]);
/** A stable, smooth fake series for sparklines and trend charts (a seeded wave with a drift). */
const series = (id: string, n = 14) => {
  const h = hash(id), phase = (h % 60) / 10, drift = ((h % 9) - 4) * 0.9;
  return Array.from({ length: n }, (_, i) => 50 + 10 * Math.sin(i / 2.4 + phase) + 4 * Math.sin(i / 1.1 + phase * 2) + drift * i);
};

function Delta({ v, inverse, className }: { v: number; inverse?: boolean; className?: string }) {
  if (v === 0) return <span className={cn("text-[11px] text-muted-foreground", className)}>—</span>;
  const good = inverse ? v < 0 : v > 0;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums", good ? "text-success" : "text-destructive", className)}>
      {v > 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
      {Math.abs(v)}%
    </span>
  );
}

function Spark({ id, w = 72, h = 22, area }: { id: string; w?: number; h?: number; area?: boolean }) {
  const s = series(id);
  const max = Math.max(...s), min = Math.min(...s);
  const pts = s.map((v, i) => [(i / (s.length - 1)) * w, h - 2 - ((v - min) / (max - min || 1)) * (h - 4)] as const);
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const up = s[s.length - 1] >= s[0];
  const color = up ? "hsl(var(--success))" : "hsl(var(--destructive))";
  return (
    <svg width={w} height={h} className="shrink-0 overflow-visible" aria-hidden>
      {area && <polygon points={`0,${h} ${line} ${w},${h}`} fill={color} opacity={0.08} />}
      <polyline points={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2} fill={color} />
    </svg>
  );
}

type SortKey = "name" | "dailyBudget" | "spend" | "sales" | "roas" | "acos" | "orders" | "ctr";
type Metric = { key: Exclude<SortKey, "name">; label: string; fmt: (v: number) => string; inverse?: boolean; tone: "volume" | "good" };
const METRICS: Metric[] = [
  { key: "dailyBudget", label: "Budget", fmt: (v) => money(v), tone: "volume" },
  { key: "spend", label: "Spend", fmt: (v) => money(v, 2), tone: "volume", inverse: true },
  { key: "sales", label: "Sales", fmt: (v) => money(v, 2), tone: "good" },
  { key: "roas", label: "ROAS", fmt: (v) => `${v.toFixed(2)}x`, tone: "good" },
  { key: "acos", label: "ACOS", fmt: (v) => `${v.toFixed(1)}%`, tone: "good", inverse: true },
  { key: "orders", label: "Orders", fmt: num, tone: "good" },
  { key: "ctr", label: "CTR", fmt: (v) => `${v.toFixed(2)}%`, tone: "good" },
];

function aggregate(rows: Campaign[], key: Metric["key"]) {
  const sum = (k: keyof Campaign) => rows.reduce((s, c) => s + (c[k] as number), 0);
  if (key === "roas") { const sp = sum("spend"); return sp ? sum("sales") / sp : 0; }
  if (key === "acos") { const sa = sum("sales"); return sa ? (sum("spend") / sa) * 100 : 0; }
  if (key === "ctr") return rows.length ? sum("ctr") / rows.length : 0;
  return sum(key);
}

interface VariantProps {
  rows: Campaign[];
  setRows: (fn: (rows: Campaign[]) => Campaign[]) => void;
  selected: Set<string>;
  toggle: (id: string) => void;
  toggleAll: () => void;
  showDeltas: boolean;
  sort: { key: SortKey; dir: "asc" | "desc" } | null;
  onSort: (k: SortKey) => void;
}

const allState = (rows: Campaign[], selected: Set<string>) =>
  rows.length > 0 && rows.every((r) => selected.has(r.id)) ? true : rows.some((r) => selected.has(r.id)) ? "indeterminate" : false;

function SortMark({ k, sort }: { k: SortKey; sort: VariantProps["sort"] }) {
  if (sort?.key !== k) return null;
  return sort.dir === "asc" ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />;
}

// ---------- 1. Pulse: the header is the KPI strip ----------
function Pulse({ rows, selected, toggle, toggleAll, showDeltas, sort, onSort }: VariantProps) {
  const [col, setCol] = useState<number | null>(null);
  const [row, setRow] = useState<string | null>(null);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04)]" onMouseLeave={() => { setCol(null); setRow(null); }}>
      <div className="max-h-[600px] overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-[13px]">
          <thead className="sticky top-0 z-20 bg-card">
            <tr>
              <th rowSpan={2} className="w-10 border-b border-border px-4 align-bottom pb-3">
                <Checkbox checked={allState(rows, selected)} onCheckedChange={toggleAll} aria-label="Select all" />
              </th>
              <th rowSpan={2} className="border-b border-border px-3 pb-3 text-left align-bottom">
                <button onClick={() => onSort("name")} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                  Campaign <SortMark k="name" sort={sort} />
                </button>
                <p className="mt-0.5 text-[11px] font-normal text-muted-foreground/70">{rows.length} in view</p>
              </th>
              {METRICS.map((m, i) => (
                <th key={m.key} className={cn("px-4 pt-3 text-right transition-colors", col === i && "bg-primary/[0.04]", sort?.key === m.key && "bg-primary/[0.06]")}>
                  <button onClick={() => onSort(m.key)} className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground">
                    {m.label} <SortMark k={m.key} sort={sort} />
                  </button>
                </th>
              ))}
            </tr>
            <tr>
              {METRICS.map((m, i) => (
                <th key={m.key} className={cn("border-b border-border px-4 pb-3 pt-0.5 text-right align-top transition-colors", col === i && "bg-primary/[0.04]", sort?.key === m.key && "bg-primary/[0.06]")}>
                  <p className="text-base font-semibold tabular-nums leading-tight text-foreground">{m.key === "dailyBudget" || m.key === "spend" || m.key === "sales" ? compact(aggregate(rows, m.key)) : m.fmt(aggregate(rows, m.key))}</p>
                  <Delta v={delta("total", m.key)} inverse={m.inverse} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const on = selected.has(r.id);
              const hot = row === r.id;
              return (
                <tr key={r.id} onMouseEnter={() => setRow(r.id)} className={cn(on && "bg-primary/[0.05]")}>
                  <td className={cn("border-b border-border/60 px-4 py-2.5", hot && !on && "bg-muted/50")}>
                    <Checkbox checked={on} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} />
                  </td>
                  <td className={cn("border-b border-border/60 px-3 py-2.5", hot && !on && "bg-muted/50")}>
                    <div className="flex items-center gap-2">
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT[r.status])} title={STATUS_LABEL[r.status]} />
                      <span className="max-w-[240px] truncate font-medium text-foreground">{r.name}</span>
                    </div>
                  </td>
                  {METRICS.map((m, i) => (
                    <td
                      key={m.key}
                      onMouseEnter={() => setCol(i)}
                      className={cn(
                        "border-b border-border/60 px-4 py-2.5 text-right tabular-nums text-foreground transition-colors",
                        hot && !on && "bg-muted/50",
                        col === i && "bg-primary/[0.04]",
                        hot && col === i && "bg-primary/[0.1] font-semibold",
                      )}
                    >
                      {m.fmt(r[m.key] as number)}
                      {showDeltas && <Delta v={delta(r.id, m.key)} inverse={m.inverse} className="ml-1.5" />}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- 2. Expand: lean rows that open in place ----------
function MiniArea({ id }: { id: string }) {
  const s = series(id, 20);
  const w = 360, h = 110;
  const max = Math.max(...s), min = Math.min(...s) * 0.9;
  const pts = s.map((v, i) => `${((i / (s.length - 1)) * w).toFixed(1)},${(h - ((v - min) / (max - min || 1)) * (h - 10)).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[110px] w-full" preserveAspectRatio="none" aria-hidden>
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={0} x2={w} y1={h * f} y2={h * f} stroke="hsl(var(--border))" strokeDasharray="3 4" />)}
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill="hsl(var(--primary))" opacity={0.1} />
      <polyline points={pts} fill="none" stroke="hsl(var(--primary))" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
function Expand({ rows, selected, toggle, toggleAll, showDeltas, sort, onSort }: VariantProps) {
  const [open, setOpen] = useState<string | null>(rows[0]?.id ?? null);
  const head = (label: string, k?: SortKey, right?: boolean) => (
    <th className={cn("border-b border-border px-4 py-2.5", right ? "text-right" : "text-left")}>
      {k ? (
        <button onClick={() => onSort(k)} className={cn("inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground", right && "ml-auto")}>{label} <SortMark k={k} sort={sort} /></button>
      ) : <span className="text-xs font-medium text-muted-foreground">{label}</span>}
    </th>
  );
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="max-h-[600px] overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-card">
            <tr>
              <th className="w-10 border-b border-border px-4 py-2.5"><Checkbox checked={allState(rows, selected)} onCheckedChange={toggleAll} aria-label="Select all" /></th>
              {head("Campaign", "name")}
              {head("Spend", "spend", true)}
              {head("Sales", "sales", true)}
              {head("ROAS", "roas", true)}
              {head("Last 14 days")}
              <th className="w-10 border-b border-border" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const on = selected.has(r.id);
              const isOpen = open === r.id;
              return (
                <Fragment key={r.id}>
                  <tr
                    onClick={() => setOpen(isOpen ? null : r.id)}
                    className={cn("cursor-pointer transition-colors", isOpen ? "bg-primary/[0.04]" : on ? "bg-primary/[0.03]" : "hover:bg-muted/40")}
                  >
                    <td className={cn("px-4 py-3", !isOpen && "border-b border-border/60")} onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={on} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} />
                    </td>
                    <td className={cn("px-4 py-3", !isOpen && "border-b border-border/60")}>
                      <p className="max-w-[260px] truncate font-medium text-foreground">{r.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[r.status])} />
                        {STATUS_LABEL[r.status]} · {r.type === "auto" ? "Auto" : "Manual"}
                      </p>
                    </td>
                    <td className={cn("px-4 py-3 text-right tabular-nums", !isOpen && "border-b border-border/60")}>{money(r.spend)}{showDeltas && <><br /><Delta v={delta(r.id, "spend")} inverse /></>}</td>
                    <td className={cn("px-4 py-3 text-right tabular-nums", !isOpen && "border-b border-border/60")}>{money(r.sales)}{showDeltas && <><br /><Delta v={delta(r.id, "sales")} /></>}</td>
                    <td className={cn("px-4 py-3 text-right font-semibold tabular-nums", !isOpen && "border-b border-border/60", r.roas >= 3 ? "text-success" : r.roas < 1.5 ? "text-destructive" : "text-foreground")}>{r.roas.toFixed(2)}x</td>
                    <td className={cn("px-4 py-3", !isOpen && "border-b border-border/60")}><Spark id={r.id} w={96} area /></td>
                    <td className={cn("px-3 py-3", !isOpen && "border-b border-border/60")}>
                      <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180 text-primary")} />
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-primary/[0.04]">
                      <td colSpan={7} className="border-b border-border px-4 pb-4 pt-0">
                        <div className="grid gap-4 rounded-lg border border-border bg-card p-4 lg:grid-cols-[1.2fr_1fr]">
                          <div>
                            <div className="mb-1 flex items-baseline justify-between">
                              <p className="text-xs font-medium text-muted-foreground">Sales · last 20 days</p>
                              <Delta v={delta(r.id, "sales")} />
                            </div>
                            <MiniArea id={r.id} />
                          </div>
                          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
                            {[
                              ["Budget", money(r.dailyBudget), "dailyBudget"], ["ACOS", `${r.acos.toFixed(1)}%`, "acos"], ["Orders", num(r.orders), "orders"], ["Units", num(r.units), "units"],
                              ["Impr.", num(r.impressions), "impressions"], ["Clicks", num(r.clicks), "clicks"], ["CTR", `${r.ctr.toFixed(2)}%`, "ctr"], ["CPC", money(r.cpc, 2), "cpc"],
                            ].map(([l, v, k]) => (
                              <div key={k}>
                                <p className="text-[11px] text-muted-foreground">{l}</p>
                                <p className="text-sm font-semibold tabular-nums text-foreground">{v}</p>
                                <Delta v={delta(r.id, k)} inverse={INVERSE.has(k)} />
                              </div>
                            ))}
                            <div className="col-span-4 flex gap-1.5 border-t border-border pt-3">
                              <button className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground"><ExternalLink className="h-3 w-3" />Open campaign</button>
                              <button className="inline-flex h-7 items-center gap-1.5 rounded-md bg-muted px-2.5 text-xs font-medium text-foreground hover:bg-muted/70">{r.status === "paused" ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}{r.status === "paused" ? "Resume" : "Pause"}</button>
                              <button className="inline-flex h-7 items-center gap-1.5 rounded-md bg-muted px-2.5 text-xs font-medium text-foreground hover:bg-muted/70"><Wallet className="h-3 w-3" />Adjust budget</button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- 3. Heat: each number on a tile shaded by how it ranks ----------
function Heat({ rows, selected, toggle, toggleAll, showDeltas, sort, onSort }: VariantProps) {
  // Shade by rank within the column (not min–max), so one outlier does not wash out the rest.
  const sorted = useMemo(() => Object.fromEntries(METRICS.map((m) => [m.key, rows.map((r) => r[m.key] as number).sort((x, y) => x - y)])), [rows]) as Record<string, number[]>;
  const tile = (m: Metric, v: number) => {
    const list = sorted[m.key];
    const t = list.length > 1 ? list.indexOf(v) / (list.length - 1) : 0.5;
    if (m.tone === "volume") return { background: `hsl(var(--primary) / ${(0.05 + t * 0.28).toFixed(3)})`, color: "hsl(var(--foreground))" };
    const goodness = m.inverse ? 1 - t : t; // 1 = best
    const strength = Math.abs(goodness - 0.5) * 2; // 0 middle, 1 extreme
    const hue = goodness >= 0.5 ? "var(--success)" : "var(--destructive)";
    return { background: `hsl(${hue} / ${(strength < 0.25 ? 0 : 0.03 + strength * 0.2).toFixed(3)})`, color: strength > 0.7 ? `hsl(${hue})` : "hsl(var(--foreground))" };
  };
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-end gap-4 border-b border-border px-4 py-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-5 rounded-sm bg-gradient-to-r from-[hsl(var(--destructive)/0.3)] via-transparent to-[hsl(var(--success)/0.3)]" />worse → better</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-5 rounded-sm bg-gradient-to-r from-[hsl(var(--primary)/0.05)] to-[hsl(var(--primary)/0.33)]" />less → more (volume)</span>
      </div>
      <div className="max-h-[600px] overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-[13px]">
          <thead className="sticky top-0 z-10 bg-card">
            <tr>
              <th className="w-10 border-b border-border px-4 py-2.5"><Checkbox checked={allState(rows, selected)} onCheckedChange={toggleAll} aria-label="Select all" /></th>
              <th className="border-b border-border px-3 py-2.5 text-left">
                <button onClick={() => onSort("name")} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">Campaign <SortMark k="name" sort={sort} /></button>
              </th>
              {METRICS.map((m) => (
                <th key={m.key} className="border-b border-border px-1.5 py-2.5 text-right">
                  <button onClick={() => onSort(m.key)} className="ml-auto inline-flex items-center gap-1 px-2 text-xs font-medium text-muted-foreground hover:text-foreground">{m.label} <SortMark k={m.key} sort={sort} /></button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const on = selected.has(r.id);
              return (
                <tr key={r.id} className={cn("group", on && "bg-primary/[0.04]")}>
                  <td className="border-b border-border/50 px-4 py-1.5"><Checkbox checked={on} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} /></td>
                  <td className="border-b border-border/50 px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT[r.status])} />
                      <span className="max-w-[230px] truncate font-medium text-foreground group-hover:text-primary">{r.name}</span>
                    </div>
                  </td>
                  {METRICS.map((m) => (
                    <td key={m.key} className="border-b border-border/50 px-1.5 py-1.5">
                      <div className="rounded-md px-2.5 py-1.5 text-right tabular-nums" style={tile(m, r[m.key] as number)}>
                        <span className="font-medium">{m.fmt(r[m.key] as number)}</span>
                        {showDeltas && <Delta v={delta(r.id, m.key)} inverse={m.inverse} className="ml-1.5" />}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- 4. Editorial: ranked, typographic, no grid ----------
function Editorial({ rows, selected, toggle, toggleAll, showDeltas, sort, onSort }: VariantProps) {
  const hero = sort && sort.key !== "name" ? METRICS.find((m) => m.key === sort.key)! : METRICS[2];
  const rest = METRICS.filter((m) => m.key !== hero.key && m.key !== "dailyBudget").slice(0, 4);
  const max = Math.max(...rows.map((r) => r[hero.key] as number), 1);
  return (
    <div className="rounded-xl border border-border bg-card px-6 py-2">
      <div className="flex items-center gap-4 border-b-2 border-foreground py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
        <Checkbox checked={allState(rows, selected)} onCheckedChange={toggleAll} aria-label="Select all" />
        <span className="w-10">#</span>
        <button onClick={() => onSort("name")} className="flex flex-1 items-center gap-1 text-left">Campaign <SortMark k="name" sort={sort} /></button>
        <button onClick={() => onSort(hero.key)} className="flex w-[220px] items-center justify-end gap-1">{hero.label} <SortMark k={hero.key} sort={sort} /></button>
        <span className="hidden w-[360px] text-right xl:block">Also</span>
        <span className="w-6" />
      </div>
      <div className="max-h-[560px] overflow-auto">
        {rows.map((r, i) => {
          const on = selected.has(r.id);
          return (
            <div key={r.id} className={cn("group flex items-center gap-4 border-b border-border/70 py-4 transition-colors", on && "bg-primary/[0.04]")}>
              <Checkbox checked={on} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} />
              <span className="w-10 font-heading text-[28px] font-light leading-none tabular-nums text-muted-foreground/40 group-hover:text-primary/60">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold tracking-tight text-foreground">{r.name}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  <span className="font-medium uppercase tracking-wider">{STATUS_LABEL[r.status]}</span> · {r.type === "auto" ? "Auto" : "Manual"} · {r.biddingStrategy} · {money(r.dailyBudget)}/day
                </p>
              </div>
              <div className="w-[220px] text-right">
                <p className="text-xl font-semibold tabular-nums tracking-tight text-foreground">{hero.fmt(r[hero.key] as number)}</p>
                <div className="mt-1 flex items-center justify-end gap-2">
                  {showDeltas && <Delta v={delta(r.id, hero.key)} inverse={hero.inverse} />}
                  <div className="h-[3px] w-24 bg-muted"><div className="h-full bg-foreground" style={{ width: `${((r[hero.key] as number) / max) * 100}%` }} /></div>
                </div>
              </div>
              <div className="hidden w-[360px] grid-cols-4 gap-3 text-right xl:grid">
                {rest.map((m) => (
                  <div key={m.key}>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                    <p className="text-[13px] tabular-nums text-foreground">{m.fmt(r[m.key] as number)}</p>
                  </div>
                ))}
              </div>
              <ArrowRight className="h-4 w-6 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 5. Workbench: edit in place, keyboard, pins ----------
const EDITABLE_STATUSES: CampaignStatus[] = ["live", "paused", "scheduled", "archived"];
function Workbench({ rows, setRows, selected, toggle, toggleAll, showDeltas, sort, onSort }: VariantProps) {
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const [focus, setFocus] = useState(0);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const ordered = useMemo(() => [...rows.filter((r) => pinned.has(r.id)), ...rows.filter((r) => !pinned.has(r.id))], [rows, pinned]);

  useEffect(() => { box.current?.querySelector(`[data-row="${focus}"]`)?.scrollIntoView({ block: "nearest" }); }, [focus]);

  const update = (id: string, patch: Partial<Campaign>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const pin = (id: string) => setPinned((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div
      ref={box}
      tabIndex={0}
      onKeyDown={(e) => {
        if (editing) return;
        if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); setFocus((f) => Math.min(ordered.length - 1, f + 1)); }
        if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); setFocus((f) => Math.max(0, f - 1)); }
        if (e.key === " " || e.key === "x") { e.preventDefault(); const r = ordered[focus]; if (r) toggle(r.id); }
        if (e.key === "p") { const r = ordered[focus]; if (r) pin(r.id); }
      }}
      className="overflow-hidden rounded-xl border border-border bg-card outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-1.5 text-[11px] text-muted-foreground">
        <span>Click the table, then</span>
        {[["↑ ↓", "move"], ["Space", "select"], ["P", "pin"]].map(([k, l]) => (
          <span key={k} className="flex items-center gap-1"><kbd className="rounded border border-border bg-card px-1.5 py-px font-mono text-[10px] text-foreground">{k}</kbd>{l}</span>
        ))}
        <span className="ml-auto">Click a status or budget to edit it</span>
      </div>
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-[13px]">
          <thead className="sticky top-0 z-10 bg-card">
            <tr>
              <th className="w-10 border-b border-border px-4 py-2.5"><Checkbox checked={allState(rows, selected)} onCheckedChange={toggleAll} aria-label="Select all" /></th>
              <th className="border-b border-border px-3 py-2.5 text-left">
                <button onClick={() => onSort("name")} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">Campaign <SortMark k="name" sort={sort} /></button>
              </th>
              <th className="border-b border-border px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
              {METRICS.map((m) => (
                <th key={m.key} className="border-b border-border px-3 py-2.5 text-right">
                  <button onClick={() => onSort(m.key)} className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">{m.label} <SortMark k={m.key} sort={sort} /></button>
                </th>
              ))}
              <th className="w-[84px] border-b border-border" />
            </tr>
          </thead>
          <tbody>
            {ordered.map((r, i) => {
              const on = selected.has(r.id);
              const isPinned = pinned.has(r.id);
              const lastPinned = isPinned && !pinned.has(ordered[i + 1]?.id ?? "");
              return (
                <tr
                  key={r.id}
                  data-row={i}
                  onMouseDown={() => setFocus(i)}
                  className={cn("group", on ? "bg-primary/[0.05]" : focus === i ? "bg-muted/60" : "hover:bg-muted/30", isPinned && !on && "bg-warning/[0.04]")}
                >
                  <td className={cn("relative border-b px-4 py-2", lastPinned ? "border-b-2 border-warning/40" : "border-border/60")}>
                    {focus === i && <span className="absolute inset-y-1 left-0 w-[3px] rounded-r bg-primary" />}
                    <Checkbox checked={on} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} />
                  </td>
                  <td className={cn("border-b px-3 py-2", lastPinned ? "border-b-2 border-warning/40" : "border-border/60")}>
                    <div className="flex items-center gap-1.5">
                      {isPinned && <Pin className="h-3 w-3 shrink-0 fill-warning text-warning" />}
                      <span className="max-w-[220px] truncate font-medium text-foreground">{r.name}</span>
                    </div>
                  </td>
                  <td className={cn("border-b px-3 py-2", lastPinned ? "border-b-2 border-warning/40" : "border-border/60")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-transparent transition hover:ring-border", STATUS_CHIP[r.status])}>
                          {STATUS_LABEL[r.status]} <ChevronDown className="h-3 w-3 opacity-60" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-40 p-1">
                        {EDITABLE_STATUSES.map((s) => (
                          <button key={s} onClick={() => update(r.id, { status: s })} className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-muted">
                            <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[s])} />{STATUS_LABEL[s]}
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </td>
                  {METRICS.map((m) => (
                    <td key={m.key} className={cn("border-b px-3 py-2 text-right tabular-nums text-foreground", lastPinned ? "border-b-2 border-warning/40" : "border-border/60")}>
                      {m.key === "dailyBudget" ? (
                        editing === r.id ? (
                          <input
                            autoFocus
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onBlur={() => setEditing(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") { const n = parseFloat(draft); if (n > 0) update(r.id, { dailyBudget: n }); setEditing(null); }
                              if (e.key === "Escape") setEditing(null);
                            }}
                            className="h-7 w-20 rounded-md border border-primary bg-card px-2 text-right text-[13px] outline-none ring-2 ring-primary/20"
                          />
                        ) : (
                          <button
                            onClick={() => { setEditing(r.id); setDraft(String(r.dailyBudget)); }}
                            className="group/b inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-muted"
                          >
                            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover/b:opacity-100" />
                            {m.fmt(r.dailyBudget)}
                          </button>
                        )
                      ) : (
                        <>
                          {m.fmt(r[m.key] as number)}
                          {showDeltas && <Delta v={delta(r.id, m.key)} inverse={m.inverse} className="ml-1.5" />}
                        </>
                      )}
                    </td>
                  ))}
                  <td className={cn("border-b px-2 py-2", lastPinned ? "border-b-2 border-warning/40" : "border-border/60")}>
                    <div className="flex justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => pin(r.id)} aria-label={isPinned ? "Unpin" : "Pin"} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">{isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}</button>
                      <button aria-label="Open" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" /></button>
                      <button aria-label="More" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                    </div>
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

const VARIANTS: Record<DesignId, (p: VariantProps) => ReactNode> = {
  pulse: Pulse,
  expand: Expand,
  heat: Heat,
  editorial: Editorial,
  workbench: Workbench,
};

export default function TableDesigns() {
  const [design, setDesign] = useState<DesignId>("pulse");
  const [data, setData] = useState<Campaign[]>(() => mockCampaigns.map((c) => ({ ...c })));
  const [search, setSearch] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);

  const rows = useMemo(() => {
    let r = data.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    if (sort) {
      r = [...r].sort((a, b) => {
        const av = a[sort.key], bv = b[sort.key];
        const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return r;
  }, [data, search, sort]);

  const toggle = (id: string) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected((p) => (rows.every((r) => p.has(r.id)) ? new Set() : new Set(rows.map((r) => r.id))));
  const onSort = (k: SortKey) => setSort((s) => (s?.key !== k ? { key: k, dir: "desc" } : s.dir === "desc" ? { key: k, dir: "asc" } : null));

  const d = DESIGNS.find((x) => x.value === design)!;
  const Variant = VARIANTS[design];

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Table designs" subtitle="Round 2 — five new directions on the same data and toolbar. Pick one to use across the app." />

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
          <Variant rows={rows} setRows={setData} selected={selected} toggle={toggle} toggleAll={toggleAll} showDeltas={showDeltas} sort={sort} onSort={onSort} />
        </div>
      </div>
    </AppLayout>
  );
}
