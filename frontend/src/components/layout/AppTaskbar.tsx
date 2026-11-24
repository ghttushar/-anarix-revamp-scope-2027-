import { useState, useEffect, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarIcon, ChevronRight, Play, Bell, Lightbulb, RefreshCw } from "lucide-react";
import { AanGlyph } from "@/components/aan/AanGlyph";
import { format, subDays, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, startOfQuarter, endOfQuarter, subQuarters } from "date-fns";

import { cn } from "@/lib/utils";
import { useFilter } from "@/contexts/FilterContext";
import { useVisualEffects } from "@/contexts/VisualEffectsContext";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import { useAan } from "@/components/aan";
import { useInsights } from "@/components/insights";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";
import { useAanEvents } from "@/components/aan/autonomous/AanEventsContext";
import { BarChip, BarChipTrigger, BarDivider, BarIconButton, type BarChipProps } from "@/components/bars";

interface DatePreset {
  label: string;
  getRange: () => { from: Date; to: Date };
}

const today = () => new Date();

const DATE_PRESET_GROUPS: { label: string; presets: DatePreset[] }[] = [
  {
    label: "Days",
    presets: [
      { label: "Today", getRange: () => ({ from: today(), to: today() }) },
      { label: "Yesterday", getRange: () => { const d = subDays(today(), 1); return { from: d, to: d }; } },
      { label: "Last 3 days", getRange: () => ({ from: subDays(today(), 2), to: today() }) },
      { label: "Last 7 days", getRange: () => ({ from: subDays(today(), 6), to: today() }) },
      { label: "Last 14 days", getRange: () => ({ from: subDays(today(), 13), to: today() }) },
      { label: "Last 30 days", getRange: () => ({ from: subDays(today(), 29), to: today() }) },
      { label: "Last 60 days", getRange: () => ({ from: subDays(today(), 59), to: today() }) },
    ],
  },
  {
    label: "Weeks",
    presets: [
      { label: "This week", getRange: () => ({ from: startOfWeek(today()), to: today() }) },
      { label: "Last week", getRange: () => { const s = startOfWeek(subWeeks(today(), 1)); return { from: s, to: endOfWeek(s) }; } },
      { label: "2 weeks ago", getRange: () => { const s = startOfWeek(subWeeks(today(), 2)); return { from: s, to: endOfWeek(s) }; } },
    ],
  },
  {
    label: "Months",
    presets: [
      { label: "This month", getRange: () => ({ from: startOfMonth(today()), to: today() }) },
      { label: "Last month", getRange: () => { const s = startOfMonth(subMonths(today(), 1)); return { from: s, to: endOfMonth(s) }; } },
      { label: "Last 3 months", getRange: () => ({ from: subMonths(today(), 3), to: today() }) },
    ],
  },
  {
    label: "Quarters",
    presets: [
      { label: "This quarter", getRange: () => ({ from: startOfQuarter(today()), to: today() }) },
      { label: "Last quarter", getRange: () => { const s = startOfQuarter(subQuarters(today(), 1)); return { from: s, to: endOfQuarter(s) }; } },
    ],
  },
];

const MARKETPLACE_LOGOS: Record<string, string | null> = {
  amazon: amazonLogo,
  walmart: walmartLogo,
  shopify: null,
  tiktok: null,
};

const MARKETPLACE_COLORS: Record<string, string> = {
  amazon: "#FF9900",
  walmart: "#0071CE",
  shopify: "#96BF48",
  tiktok: "#000000",
};

function ShopifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M15.34 3.03c-.07 0-.13.04-.15.1-.02.05-.46 1.06-.46 1.06s-.93-.19-.93-.19c-.05-.38-.26-.68-.56-.87a3.07 3.07 0 0 0-.47-.24c-.14-.46-.38-.86-.7-1.09-.55-.4-1.22-.4-1.78-.02-.18.12-.34.29-.47.49-.28-.07-.52-.04-.71.09a.96.96 0 0 0-.36.55c-.14.54.09 1.22.53 1.95-.42.13-.71.32-.73.34l.05.2c.03 0 .79-.42 1.71-.42h.11c.56.02 1.01.2 1.34.53.25.25.42.58.5.96l.02.1 4.16 1.01a.17.17 0 0 0 .2-.12L17.09 4a.17.17 0 0 0-.11-.2l-1.64-.77zM9.73 4.13c.09-.19.23-.35.39-.46.39-.27.87-.27 1.28.04.19.14.36.37.48.68-.35-.04-.72 0-1.08.12-.35-.47-.53-.94-.43-1.32a.56.56 0 0 1 .22-.34c.09-.06.19-.07.32-.04-.06.1-.12.21-.18.32zm1.47 1.1c-.35-.32-.78-.5-1.3-.52h-.1c-.46 0-.85.1-1.17.22.05.08.1.17.16.25.27.4.6.73.96.97.47-.23.99-.37 1.53-.37-.02-.18-.05-.37-.08-.55z" />
      <path d="M20.42 6.64l-4.8-1.17-.42 1.63-1.34-.32c-.1-.4-.3-.74-.58-1.01-.4-.38-.93-.59-1.56-.61h-.12c-.76 0-1.39.27-1.87.53l-.29.17 1.04 12.29 6.6 1.85 4.4-1.6-1.06-11.76zm-5.6 2.37l-.66 2.02s-.72-.39-1.6-.32c-1.29.09-1.3.89-1.29 1.1.07 1.14 3.07 1.39 3.24 4.07.13 2.1-1.12 3.54-2.92 3.66-2.17.14-3.36-1.14-3.36-1.14l.46-1.96s1.2.92 2.16.85c.63-.04.85-.55.83-.91-.09-1.49-2.53-1.4-2.69-3.85-.13-2.07 1.23-4.16 4.22-4.35 1.15-.07 1.74.22 1.74.22l-.13.61z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.8.1V9.01a6.27 6.27 0 0 0-1-.08 6.27 6.27 0 0 0-6.27 6.27A6.27 6.27 0 0 0 9.29 21.5a6.27 6.27 0 0 0 6.27-6.27V8.98a8.22 8.22 0 0 0 4.03 1.05V6.69z" />
    </svg>
  );
}

function StatusDot({ status, className }: { status: "connected" | "syncing" | "error"; className?: string }) {
  const colors = { connected: "bg-emerald-500", syncing: "bg-amber-500", error: "bg-red-500" };
  return <div className={cn("h-2 w-2 rounded-full", colors[status], className)} />;
}

/** A page-specific setting in the bar's variable slot, drawn as a BarChip. */
export type BarFilter = BarChipProps<string> & { key: string };

const AD_TYPE_OPTIONS = [
  { value: "All", label: "All types", short: "All" },
  { value: "SP", label: "Sponsored Products", short: "SP" },
  { value: "SB", label: "Sponsored Brands", short: "SB" },
  { value: "SD", label: "Sponsored Display", short: "SD" },
  { value: "SV", label: "Sponsored Video", short: "SV" },
];
const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly"].map((f) => ({ value: f, label: f }));

export interface BarCrumb {
  label: string;
  href?: string;
}

interface AppTaskbarProps {
  /** Where this page sits when it is a level inside another (Campaign Manager › campaign › ad group). Drawn first,
   *  and only when there are at least two levels; top-level pages have none. */
  breadcrumbs?: BarCrumb[];
  /** Fixed slot 1: the app's date range picker (always first). */
  showDateRange?: boolean;
  /** Built-in settings, in the variable slot right after the date range. */
  showAdType?: boolean;
  showFrequency?: boolean;
  /** Page-specific settings, as chips, after the built-in ones. */
  filters?: BarFilter[];
  /** The Run button: always right after the last setting (it applies them). */
  showRunButton?: boolean;
  onRun?: () => void;
  /** Escape hatch for a control that is not a plain select (a search box, the product picker). Drawn in the variable
   *  slot after the filters; build it on BarChipTrigger so it matches the chips. */
  children?: ReactNode;
  /** When given, the date picker reads and writes these instead of the app's shared date range. */
  dateRangeOverride?: { from: Date; to: Date };
  onDateRangeOverrideChange?: (r: { from: Date; to: Date }) => void;
}

