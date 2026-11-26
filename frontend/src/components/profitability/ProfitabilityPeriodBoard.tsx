import { useMemo, useState } from "react";
import { format, startOfMonth, endOfMonth, subDays, subMonths, isSameMonth } from "date-fns";
import { Calendar as CalendarIcon, ChevronRight, ChevronsDown, ChevronsRight, Sparkles, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";
import { ProfitabilitySummary, TrendDataPoint } from "@/types/profitability";
import { MetricFrequencyChart, MetricKey, Frequency } from "./MetricFrequencyChart";
import { getCountryFlagIcon } from "@legacy/utils";
import { useCountUp } from "@/hooks/useCountUp";

/** Each period has its own mood (profit-kit.css): a pastel wash on its header and an accent for its marks. */
const ROW_TONE: Record<RowKey, string> = {
  today: "pf-tone-lilac",
  yesterday: "pf-tone-sky",
  this_month: "pf-tone-mint",
  last_month: "pf-tone-peach",
  forecast: "pf-tone-lilac",
};

/** A figure that counts up to its value when it arrives or changes. */
function Count({ value, format }: { value: number; format: (v: number) => string }) {
  const v = useCountUp(value, 700);
  return <>{format(v)}</>;
}

/**
 * The Profitability dashboard's first card: one row per period (Today, Yesterday, This Month, Last Month and the
 * Forecast), each a header bar over six metrics, with the chart for the selected row on the right. "View More" swaps
 * the chart for that period's breakdown in place.
 */

type RowKey = "today" | "yesterday" | "this_month" | "last_month" | "forecast";

interface Row {
  key: RowKey;
  label: string;
  range: string;
  summary: ProfitabilitySummary;
  trend: TrendDataPoint[];
  compareTo: ProfitabilitySummary;
  /** Single day rows pick a day; month rows pick a month. */
  pick?: { mode: "day" | "month"; date: Date; onChange: (d: Date) => void };
  forecast?: boolean;
}

const FORECAST_MULTIPLIER = 1.67;
const FORECAST_CONFIDENCE = 78;

function projected(s: ProfitabilitySummary): ProfitabilitySummary {
  const m = FORECAST_MULTIPLIER;
  return {
    ...s,
    dateLabel: "Forecast",
    gmv: s.gmv * m,
    authSales: s.authSales * m,
    orders: Math.round(s.orders * m),
    units: Math.round(s.units * m),
    returns: Math.round(s.returns * m),
    cancelled: Math.round(s.cancelled * m),
    adCost: s.adCost * m,
    estPayout: s.estPayout * m,
    netProfit: s.netProfit * m,
    breakdown: {
      ...s.breakdown,
      organic: s.breakdown.organic * m,
      sponsoredProducts: s.breakdown.sponsoredProducts * m,
      sponsoredBrands: s.breakdown.sponsoredBrands * m,
      sponsoredVideo: s.breakdown.sponsoredVideo * m,
      cogs: s.breakdown.cogs * m,
      totalExpenses: s.breakdown.totalExpenses * m,
    },
  };
}

/** "GMV | Auth Sales" style label and value pairs. */
function Pair({ a, b, className }: { a: React.ReactNode; b?: React.ReactNode; className?: string }) {
  return (
    <span className={cn("flex flex-wrap items-baseline justify-center gap-x-1", className)}>
      <span className="whitespace-nowrap">{a}</span>
      {b !== undefined && (
        <>
          <span className="text-muted-foreground/40">|</span>
          <span className="whitespace-nowrap">{b}</span>
        </>
      )}
    </span>
  );
}

function DatePick({ pick, children, hoverTone }: { pick: NonNullable<Row["pick"]>; children: React.ReactNode; hoverTone: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" onClick={(e) => e.stopPropagation()} className={cn("flex items-center gap-1.5 rounded px-1.5 py-0.5 transition-colors", hoverTone)}>
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center" onClick={(e) => e.stopPropagation()}>
        <Calendar
          mode="single"
          selected={pick.date}
          onSelect={(d) => {
            if (d) pick.onChange(d);
            setOpen(false);
          }}
          disabled={(d) => d > new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function PeriodRow({
  row, index, selected, expanded, onSelect, onViewMore, formatCurrency,
}: {
  row: Row;
  index: number;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onViewMore: () => void;
  formatCurrency: (v: number) => string;
}) {
  const s = row.summary;
  const n = (v: number) => (v ? Math.round(v).toLocaleString() : "-");
  type Fig = { v: number; f: (x: number) => string };
  const money = (v: number): Fig => ({ v, f: formatCurrency });
  const count = (v: number): Fig => ({ v, f: n });
  const cells: { label: [string, string?]; value: [Fig, Fig?]; net?: boolean }[] = [
    { label: ["GMV", "Auth Sales"], value: [money(s.gmv), money(s.authSales)] },
    { label: ["Orders", "Units"], value: [count(s.orders), count(s.units)] },
    { label: ["Returns", "Cancelled"], value: [count(s.returns), count(s.cancelled)] },
    { label: ["Ad Cost"], value: [money(s.adCost)] },
    { label: ["Est. Payout"], value: [money(s.estPayout)] },
    { label: [row.forecast ? "Est. Net Profit" : "Net Profit"], value: [money(s.netProfit)], net: true },
  ];
  // Calm: a white card; the period's mood shows only as a dot (and, when selected, a side bar and ring).
  const tone = ROW_TONE[row.key];
  const headerTone = "bg-card text-foreground border-b border-border";
  const hoverTone = "hover:bg-hover hover:text-[color:var(--pf-accent)]";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect())}
      style={{ ["--pf-i" as string]: index }}
      className={cn(
        tone,
        "pf-rise pf-lift relative rounded-lg border bg-card overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-[color:var(--pf-accent)] shadow-[0_6px_18px_-10px_var(--pf-accent)] before:absolute before:inset-y-0 before:left-0 before:z-[1] before:w-[3px] before:bg-[color:var(--pf-accent)]"
          : "border-border shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        row.forecast && !selected && "border-dashed border-primary/40"
      )}
    >
      <div className={cn("grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 h-8 text-xs font-semibold transition-colors", headerTone)}>
        <span className="flex items-center gap-2 truncate">
          {row.forecast ? <Sparkles className="h-3 w-3 pf-text" /> : <span className={cn("pf-dot", selected && "pf-pop")} />}
          <span className={cn(selected && "pf-text")}>{row.label}</span>
        </span>
        {row.pick ? (
          <DatePick pick={row.pick} hoverTone={hoverTone}>
            <CalendarIcon className="h-3 w-3 opacity-80" />
            <span className={cn("font-medium", !selected && "text-muted-foreground")}>{row.range}</span>
          </DatePick>
        ) : (
          <span className={cn("flex items-center gap-1.5 font-medium", !selected && "text-muted-foreground")}>
            {row.forecast ? <Sparkles className="h-3 w-3 opacity-80" /> : <CalendarIcon className="h-3 w-3 opacity-80" />}
            {row.range}
          </span>
        )}
        <span className="flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewMore();
            }}
            className={cn("flex items-center gap-1 rounded px-1.5 py-0.5 font-medium transition-colors", !selected && "text-muted-foreground", hoverTone)}
          >
            {expanded ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsDown className="h-3.5 w-3.5" />}
            View More
          </button>
        </span>
      </div>
      <div className="grid grid-cols-[minmax(0,1.8fr)_minmax(0,1.05fr)_minmax(0,1.15fr)_minmax(0,0.85fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] divide-x divide-border">
        {cells.map((c) => (
          <div key={c.label.join("|")} className="px-1 py-2.5 text-center min-w-0">
            <Pair a={c.label[0]} b={c.label[1]} className="text-2xs text-muted-foreground" />
            <Pair
              a={<Count value={c.value[0].v} format={c.value[0].f} />}
              b={c.value[1] ? <Count value={c.value[1].v} format={c.value[1].f} /> : undefined}
              className={cn(
                "mt-1 text-caption font-semibold tabular-nums",
                c.net ? (c.value[0].v < 0 ? "text-destructive" : "text-success") : "text-foreground"
              )}
            />
          </div>
        ))}
      </div>
      {row.forecast && (
        <div className="flex items-center gap-2 border-t border-border/60 px-4 py-1.5">
          <span className="text-2xs text-muted-foreground">Confidence</span>
          <div className="h-1.5 flex-1 rounded-full bg-track overflow-hidden">
            <div className="pf-grow-x h-full rounded-full bg-primary" style={{ width: `${FORECAST_CONFIDENCE}%` }} />
          </div>
          <span className="text-2xs font-medium text-foreground">{FORECAST_CONFIDENCE}% · {FORECAST_MULTIPLIER}x</span>
        </div>
      )}
    </div>
  );
}

