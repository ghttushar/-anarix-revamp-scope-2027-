/**
 * Rules History mock data: the rule types configured for the account, every run of each, and the entities a run
 * touched. Deterministic (seeded), so the same run always shows the same entities.
 */

export type RunStatus = "success" | "partial" | "failed";
export type RunTrigger = "scheduled" | "manual";
export type EntityStatus = "success" | "skipped" | "failed";
export type EntityType = "Keyword" | "Target" | "Campaign" | "Ad group" | "Product";

export interface RuleTypeInfo {
  id: string;
  label: string;
  /** The configured rule's name and lookback (the dialog's header). */
  ruleName: string;
  lookback: string;
  entityTypes: EntityType[];
  /** How the rule changes things: a number it moves (bids, budgets) or an action it takes. */
  kind: "bid" | "budget" | "action" | "inventory";
  runs: number;
}

export interface RuleRun {
  id: string;
  ruleTypeId: string;
  executedAt: Date;
  status: RunStatus;
  trigger: RunTrigger;
  processed: number;
  actioned: number;
  failed: number;
  durationMs: number;
}

export interface RunEntity {
  id: string;
  name: string;
  type: EntityType;
  campaign: string;
  previous: string;
  next: string;
  /** Change in % for numeric moves; null for actions. */
  changePct: number | null;
  status: EntityStatus;
  reason: string;
}

export const ruleTypes: RuleTypeInfo[] = [
  { id: "bidder", label: "Bidder", ruleName: "Conservative Bidder Template", lookback: "7 days", entityTypes: ["Keyword", "Target"], kind: "bid", runs: 42 },
  { id: "budget", label: "Budget", ruleName: "Budget Cap Protection", lookback: "1 day", entityTypes: ["Campaign"], kind: "budget", runs: 36 },
  { id: "harvesting", label: "Keyword Harvesting", ruleName: "Search Term Harvester", lookback: "14 days", entityTypes: ["Keyword"], kind: "action", runs: 18 },
  { id: "inventory", label: "Inventory", ruleName: "Inventory less than 2 weeks of supply", lookback: "30 days", entityTypes: ["Product", "Campaign"], kind: "inventory", runs: 28 },
  { id: "placement", label: "Placement", ruleName: "Placement Bid Modifier", lookback: "14 days", entityTypes: ["Campaign"], kind: "bid", runs: 12 },
  // configured, but it hasn't run yet
  { id: "target", label: "Target", ruleName: "Zero Converter Pauser", lookback: "30 days", entityTypes: ["Target", "Ad group"], kind: "action", runs: 0 },
];

/** Small deterministic PRNG (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (s: string) => Array.from(s).reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);
const pick = <T,>(r: () => number, xs: T[]) => xs[Math.floor(r() * xs.length)];

const NOW = new Date(2026, 10, 26, 22, 30);
const runCache = new Map<string, RuleRun[]>();

/** Every run of a rule type, newest first. */
export function runsFor(ruleTypeId: string): RuleRun[] {
  const cached = runCache.get(ruleTypeId);
  if (cached) return cached;
  const info = ruleTypes.find((t) => t.id === ruleTypeId);
  const r = rng(hash(ruleTypeId));
  const runs: RuleRun[] = [];
  let at = new Date(NOW);
  for (let i = 0; i < (info?.runs ?? 0); i++) {
    // scheduled runs at 22:30 every 1–3 days; now and then a manual run in between
    const manual = r() < 0.18;
    at = new Date(at.getTime() - (manual ? 0.4 + r() * 0.5 : 1 + Math.floor(r() * 3)) * 86400000);
    const when = new Date(at);
    if (manual) when.setHours(9 + Math.floor(r() * 9), Math.floor(r() * 60));
    else when.setHours(22, 30);
    const roll = r();
    const status: RunStatus = roll < 0.08 ? "failed" : roll < 0.22 ? "partial" : "success";
    // one run that found nothing to look at (the dialog's empty state)
    const processed = i === 5 ? 0 : status === "failed" ? Math.floor(r() * 40) : 60 + Math.floor(r() * 280);
    const failed = status === "failed" ? processed : status === "partial" ? Math.max(1, Math.floor(processed * (0.04 + r() * 0.12))) : 0;
    const actioned = status === "failed" ? 0 : Math.floor((processed - failed) * (0.35 + r() * 0.5));
    runs.push({
      id: `${ruleTypeId}-run-${i}`,
      ruleTypeId,
      executedAt: when,
      status,
      trigger: manual ? "manual" : "scheduled",
      processed,
      actioned,
      failed,
      durationMs: status === "failed" ? 1200 + Math.floor(r() * 3000) : 4000 + processed * 25 + Math.floor(r() * 4000),
    });
  }
  runCache.set(ruleTypeId, runs);
  return runs;
}

