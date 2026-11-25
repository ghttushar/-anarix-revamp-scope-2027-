import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Campaign, BiddingStrategy } from "@/types/campaign";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, CalendarIcon, AlertCircle } from "lucide-react";
import { CampaignTablePagination } from "./CampaignTablePagination";
import { CampaignTableTotalRow } from "./CampaignTableTotalRow";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CampaignTagBar } from "@/components/advertising/CampaignTagBar";
import { CampaignTypeMark } from "@/components/advertising/CampaignTypeMark";
import { format, parse } from "date-fns";

interface CampaignTableProps {
  campaigns: Campaign[];
  onActiveToggle?: (id: string, isActive: boolean) => void;
  onCampaignUpdate?: (id: string, updates: Partial<Campaign>) => void;
  showTotalBudget?: boolean;
  searchQuery?: string;
  viewMode?: "view" | "edit";
  onRowClick?: (id: string) => void;
  hiddenColumns?: Set<string>;
  showDeltas?: boolean;
  /** Edit-mode selection. */
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
}

type SortField = keyof Campaign | null;
type SortDirection = "asc" | "desc";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

const BIDDING_OPTIONS: BiddingStrategy[] = ["Dynamic Down", "Dynamic Up/Down", "Fixed"];

function parseDateString(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  try {
    return parse(dateStr, "yyyy-MM-dd", new Date());
  } catch {
    return undefined;
  }
}