/** The breakdown that replaces the chart when a row's View More is open. */
function PeriodBreakdown({ row, onClose, formatCurrency }: { row: Row; onClose: () => void; formatCurrency: (v: number) => string }) {
  const s = row.summary;
  const b = s.breakdown;
  const [open, setOpen] = useState<Record<string, boolean>>({ sales: true });
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const n = (v: number) => (v ? Math.round(v).toLocaleString() : "-");
  const otherFees = Math.max(0, b.totalExpenses - s.adCost - b.cogs);

  const groups: { key: string; label: string; value: string; tone: string; children?: { label: string; value: string }[] }[] = [
    {
      key: "sales", label: "Sales", tone: "pf-tone-lilac", value: formatCurrency(s.gmv),
      children: [
        { label: "Organic", value: formatCurrency(b.organic) },
        { label: "Sponsored Products", value: formatCurrency(b.sponsoredProducts) },
        { label: "Sponsored Brands", value: formatCurrency(b.sponsoredBrands) },
        { label: "Sponsored Video", value: formatCurrency(b.sponsoredVideo) },
      ],
    },
    {
      key: "orders", label: "Orders", tone: "pf-tone-sky", value: n(s.orders),
      children: [
        { label: "Auth Sales", value: formatCurrency(s.authSales) },
        { label: "Returns", value: n(s.returns) },
        { label: "Cancelled", value: n(s.cancelled) },
      ],
    },
    {
      key: "units", label: "Total Units", tone: "pf-tone-sky", value: n(s.units),
      children: [
        { label: "Returned units", value: n(s.returns) },
        { label: "Cancelled units", value: n(s.cancelled) },
      ],
    },
    { key: "cogs", label: "COGS", tone: "pf-tone-peach", value: formatCurrency(b.cogs) },
    {
      key: "expenses", label: "Total Expenses", tone: "pf-tone-rose", value: formatCurrency(b.totalExpenses),
      children: [
        { label: "Ad Cost", value: formatCurrency(s.adCost) },
        { label: "COGS", value: formatCurrency(b.cogs) },
        { label: "Fees & other", value: formatCurrency(otherFees) },
      ],
    },
  ];
  const calculated = [
    { label: "Net Profit", value: formatCurrency(s.netProfit) },
    { label: "TACOS", value: `${b.tacos.toFixed(1)}%` },
    { label: "ROAS", value: `${b.roas.toFixed(2)}x` },
  ];

  return (
    <div className="pf-rise rounded-lg border border-border bg-card overflow-hidden flex flex-col h-full min-h-[320px]">
      <div className={cn(ROW_TONE[row.key], "pf-bar flex items-center gap-2 border-b border-border px-3 h-11 shrink-0 text-foreground")}>
        <button type="button" onClick={onClose} className="rounded p-1 hover:bg-primary/10 transition-colors" aria-label="Back to chart" title="Back to chart">
          <ChevronsRight className="h-4 w-4" />
        </button>
        <img src={getCountryFlagIcon("US")} alt="" className="h-4 w-6 rounded-[2px] object-cover" />
        <span className="flex-1 min-w-0">
          <span className="block truncate text-sm font-semibold">Where every dollar went</span>
          <span className="block truncate text-2xs text-muted-foreground">{row.label} · {row.range}</span>
        </span>
        <button type="button" onClick={onClose} className="rounded p-1 hover:bg-primary/10 transition-colors" aria-label="Close breakdown">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="pf-stagger flex-1 min-h-0 overflow-auto">
        {groups.map((g) => (
          <div key={g.key} className={cn(g.tone, "border-b border-border/60")}>
            <button
              type="button"
              onClick={() => g.children && toggle(g.key)}
              className={cn("pf-bar flex w-full items-center gap-2 px-3 py-2 text-left transition-colors", g.children ? "hover:bg-hover" : "cursor-default")}
            >
              <span className="w-3.5 shrink-0 text-muted-foreground">
                {g.children && <ChevronRight className={cn("h-3.5 w-3.5 transition-transform duration-200", open[g.key] && "rotate-90")} />}
              </span>
              <span className="pf-dot" />
              <span className="flex-1 text-sm font-medium text-foreground">{g.label}</span>
              <span className="text-sm font-semibold tabular-nums text-foreground">{g.value}</span>
            </button>
            {g.children && open[g.key] && (
              <div className="pf-stagger pb-1">
                {g.children.map((c) => (
                  <div key={c.label} className="flex items-center justify-between py-1.5 pl-10 pr-3 text-sm border-t border-border/40 first:border-t-0">
                    <span className="text-foreground">{c.label}</span>
                    <span className="tabular-nums text-foreground">{c.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pf-tone-mint border-t border-border px-3 py-2 shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">What's left</p>
        {calculated.map((c, i) => (
          <div key={c.label} className="flex items-center justify-between py-1 text-xs border-t border-border/60 first:border-t-0">
            <span className="text-muted-foreground">{c.label}</span>
            <span className={cn("font-semibold tabular-nums", i === 0 ? (s.netProfit < 0 ? "text-destructive" : "text-success") : "text-foreground")}>{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  summaries: ProfitabilitySummary[];
  trendDataByPeriod: Record<string, TrendDataPoint[]>;
  onPeriodChange?: (period: string) => void;
}

export function ProfitabilityPeriodBoard({ summaries, trendDataByPeriod, onPeriodChange }: Props) {
  const { formatCurrency } = useCurrency();
  const [selected, setSelected] = useState<RowKey>("today");
  const [expanded, setExpanded] = useState<RowKey | null>(null);
  const [chartMetrics, setChartMetrics] = useState<MetricKey[]>(["gmv", "netProfit"]);
  const [chartFrequency, setChartFrequency] = useState<Frequency>("daily");

  const today = new Date();
  const [todayDate, setTodayDate] = useState<Date>(today);
  const [yesterdayDate, setYesterdayDate] = useState<Date>(() => subDays(today, 1));
  const [thisMonthDate, setThisMonthDate] = useState<Date>(today);
  const [lastMonthDate, setLastMonthDate] = useState<Date>(() => subMonths(today, 1));

  const by = (p: ProfitabilitySummary["period"], i: number) => summaries.find((s) => s.period === p) || summaries[i] || summaries[0];
  const todayS = by("today", 0);
  const yesterdayS = by("yesterday", 1);
  const thisMonthS = by("this_month", 2);
  const lastMonthS = by("last_month", 3);
  const trend = (k: string, fallback: string) => trendDataByPeriod[k] || trendDataByPeriod[fallback] || [];

  const day = (d: Date) => format(d, "MMM dd, yyyy");
  const monthRange = (d: Date) => {
    const end = isSameMonth(d, today) ? subDays(today, 1) : endOfMonth(d);
    return `${format(startOfMonth(d), "MMM dd, yyyy")} - ${format(end < startOfMonth(d) ? startOfMonth(d) : end, "MMM dd, yyyy")}`;
  };

  const rows: Row[] = useMemo(() => [
    { key: "today", label: "Today", range: day(todayDate), summary: todayS, compareTo: yesterdayS, trend: trend("today", "this_month"), pick: { mode: "day", date: todayDate, onChange: setTodayDate } },
    { key: "yesterday", label: "Yesterday", range: day(yesterdayDate), summary: yesterdayS, compareTo: todayS, trend: trend("yesterday", "last_month"), pick: { mode: "day", date: yesterdayDate, onChange: setYesterdayDate } },
    { key: "this_month", label: "This Month", range: monthRange(thisMonthDate), summary: thisMonthS, compareTo: lastMonthS, trend: trend("this_month", "this_month"), pick: { mode: "month", date: thisMonthDate, onChange: setThisMonthDate } },
    { key: "last_month", label: "Last Month", range: monthRange(lastMonthDate), summary: lastMonthS, compareTo: thisMonthS, trend: trend("last_month", "this_month"), pick: { mode: "month", date: lastMonthDate, onChange: setLastMonthDate } },
    {
      key: "forecast", label: "Forecast", range: `Projected to ${format(endOfMonth(today), "MMM dd, yyyy")}`,
      summary: projected(thisMonthS), compareTo: thisMonthS, forecast: true,
      trend: trend("this_month", "this_month").map((d) => ({ ...d, orders: Math.round(d.orders * FORECAST_MULTIPLIER), units: Math.round(d.units * FORECAST_MULTIPLIER) })),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [summaries, trendDataByPeriod, todayDate, yesterdayDate, thisMonthDate, lastMonthDate]);

  const selectedRow = rows.find((r) => r.key === selected) ?? rows[0];
  const expandedRow = expanded ? rows.find((r) => r.key === expanded) : null;

  const select = (k: RowKey) => {
    setSelected(k);
    if (k !== "forecast") onPeriodChange?.(k);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4 items-stretch">
      <div className="space-y-2.5 min-w-0">
        {rows.map((r, i) => (
          <PeriodRow
            key={r.key}
            row={r}
            index={i}
            selected={selected === r.key}
            expanded={expanded === r.key}
            onSelect={() => select(r.key)}
            onViewMore={() => {
              select(r.key);
              setExpanded((e) => (e === r.key ? null : r.key));
            }}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>
      {/* The five cards set the row's height; the chart (or breakdown) fills exactly that, whichever card is selected.
          On xl it is taken out of the flow (absolute) so its own content can never make the row taller. */}
      <div className="relative min-w-0 h-[440px] xl:h-auto">
        <div className="h-full xl:absolute xl:inset-0">
        {expandedRow ? (
          <PeriodBreakdown row={expandedRow} onClose={() => setExpanded(null)} formatCurrency={formatCurrency} />
        ) : (
          <MetricFrequencyChart
            summary={selectedRow.summary}
            compareTo={selectedRow.compareTo}
            trendData={selectedRow.trend}
            selectedMetrics={chartMetrics}
            onSelectedMetricsChange={setChartMetrics}
            frequency={chartFrequency}
            onFrequencyChange={setChartFrequency}
            formatCurrency={formatCurrency}
            contextLabel={`${selectedRow.label} · ${selectedRow.range}`}
          />
        )}
        </div>
      </div>
    </div>
  );
}
