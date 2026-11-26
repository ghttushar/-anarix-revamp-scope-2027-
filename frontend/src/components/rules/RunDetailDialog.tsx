import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowRight, ChevronRight, Download, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortableTableHead } from "@/components/tables/SortableTableHead";
import { TablePagination } from "@/components/tables/TablePagination";
import { BarChip, BarSegmented } from "@/components/bars";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { HistoryEmpty, StatusPill, TriggerMark, downloadCsv } from "./RunMarks";
import { entitiesFor, formatDuration, type EntityStatus, type RuleRun, type RuleTypeInfo, type RunEntity } from "@/data/mockRuleHistory";

type StatusFilter = "all" | EntityStatus;
type SortField = "name" | "status";
const STATUS_ORDER: Record<EntityStatus, number> = { failed: 0, skipped: 1, success: 2 };

interface Props {
  run: RuleRun | null;
  ruleType: RuleTypeInfo;
  onOpenChange: (open: boolean) => void;
}

/** "Previous → New": a numeric move with its change %, or an action label. */
function ChangeCell({ e }: { e: RunEntity }) {
  const moved = e.changePct !== null && e.changePct !== 0;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className={cn("font-medium", e.status === "success" ? "text-foreground" : "text-muted-foreground")}>{e.next}</span>
      {moved && (
        <span className={cn("text-2xs font-medium tabular-nums", e.changePct! > 0 ? "text-success" : "text-destructive")}>
          {e.changePct! > 0 ? "+" : ""}
          {e.changePct}%
        </span>
      )}
    </span>
  );
}

/**
 * Screen 3 of Rules › History: every entity one run touched. Search, status segments (with counts), entity type,
 * sort by name / status, pagination, an optional "Group by campaign" view, and CSV export.
 */