/**
 * The page level metric bar: one row under every page heading, with fixed zones so a control is always in the same
 * place on every page.
 *
 *   [breadcrumb (level pages only)] | [date range] [settings… (variable)] [Run]  ·····  [account · synced] [utilities]
 *
 * Only the middle slot changes from page to page. See components/bars/README.md.
 */
export function AppTaskbar({ breadcrumbs, showAdType = false, showFrequency = false, showDateRange = false, showRunButton = false, onRun, children, filters, dateRangeOverride, onDateRangeOverrideChange }: AppTaskbarProps) {
  const { adType, setAdType, frequency, setFrequency, dateRange: ctxDateRange, setDateRange: setCtxDateRange } = useFilter();
  const dateRange = dateRangeOverride ?? ctxDateRange;
  const setDateRange = onDateRangeOverrideChange ?? setCtxDateRange;
  const { effects } = useVisualEffects();
  const { marketplace } = useMarketplace();
  const { currentAccount } = useAccounts();
  const { openPanel: openAan } = useAan();
  const { openPanel: openInsights } = useInsights();
  const { pendingCount: aanPendingCount } = useAanEvents();
  const navigate = useNavigate();
  const islandOff = !effects.floatingIsland;

  const [draftRange, setDraftRange] = useState<{ from: Date; to: Date }>(dateRange);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  useEffect(() => {
    if (datePopoverOpen) setDraftRange(dateRange);
  }, [datePopoverOpen]);

  const handleApplyDateRange = () => {
    setDateRange(draftRange);
    setDatePopoverOpen(false);
  };

  const marketplaceLogo = MARKETPLACE_LOGOS[marketplace];
  const marketplaceColor = MARKETPLACE_COLORS[marketplace];
  const accountName = currentAccount?.merchantName || "No Account";
  const accountStatus = currentAccount?.status || "connected";
  const syncedAt = currentAccount?.lastSync ? new Date(currentAccount.lastSync) : new Date();

  const renderMarketplaceLogo = () => {
    if (marketplaceLogo) return <img src={marketplaceLogo} alt={marketplace} className="h-3.5 w-auto object-contain" />;
    if (marketplace === "shopify") return <ShopifyIcon className="h-3.5 w-3.5" />;
    if (marketplace === "tiktok") return <TikTokIcon className="h-3.5 w-3.5" />;
    return null;
  };

  return (
    <div
      data-app-taskbar
      data-tour-id="taskbar"
      className="sticky top-0 z-30 flex min-h-12 shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-2 py-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
    >
      {/* Level pages: where you are, first. */}
      {breadcrumbs && breadcrumbs.length > 1 && (
        <>
          <nav aria-label="Breadcrumb" className="flex min-w-0 shrink items-center gap-1 pl-1.5 text-xs">
            {breadcrumbs.map((c, i) => {
              const last = i === breadcrumbs.length - 1;
              return (
                <span key={i} className="flex min-w-0 items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />}
                  {c.href && !last ? (
                    <Link to={c.href} title={c.label} className="min-w-0 max-w-[9rem] truncate rounded px-1 py-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{c.label}</Link>
                  ) : (
                    <span title={c.label} aria-current={last ? "page" : undefined} className={cn("min-w-0 max-w-[14rem] truncate px-1", last ? "font-medium text-foreground" : "text-muted-foreground")}>{c.label}</span>
                  )}
                </span>
              );
            })}
          </nav>
          <BarDivider />
        </>
      )}

      {/* Variable zone: the date range always first, then this page's settings. */}
      {/* With a breadcrumb, the settings keep their width and the breadcrumb truncates instead. */}
      <div className={cn("flex min-w-0 flex-wrap items-center gap-1.5", breadcrumbs && breadcrumbs.length > 1 ? "flex-[1_0_auto]" : "flex-1")}>
        {showDateRange && (
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <BarChipTrigger
                icon={<CalendarIcon />}
                value={`${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`}
                aria-label="Date range"
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="bottom">
              <div className="flex">
                <div className="w-[200px] border-r border-border py-3 space-y-4 max-h-[420px] overflow-auto bg-muted/30">
                  {DATE_PRESET_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-1.5">{group.label}</p>
                      <div className="space-y-0.5 px-2">
                        {group.presets.map((preset) => {
                          const presetRange = preset.getRange();
                          const isSelected =
                            draftRange.from.toDateString() === presetRange.from.toDateString() &&
                            draftRange.to.toDateString() === presetRange.to.toDateString();
                          return (
                            <button
                              key={preset.label}
                              onClick={() => setDraftRange(preset.getRange())}
                              className={cn(
                                "w-full text-left text-xs px-3 py-2 rounded-md transition-colors cursor-pointer font-medium",
                                isSelected ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                              )}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <Calendar
                    mode="range"
                    selected={{ from: draftRange.from, to: draftRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) setDraftRange({ from: range.from, to: range.to });
                      else if (range?.from) setDraftRange({ from: range.from, to: range.from });
                    }}
                    numberOfMonths={2}
                    className="p-4 pointer-events-auto"
                  />
                  <div className="flex items-center justify-between px-4 pb-3 border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground">
                      {format(draftRange.from, "MMM dd, yyyy")} – {format(draftRange.to, "MMM dd, yyyy")}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="xs" onClick={() => setDatePopoverOpen(false)}>Cancel</Button>
                      <Button size="xs" onClick={handleApplyDateRange}>Apply</Button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        {showAdType && <BarChip label="Ad type" value={adType} options={AD_TYPE_OPTIONS} onChange={(v) => setAdType(v as typeof adType)} />}
        {showFrequency && <BarChip label="Frequency" value={frequency} options={FREQUENCY_OPTIONS} onChange={(v) => setFrequency(v as typeof frequency)} />}
        {filters?.map(({ key, ...f }) => <BarChip key={key} {...(f as BarChipProps<string>)} />)}
        {children}
        {/* Run applies the settings, so it always sits right after the last one. */}
        {showRunButton && (
          <Button size="xs" className="ml-0.5 gap-1.5" onClick={onRun} data-bar-run>
            <Play />
            Run
          </Button>
        )}
      </div>

      {/* Fixed zone: account and sync, then (island off) the utilities. */}
      <div className="flex shrink-0 items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-8 cursor-default items-center gap-1.5 rounded-md px-2 text-xs">
              <span className="flex items-center" style={{ color: marketplaceColor }}>{renderMarketplaceLogo()}</span>
              <StatusDot status={accountStatus} className="h-1.5 w-1.5" />
              <span className="taskbar-account-name max-w-[140px] truncate font-medium text-foreground">{accountName}</span>
              <span className="taskbar-last-synced whitespace-nowrap text-muted-foreground">· {format(syncedAt, "h:mm a")}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <p className="font-medium">{accountName}</p>
            <p className="text-muted-foreground">Last synced {format(syncedAt, "MMM d, h:mm a")}</p>
          </TooltipContent>
        </Tooltip>

        {islandOff && (
          <>
            <BarDivider />
            <BarIconButton icon={Lightbulb} label="Insights" onClick={() => openInsights()} />
            <BarIconButton
              icon={Bell}
              label="Signals"
              hint={aanPendingCount > 0 ? `${aanPendingCount} pending` : undefined}
              badge={aanPendingCount}
              onClick={() => navigate("/signals")}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Ask Aan" onClick={() => openAan()}>
                  <AanGlyph className="h-4 w-4 text-primary" staticEyes />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Ask Aan</TooltipContent>
            </Tooltip>
            <BarIconButton icon={RefreshCw} label="Refresh" onClick={() => toast.info("Refreshing data...")} />
          </>
        )}
      </div>
    </div>
  );
}

/** The page level metric bar (same component; the name the bars README uses). */
export const PageBar = AppTaskbar;