function DatePickerCell({
  value,
  onChange,
  placeholder = "Pick a date",
}: {
  value?: string;
  onChange: (date: string | undefined) => void;
  placeholder?: string;
}) {
  const selected = value ? parseDateString(value) : undefined;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-8 w-[130px] justify-start text-left text-xs font-normal cursor-pointer",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-1.5 h-3 w-3" />
          {selected ? format(selected, "MMM dd, yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : undefined);
          }}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

export function CampaignTable({
  campaigns,
  onActiveToggle,
  onCampaignUpdate,
  showTotalBudget = true,
  searchQuery = "",
  viewMode = "view",
  onRowClick,
  hiddenColumns,
  showDeltas = false,
  selectedIds,
  onSelectionChange,
}: CampaignTableProps) {
  const { formatCurrency } = useCurrency();
  const show = (col: string) => !hiddenColumns?.has(col);
  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isEdit = viewMode === "edit";

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
  };

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField]; const bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    if (typeof aVal === "number" && typeof bVal === "number") return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    return 0;
  });

  const totalPages = Math.ceil(sortedCampaigns.length / pageSize);
  const paginatedCampaigns = sortedCampaigns.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover/sort:opacity-40" />;
    return sortDirection === "asc" ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />;
  };

  return (
    <div data-table-frame className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
              <TableRow className="bg-card">
              {isEdit && onSelectionChange && (
                <TableHead className="sticky z-10 w-10 bg-card">
                  <Checkbox
                    checked={paginatedCampaigns.length > 0 && paginatedCampaigns.every((c) => selectedIds?.has(c.id))}
                    onCheckedChange={(checked) => {
                      const next = new Set(selectedIds);
                      paginatedCampaigns.forEach((c) => checked ? next.add(c.id) : next.delete(c.id));
                      onSelectionChange(next);
                    }}
                  />
                </TableHead>
              )}
              {isEdit && show("active") && <TableHead className="sticky z-10 w-16 bg-card">Active</TableHead>}
              {show("name") && <TableHead className="min-w-[220px] sticky z-10 bg-card">
                Campaign Name
              </TableHead>}
              {show("startDate") && <TableHead>Start Date</TableHead>}
              {show("endDate") && <TableHead>End Date</TableHead>}
              {show("biddingStrategy") && <TableHead>Bidding Strategy</TableHead>}
              {show("dailyBudget") && <TableHead className="text-right">Budget</TableHead>}
              {showTotalBudget && show("totalBudget") && <TableHead className="text-right">Total Budget</TableHead>}
              {show("spend") && <TableHead className="text-right">Spend</TableHead>}
              {show("sales") && <TableHead className="text-right">Sales</TableHead>}
              {show("roas") && <TableHead className="text-right">ROAS</TableHead>}
              {show("impressions") && <TableHead className="text-right">Impressions</TableHead>}
              {show("clicks") && <TableHead className="text-right">Clicks</TableHead>}
              {show("ctr") && <TableHead className="text-right">CTR</TableHead>}
              {show("acos") && <TableHead className="text-right">ACOS</TableHead>}
            </TableRow>
            <CampaignTableTotalRow campaigns={campaigns} showTotalBudget={showTotalBudget} viewMode={viewMode} selectable={isEdit && !!onSelectionChange} />
          </TableHeader>
          <TableBody>
            {paginatedCampaigns.map((campaign) => (
              <Tooltip key={campaign.id}>
                <TooltipTrigger asChild>
                  <TableRow
                    className={cn(
                      "group transition-colors",
                      onRowClick && "cursor-pointer hover:bg-hover"
                    )}
                    onClick={() => onRowClick?.(campaign.id)}
                  >
                    {isEdit && onSelectionChange && (
                      <TableCell className="sticky z-10 bg-card transition-colors group-hover:bg-hover" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds?.has(campaign.id) || false}
                          onCheckedChange={(checked) => {
                            const next = new Set(selectedIds);
                            if (checked) next.add(campaign.id); else next.delete(campaign.id);
                            onSelectionChange(next);
                          }}
                        />
                      </TableCell>
                    )}
                    {isEdit && show("active") && (
                      <TableCell className="sticky z-10 bg-card transition-colors group-hover:bg-hover" onClick={(e) => e.stopPropagation()}>
                        <Switch checked={campaign.isActive} onCheckedChange={(checked) => onActiveToggle?.(campaign.id, checked)} disabled={campaign.status === "archived" || campaign.status === "completed"} />
                      </TableCell>
                    )}
                    {show("name") && <TableCell className="font-medium sticky z-10 bg-card group-hover:bg-hover transition-colors">
                      <div className="min-w-[200px] space-y-1">
                        {isEdit ? (
                          <Input defaultValue={campaign.name} className="h-7 text-xs" onBlur={(e) => onCampaignUpdate?.(campaign.id, { name: e.target.value })} onClick={(e) => e.stopPropagation()} />
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="max-w-[220px] truncate text-primary hover:underline cursor-pointer" title={campaign.name}>{campaign.name}</span>
                            {(campaign.acos > 30 || campaign.status === "out_of_budget") && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); }}
                                title="Open campaign insights"
                                className="inline-flex items-center justify-center h-4 w-4 rounded-full text-warning hover:bg-warning/10 cursor-pointer"
                              >
                                <AlertCircle className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                        {/* Meta line: status · targeting type · tag, all 11px, no pills. */}
                        <div className="flex items-center gap-1.5 font-normal">
                          <StatusBadge status={campaign.status} variant="mark" />
                          <span aria-hidden className="text-2xs leading-none text-faint">·</span>
                          <CampaignTypeMark type={campaign.type} variant="text" />
                          <CampaignTagBar campaignId={campaign.id} isEdit={isEdit} separator />
                        </div>
                      </div>
                    </TableCell>}
                    {show("startDate") && <TableCell>
                      {isEdit ? (
                        <span onClick={(e) => e.stopPropagation()}>
                          <DatePickerCell
                            value={campaign.startDate}
                            onChange={(date) => onCampaignUpdate?.(campaign.id, { startDate: date || "" })}
                          />
                        </span>
                      ) : <span className="text-foreground whitespace-nowrap">{campaign.startDate}</span>}
                    </TableCell>}
                    {show("endDate") && <TableCell>
                      {isEdit ? (
                        <span onClick={(e) => e.stopPropagation()}>
                          <DatePickerCell
                            value={campaign.endDate}
                            onChange={(date) => onCampaignUpdate?.(campaign.id, { endDate: date || undefined })}
                            placeholder="No end date"
                          />
                        </span>
                      ) : <span className="text-foreground whitespace-nowrap">{campaign.endDate || "—"}</span>}
                    </TableCell>}
                    {show("biddingStrategy") && <TableCell>
                      {isEdit ? (
                        <span onClick={(e) => e.stopPropagation()}>
                          <Select value={campaign.biddingStrategy} onValueChange={(v) => onCampaignUpdate?.(campaign.id, { biddingStrategy: v as BiddingStrategy })}>
                            <SelectTrigger className="h-8 w-[140px] text-xs cursor-pointer"><SelectValue /></SelectTrigger>
                            <SelectContent>{BIDDING_OPTIONS.map((b) => <SelectItem key={b} value={b} className="text-xs cursor-pointer">{b}</SelectItem>)}</SelectContent>
                          </Select>
                        </span>
                      ) : <span className="text-foreground whitespace-nowrap">{campaign.biddingStrategy}</span>}
                    </TableCell>}
                    {show("dailyBudget") && <TableCell className="text-right">
                      {isEdit ? (
                        <Input key={campaign.dailyBudget} type="number" defaultValue={campaign.dailyBudget} className="h-8 text-xs w-[100px] text-right" onBlur={(e) => onCampaignUpdate?.(campaign.id, { dailyBudget: parseFloat(e.target.value) || 0 })} onClick={(e) => e.stopPropagation()} />
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-foreground">{formatCurrency(campaign.dailyBudget)}</span>
                          {showDeltas && <DeltaBadge value={getDelta(campaign.id, 'dailyBudget')} />}
                        </div>
                      )}
                    </TableCell>}
                    {showTotalBudget && show("totalBudget") && (
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-foreground">{campaign.totalBudget ? formatCurrency(campaign.totalBudget) : "—"}</span>
                          {showDeltas && campaign.totalBudget ? <DeltaBadge value={getDelta(campaign.id, "totalBudget")} /> : null}
                        </div>
                      </TableCell>
                    )}
                    {show("spend") && <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-foreground">{formatCurrency(campaign.spend)}</span>
                        {showDeltas && <DeltaBadge value={getDelta(campaign.id, 'spend')} />}
                      </div>
                    </TableCell>}
                    {show("sales") && <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-foreground">{formatCurrency(campaign.sales)}</span>
                        {showDeltas && <DeltaBadge value={getDelta(campaign.id, 'sales')} />}
                      </div>
                    </TableCell>}
                    {show("roas") && <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-foreground">{campaign.roas.toFixed(2)}</span>
                        {showDeltas && <DeltaBadge value={getDelta(campaign.id, 'roas')} />}
                      </div>
                    </TableCell>}
                    {show("impressions") && <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-foreground">{formatNumber(campaign.impressions)}</span>
                        {showDeltas && <DeltaBadge value={getDelta(campaign.id, 'impressions')} />}
                      </div>
                    </TableCell>}
                    {show("clicks") && <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-foreground">{formatNumber(campaign.clicks)}</span>
                        {showDeltas && <DeltaBadge value={getDelta(campaign.id, 'clicks')} />}
                      </div>
                    </TableCell>}
                    {show("ctr") && <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-foreground">{formatPercent(campaign.ctr)}</span>
                        {showDeltas && <DeltaBadge value={getDelta(campaign.id, 'ctr')} />}
                      </div>
                    </TableCell>}
                    {show("acos") && <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-foreground">{formatPercent(campaign.acos)}</span>
                        {showDeltas && <DeltaBadge value={getDelta(campaign.id, 'acos')} />}
                      </div>
                    </TableCell>}
                  </TableRow>
                </TooltipTrigger>
                {onRowClick && <TooltipContent side="top">Click to view campaign details</TooltipContent>}
              </Tooltip>
            ))}
          </TableBody>
        </Table>
      </div>
      <CampaignTablePagination
        page={page}
        pageSize={pageSize}
        totalItems={campaigns.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
      />
    </div>
  );
}