export function RunDetailDialog({ run, ruleType, onOpenChange }: Props) {
  const entities = useMemo(() => (run ? entitiesFor(run) : []), [run]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [type, setType] = useState("all");
  const [grouped, setGrouped] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // A new run starts clean.
  useEffect(() => {
    setQuery("");
    setStatus("all");
    setType("all");
    setCollapsed(new Set());
    setSortField(null);
    setPage(1);
  }, [run?.id]);

  const counts = useMemo(() => {
    const c = { all: entities.length, success: 0, skipped: 0, failed: 0 };
    entities.forEach((e) => c[e.status]++);
    return c;
  }, [entities]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = entities.filter(
      (e) =>
        (status === "all" || e.status === status) &&
        (type === "all" || e.type === type) &&
        (!q || e.name.toLowerCase().includes(q) || e.id.includes(q))
    );
    if (sortField) {
      const dir = sortDirection === "asc" ? 1 : -1;
      list = [...list].sort((a, b) =>
        sortField === "name" ? a.name.localeCompare(b.name) * dir : (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * dir
      );
    }
    return list;
  }, [entities, query, status, type, sortField, sortDirection]);

  const onSort = (field: string) => {
    const f = field as SortField;
    if (sortField !== f) {
      setSortField(f);
      setSortDirection("asc");
    } else if (sortDirection === "asc") setSortDirection("desc");
    else setSortField(null);
    setPage(1);
  };
  const sp = { sortField, sortDirection, onSort };

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  // Grouped view: the page's rows folded under their campaign.
  const groups = useMemo(() => {
    const m = new Map<string, RunEntity[]>();
    pageRows.forEach((e) => m.set(e.campaign, [...(m.get(e.campaign) ?? []), e]));
    return Array.from(m.entries());
  }, [pageRows]);
  const allCollapsed = groups.length > 0 && groups.every(([c]) => collapsed.has(c));

  const hasFilters = !!query || status !== "all" || type !== "all";
  const clearFilters = () => {
    setQuery("");
    setStatus("all");
    setType("all");
    setPage(1);
  };

  const exportCsv = () => {
    if (!run) return;
    downloadCsv(
      `${ruleType.label.toLowerCase().replace(/\s+/g, "-")}-run-${format(run.executedAt, "yyyyMMdd-HHmm")}.csv`,
      ["Entity", "Entity ID", "Type", "Campaign", "Previous", "New / action", "Change %", "Status", "Reason"],
      filtered.map((e) => [e.name, e.id, e.type, e.campaign, e.previous, e.next, e.changePct ?? "", e.status, e.reason])
    );
  };

  const row = (e: RunEntity, indent = false) => (
    <TableRow key={e.id + e.name}>
      <TableCell className={cn(indent && "pl-9")}>
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{e.name}</p>
          <p className="font-mono text-2xs text-muted-foreground">{e.id}</p>
        </div>
      </TableCell>
      <TableCell className="text-body">{e.type}</TableCell>
      <TableCell className="tabular-nums text-muted-foreground">{e.previous}</TableCell>
      <TableCell className="tabular-nums">
        <span className="inline-flex items-center gap-1.5">
          <ArrowRight className="h-3 w-3 text-faint" />
          <ChangeCell e={e} />
        </span>
      </TableCell>
      <TableCell><StatusPill status={e.status} /></TableCell>
      <TableCell className="max-w-[260px] whitespace-normal text-xs text-muted-foreground">{e.reason}</TableCell>
    </TableRow>
  );

  return (
    <Dialog open={!!run} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-w-6xl flex-col gap-0 overflow-hidden p-0 [&>button.absolute]:hidden">
        {run && (
          <>
            {/* Header: which rule, when, how; and what the run did, in four small figures. */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 pb-4 pt-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <DialogTitle className="truncate text-base font-semibold">{ruleType.ruleName}</DialogTitle>
                  <StatusPill status={run.status} />
                </div>
                <DialogDescription className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span className="font-medium uppercase tracking-wide text-faint">{ruleType.label} rule</span>
                  <span className="text-faint">·</span>
                  <span>{format(run.executedAt, "dd MMM yyyy, HH:mm")}</span>
                  <span className="text-faint">·</span>
                  <TriggerMark trigger={run.trigger} />
                  <span className="text-faint">·</span>
                  <span>Lookback {ruleType.lookback}</span>
                  <span className="text-faint">·</span>
                  <span>{formatDuration(run.durationMs)}</span>
                </DialogDescription>
              </div>
              <div className="flex shrink-0 items-start gap-5">
                {[
                  { label: "Processed", value: counts.all, cls: "text-foreground" },
                  { label: "Success", value: counts.success, cls: "text-success" },
                  { label: "Skipped", value: counts.skipped, cls: "text-muted-foreground" },
                  { label: "Failed", value: counts.failed, cls: counts.failed ? "text-destructive" : "text-muted-foreground" },
                ].map((s) => (
                  <div key={s.label} className="text-right">
                    <p className="text-2xs uppercase tracking-wide text-faint">{s.label}</p>
                    <p className={cn("text-lg font-semibold tabular-nums leading-tight", s.cls)}>{s.value.toLocaleString()}</p>
                  </div>
                ))}
                <Button variant="ghost" size="icon-sm" onClick={() => onOpenChange(false)} aria-label="Close" className="-mr-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Toolbar: search, status segments, entity type, grouping, export. */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border px-6 py-2.5">
              <div className="relative h-[var(--k-control-h)] w-60">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search entity name or ID…"
                  aria-label="Search entities"
                  className="h-full w-full rounded-md border border-control-border bg-control pl-8 pr-2 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <BarSegmented<StatusFilter>
                value={status}
                onChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
                aria-label="Status"
                items={[
                  { value: "all", label: "All", count: counts.all },
                  { value: "success", label: "Success", count: counts.success },
                  { value: "skipped", label: "Skipped", count: counts.skipped },
                  { value: "failed", label: "Failed", count: counts.failed },
                ]}
              />
              <BarChip
                label="Type"
                value={type}
                onChange={(v: string) => {
                  setType(v);
                  setPage(1);
                }}
                options={[{ value: "all", label: "All entity types", short: "All" }, ...ruleType.entityTypes.map((t) => ({ value: t, label: t }))]}
              />
              <div className="ml-auto flex items-center gap-3">
                {grouped && groups.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCollapsed(allCollapsed ? new Set() : new Set(groups.map(([c]) => c)))}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {allCollapsed ? "Expand all" : "Collapse all"}
                  </button>
                )}
                <label className="flex cursor-pointer items-center gap-2 text-xs text-body">
                  <Switch checked={grouped} onCheckedChange={setGrouped} aria-label="Group by campaign" />
                  Group by campaign
                </label>
                <Button variant="outline" size="xs" className="gap-1.5" onClick={exportCsv} disabled={filtered.length === 0}>
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
            </div>

            {/* Entities */}
            <div className="min-h-0 flex-1 overflow-auto">
              {entities.length === 0 ? (
                <HistoryEmpty title="No entities in this run" hint="This run found nothing that matched the rule's conditions, so nothing was changed." />
              ) : filtered.length === 0 ? (
                <HistoryEmpty
                  title="No entities match your filters"
                  hint="Try another status or entity type, or clear the search."
                  action={hasFilters ? <Button size="xs" variant="outline" onClick={clearFilters}>Clear filters</Button> : undefined}
                />
              ) : (
                <Table>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow>
                      <SortableTableHead field="name" {...sp} className="min-w-[240px]">Entity</SortableTableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Previous</TableHead>
                      <TableHead>New / action</TableHead>
                      <SortableTableHead field="status" {...sp}>Status</SortableTableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grouped
                      ? groups.map(([campaign, rows]) => {
                          const open = !collapsed.has(campaign);
                          const applied = rows.filter((r) => r.status === "success").length;
                          const skipped = rows.filter((r) => r.status === "skipped").length;
                          return [
                            <TableRow
                              key={`g-${campaign}`}
                              className="cursor-pointer bg-muted/40 hover:bg-muted/60"
                              onClick={() =>
                                setCollapsed((s) => {
                                  const n = new Set(s);
                                  if (n.has(campaign)) n.delete(campaign);
                                  else n.add(campaign);
                                  return n;
                                })
                              }
                            >
                              <TableCell colSpan={6}>
                                <div className="flex items-center gap-2">
                                  <ChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", open && "rotate-90")} />
                                  <span className="font-medium text-foreground">{campaign}</span>
                                  <span className="ml-auto text-2xs text-muted-foreground">
                                    {rows.length} entit{rows.length === 1 ? "y" : "ies"} · <span className="text-success">{applied} applied</span> · {skipped} skipped
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>,
                            ...(open ? rows.map((e) => row(e, true)) : []),
                          ];
                        })
                      : pageRows.map((e) => row(e))}
                  </TableBody>
                </Table>
              )}
            </div>

            {filtered.length > 0 && (
              <div className="border-t border-border">
                <TablePagination
                  page={page}
                  pageSize={pageSize}
                  totalItems={filtered.length}
                  onPageChange={setPage}
                  onPageSizeChange={(s) => {
                    setPageSize(s);
                    setPage(1);
                  }}
                />
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
