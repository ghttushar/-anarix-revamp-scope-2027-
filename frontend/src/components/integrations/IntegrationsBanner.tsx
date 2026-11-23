import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AanMascot } from "@/components/aan/AanMascot";
import { cn } from "@/lib/utils";
import { ChatGptLogo, ClaudeLogo, SlackLogo } from "./BrandLogos";
import "./integrations-banner.css";

/** Dismissing hides the banner everywhere for the rest of the session. */
const DISMISS_KEY = "anarix_integrations_banner_dismissed";
/** Each slide stays this long, unless the pointer or focus is on the banner. */
const AUTO_ADVANCE_MS = 7000;

export type BannerConnect = "mcp" | "workspace";

function McpVisual() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      <ClaudeLogo size={26} />
      <span className="ib-link"><span className="ib-signal" /></span>
      <AanMascot size={26} interactive={false} />
      <span className="ib-link"><span className="ib-signal ib-signal--late" /></span>
      <ChatGptLogo size={26} />
    </div>
  );
}

/** A tiny Slack thread: a teammate asks @Aan why profit is down, Aan replies with a chart and an Approve fix chip. */
function SlackVisual() {
  return (
    <div className="relative flex items-start gap-2 w-[200px]" aria-hidden="true">
      <span className="relative shrink-0">
        <AanMascot size={24} interactive={false} />
        <span className="absolute -bottom-1 -right-1 rounded bg-card p-[1px] shadow-sm">
          <SlackLogo size={10} />
        </span>
      </span>
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="ib-ask flex items-center gap-1.5 rounded-md bg-muted/70 px-2 py-1 text-[11px] text-foreground">
          <span className="h-4 w-4 shrink-0 rounded-full bg-primary/15 text-primary text-[8px] font-semibold flex items-center justify-center">RS</span>
          <span className="truncate"><b className="text-primary font-semibold">@Aan</b> why is profit down?</span>
        </div>
        <div className="relative h-[34px]">
          <span className="ib-typing absolute left-1 top-2"><i /><i /><i /></span>
          <div className="ib-reply absolute inset-0 flex items-center gap-2 rounded-md border border-border bg-card px-2">
            <span className="flex h-5 items-end gap-[2px]">
              {[62, 78, 70, 88].map((h) => <i key={h} className="w-[3px] rounded-sm bg-primary/60" style={{ height: `${h}%` }} />)}
              <i className="w-[3px] rounded-sm bg-destructive" style={{ height: "38%" }} />
            </span>
            <span className="flex-1 min-w-0 leading-tight">
              <span className="block text-[10px] text-foreground"><b>−12%</b> net profit</span>
              <span className="block truncate text-[9px] text-muted-foreground">Bullet copy overwritten · 14 ASINs</span>
            </span>
            <span className="relative h-4 w-[58px] shrink-0 text-[9px] font-medium">
              <span className="ib-chip-approve absolute inset-0 flex items-center justify-center rounded bg-primary text-primary-foreground">Approve fix</span>
              <span className="ib-chip-done absolute inset-0 flex items-center justify-center rounded bg-success/15 text-success">✓ Approved</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const SLIDES: { key: BannerConnect; Visual: () => JSX.Element; headline: string; subline: string; cta: string }[] = [
  {
    key: "mcp",
    Visual: McpVisual,
    headline: "Connect Claude & ChatGPT to Aan",
    subline: "Real marketplace intelligence through MCP. Available on Diamond and above.",
    cta: "Connect MCP",
  },
  {
    key: "workspace",
    Visual: SlackVisual,
    headline: "Bring Aan into Slack",
    subline: "Alerts, answers and approvals right in your channels. Teams and Google Chat coming soon.",
    cta: "Connect",
  },
];

/**
 * What's new: connect MCP, or bring Aan into Slack. A two-slide carousel. On the Integrations page its buttons open
 * the connect panels directly (onConnect); elsewhere they open Integrations with that panel already open.
 */
export function IntegrationsBanner({ onConnect, className }: { onConnect?: (kind: BannerConnect) => void; className?: string }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(() => {
    try { return sessionStorage.getItem(DISMISS_KEY) !== "true"; } catch { return true; }
  });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!visible || paused) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [visible, paused, index]);

  if (!visible) return null;

  const dismiss = () => {
    try { sessionStorage.setItem(DISMISS_KEY, "true"); } catch { /* storage unavailable */ }
    setVisible(false);
  };
  const connect = (kind: BannerConnect) =>
    onConnect ? onConnect(kind) : navigate("/settings/integrations", { state: { connect: kind } });

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="What's new"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn("relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-primary/[0.07] via-card to-card", className)}
    >
      <div className="grid">
        {SLIDES.map(({ key, Visual, headline, subline, cta }, i) => {
          const active = i === index;
          return (
            <div
              key={key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              aria-hidden={!active}
              className={cn(
                "col-start-1 row-start-1 flex items-center gap-5 px-5 py-4 pr-12 transition-opacity duration-500",
                active ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <div className="hidden sm:flex w-[200px] shrink-0 items-center justify-center">
                <Visual />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">{headline}</h2>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">New</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{subline}</p>
              </div>
              <Button size="sm" tabIndex={active ? 0 : -1} onClick={() => connect(key)}>
                {cta}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-label={`Show banner ${i + 1} of ${SLIDES.length}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn("h-1.5 rounded-full transition-all", i === index ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50")}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
