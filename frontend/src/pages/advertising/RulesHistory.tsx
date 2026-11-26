import { useMemo, useState } from "react";
import { format, startOfDay, endOfDay, subDays } from "date-fns";
import { ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortableTableHead } from "@/components/tables/SortableTableHead";
import { TablePagination } from "@/components/tables/TablePagination";
import { Button } from "@/components/ui/button";
import { RunDetailDialog } from "@/components/rules/RunDetailDialog";
import { HistoryEmpty, StatusPill, TriggerMark, downloadCsv } from "@/components/rules/RunMarks";
import { formatDuration, ruleTypes, runsFor, type RuleRun } from "@/data/mockRuleHistory";
import { cn } from "@/lib/utils";

type SortField = "executedAt" | "status" | "processed" | "actioned";
const STATUS_ORDER = { failed: 0, partial: 1, success: 2 } as const;

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses", short: "All" },
  { value: "success", label: "Success" },
  { value: "partial", label: "Partial" },
  { value: "failed", label: "Failed" },
];
const TRIGGER_OPTIONS = [
  { value: "all", label: "All triggers", short: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "manual", label: "Manual" },
];

/**
 * Rules › History. Three screens, drilling down: pick a rule type (tabs), see every time it ran (the runs table, with
 * date / status / trigger filters in the page bar), then open a run to see every entity it touched (RunDetailDialog).
 */