const CAMPAIGNS = [
  "SP | All | Brand Defence | KT | Ax",
  "SP | Ground Coffee | 12 Oz | KT | Ax",
  "SP | Whole Bean | 2 lb | Auto",
  "SP | Cold Brew | Concentrate | KT",
  "SB | Brand | Video | Hero",
  "SP | Decaf | 12 Oz | Manual",
];
const KEYWORDS = ["organic coffee beans", "dark roast ground", "cold brew coffee", "decaf whole bean", "espresso beans", "medium roast coffee", "coffee gift set", "french press coffee", "single origin coffee", "low acid coffee"];
const PRODUCTS = ["Ground Coffee 12 oz", "Whole Bean 2 lb", "Cold Brew Concentrate", "Decaf Medium Roast", "Espresso Pods 24ct"];

const REASONS: Record<EntityStatus, string[]> = {
  success: ["Non performing — low ad spend", "ACOS above target 35%", "ROAS above 4.0 — scaling up", "Converting search term", "Spend pace above daily cap", "Under 14 days of supply"],
  skipped: ["Already at min bid", "Change below 2% threshold", "Entity paused", "Not enough clicks in lookback", "Already harvested"],
  failed: ["API timeout from marketplace", "Entity archived since run started", "Bid outside marketplace limits"],
};

/** Every entity a run touched (generated on demand, the same every time). */
export function entitiesFor(run: RuleRun): RunEntity[] {
  if (run.processed === 0) return [];
  const info = ruleTypes.find((t) => t.id === run.ruleTypeId)!;
  const r = rng(hash(run.id));
  const list: RunEntity[] = [];
  let failedLeft = run.failed;
  let actionedLeft = run.actioned;
  for (let i = 0; i < run.processed; i++) {
    const type = pick(r, info.entityTypes);
    const campaign = pick(r, CAMPAIGNS);
    const status: EntityStatus = failedLeft > 0 && r() < 0.5 ? "failed" : actionedLeft > 0 && r() < 0.7 ? "success" : "skipped";
    if (status === "failed") failedLeft--;
    if (status === "success") actionedLeft--;
    const idNum = String(100000000000 + Math.floor(r() * 899999999999));
    const name =
      type === "Keyword" || type === "Target" ? pick(r, KEYWORDS)
      : type === "Product" ? pick(r, PRODUCTS)
      : type === "Ad group" ? `${campaign.split(" | ")[1]} | AG`
      : campaign;
    let previous = "";
    let next = "";
    let changePct: number | null = null;
    if (info.kind === "bid" || info.kind === "budget") {
      const base = info.kind === "bid" ? 0.4 + r() * 2.2 : 20 + Math.floor(r() * 180);
      const pct = status === "success" ? (r() < 0.55 ? -1 : 1) * (5 + Math.floor(r() * 25)) : 0;
      const after = base * (1 + pct / 100);
      const fmt = (v: number) => (info.kind === "bid" ? `$${v.toFixed(2)}` : `$${Math.round(v)}`);
      previous = fmt(base);
      next = fmt(after);
      changePct = pct;
    } else if (info.kind === "inventory") {
      previous = "Enabled";
      next = status === "success" ? "Paused" : "Enabled";
    } else {
      previous = type === "Keyword" ? "Search term" : "Enabled";
      next = status === "success" ? (type === "Keyword" ? "Harvested" : "Paused") : previous;
    }
    list.push({
      id: idNum,
      name,
      type,
      campaign,
      previous,
      next,
      changePct,
      status,
      reason: pick(r, REASONS[status]),
    });
  }
  return list;
}

export const formatDuration = (ms: number) => (ms < 60000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`);