export default function RulesHistory() {
  const [typeId, setTypeId] = useState(ruleTypes[0].id);
  const [range, setRange] = useState(() => ({ from: subDays(new Date(), 90), to: new Date() }));
  const [status, setStatus] = useState("all");
  const [trigger, setTrigger] = useState("all");
  const [sortField, setSortField] = useState<SortField | null>("executedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [openRun, setOpenRun] = useState<RuleRun | null>(null);

  const ruleType = ruleTypes.find((t) => t.id === typeId)!;
  const allRuns = runsFor(typeId);

  const runs = useMemo(() => {
    const from = startOfDay(range.from).getTime();
    const to = endOfDay(range.to).getTime();
    const list = allRuns.filter(
      (r) =>
        r.executedAt.getTime() >= from &&
        r.executedAt.getTime() <= to &&
        (status === "all" || r.status === status) &&
        (trigger === "all" || r.trigger === trigger)
    );
    if (!sortField) return list;
    const dir = sortDirection === "asc" ? 1 : -1;
    const val = (r: RuleRun) =>
      sortField === "executedAt" ? r.executedAt.getTime() : sortField === "status" ? STATUS_ORDER[r.status] : r[sortField];
    return [...list].sort((a, b) => (val(a) - val(b)) * dir);
  }, [allRuns, range, status, trigger, sortField, sortDirection]);

  const filtered = status !== "all" || trigger !== "all";
  const pageRuns = runs.slice((page - 1) * pageSize, page * pageSize);

  // Header sort: newest-first is the default; a field cycles desc → asc → off (back to newest first).
  const onSort = (field: string) => {
    const f = field as SortField;
    if (sortField !== f) {
      setSortField(f);
      setSortDirection("desc");
    } else if (sortDirection === "desc") {
      setSortDirection("asc");
    } else {
      setSortField("executedAt");
      setSortDirection("desc");
    }
    setPage(1);
  };
  const sp = { sortField, sortDirection, onSort };

  const switchType = (id: string) => {
    setTypeId(id);
    setPage(1);
    setSortField("executedAt");
    setSortDirection("desc");
  };

  const clearFilters = () => {
    setStatus("all");
    setTrigger("all");
    setPage(1);
  };

  const exportRuns = () =>
    downloadCsv(
      `${ruleType.label.toLowerCase().replace(/\s+/g, "-")}-runs.csv`,
      ["Run date & time", "Status", "Trigger", "Entities processed", "Entities actioned", "Failed", "Duration"],
      runs.map((r) => [format(r.executedAt, "yyyy-MM-dd HH:mm"), r.status, r.trigger, r.processed, r.actioned, r.failed, formatDuration(r.durationMs)])
    );

  return (
    <AppLayout>
      <div className="space-y-4">
        <PageHeader title="Rules History" subtitle="Every time a rule ran — and exactly what it changed" />

        <AppTaskbar
          showDateRange
          dateRangeOverride={range}
          onDateRangeOverrideChange={(r) => {
            setRange(r);
            setPage(1);
          }}
          filters={[
            { key: "status", label: "Status", value: status, options: STATUS_OPTIONS, onChange: (v: string) => { setStatus(v); setPage(1); } },
            { key: "trigger", label: "Trigger", value: trigger, options: TRIGGER_OPTIONS, onChange: (v: string) => { setTrigger(v); setPage(1); } },
          ]}
        />

        {/* Screen 1: one tab per rule type configured for this account. */}
        <UnderlineTabs
          tabs={ruleTypes.map((t) => ({ value: t.id, label: t.label, count: runsFor(t.id).length }))}
          value={typeId}
          onChange={switchType}
        />

        {/* Screen 2: every run of the selected rule. Toolbar and table share one card. */}
        <DataTableToolbar
          searchValue=""
          onSearchChange={() => {}}
          hideSearch
          onDownload={exportRuns}
        />
        <div data-table-frame className="rounded-lg border border-border bg-card">
          {runs.length === 0 ? (
            allRuns.length === 0 ? (
              <HistoryEmpty
                title="No runs yet"
                hint={`${ruleType.ruleName} hasn't run for this account yet. Its runs will show up here after the first one.`}
              />
            ) : (
              <HistoryEmpty
                title="No runs match these filters"
                hint="Try another date range, or clear the status and trigger filters."
                action={filtered ? <Button size="xs" variant="outline" onClick={clearFilters}>Clear filters</Button> : undefined}
              />
            )
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHead field="executedAt" {...sp} className="min-w-[180px]">Run date &amp; time</SortableTableHead>
                    <SortableTableHead field="status" {...sp}>Status</SortableTableHead>
                    <TableHead>Trigger</TableHead>
                    <SortableTableHead field="processed" {...sp} align="right" className="text-right">Entities processed</SortableTableHead>
                    <SortableTableHead field="actioned" {...sp} align="right" className="text-right">Entities actioned</SortableTableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="w-[120px] text-right">
                      <span className="sr-only">Details</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRuns.map((r) => (
                    <TableRow key={r.id} className="group cursor-pointer" onClick={() => setOpenRun(r)}>
                      <TableCell>
                        <span className="font-medium text-foreground">{format(r.executedAt, "dd MMM yyyy")}</span>
                        <span className="ml-1.5 text-muted-foreground">{format(r.executedAt, "HH:mm")}</span>
                      </TableCell>
                      <TableCell><StatusPill status={r.status} /></TableCell>
                      <TableCell><TriggerMark trigger={r.trigger} /></TableCell>
                      <TableCell className="text-right tabular-nums">{r.processed.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        <span className={cn("font-medium", r.actioned > 0 ? "text-success" : "text-muted-foreground")}>{r.actioned.toLocaleString()}</span>
                        <span className="ml-1 text-2xs text-faint">of {r.processed.toLocaleString()}</span>
                        {r.failed > 0 && <span className="ml-1.5 text-2xs text-destructive">· {r.failed} failed</span>}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{formatDuration(r.durationMs)}</TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="xs" className="gap-1" onClick={() => setOpenRun(r)} aria-label="View run details">
                          View details
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                page={page}
                pageSize={pageSize}
                totalItems={runs.length}
                onPageChange={setPage}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setPage(1);
                }}
              />
            </>
          )}
        </div>
      </div>

      <RunDetailDialog run={openRun} ruleType={ruleType} onOpenChange={(o) => !o && setOpenRun(null)} />
    </AppLayout>
  );
}
