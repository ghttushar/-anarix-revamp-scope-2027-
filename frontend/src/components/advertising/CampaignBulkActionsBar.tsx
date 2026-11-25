import { useState, type ReactNode } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { BarDivider, BarIconButton } from "@/components/bars";
import { AnxBudget, AnxBudgetTotal, AnxCalendar, AnxPause, AnxPlay, AnxTag, AnxUpload } from "@/components/icons";
import { TagPopover } from "./TagPopover";
import { BulkUploadDialog } from "./BulkUploadDialog";
import { useTags } from "@/contexts/TagsContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Campaign } from "@/types/campaign";

export type CampaignBulkUpdate = Partial<Campaign> | ((campaign: Campaign) => Partial<Campaign>);

interface CampaignBulkActionsProps {
  selectedIds: string[];
  onBulkUpdate?: (update: CampaignBulkUpdate) => void;
}

/* The old design's budget adjustments (advertising.enums Adjustments). */
const ADJUSTMENTS = [
  { id: "set", label: "Set to value" },
  { id: "inc-value", label: "Increase by value" },
  { id: "dec-value", label: "Decrease by value" },
  { id: "inc-pct", label: "Increase by %" },
  { id: "dec-pct", label: "Decrease by %" },
] as const;
type Adjustment = (typeof ADJUSTMENTS)[number]["id"];

const adjust = (current: number, how: Adjustment, n: number) => {
  const next =
    how === "set" ? n
    : how === "inc-value" ? current + n
    : how === "dec-value" ? current - n
    : how === "inc-pct" ? current * (1 + n / 100)
    : current * (1 - n / 100);
  return Math.max(0, Math.round(next * 100) / 100);
};

/**
 * Campaign Manager's bulk edits, extracted from the old design's Bulk Actions bar (Active, Pause, Tag, End Date,
 * Daily Budget, Total Budget, Bulk Edit Upload). In edit mode they replace the table toolbar's view actions.
 * Each acts on the selected rows (dimmed until a row is ticked) except Bulk upload, which works on files.
 */
export function CampaignBulkActions({ selectedIds, onBulkUpdate }: CampaignBulkActionsProps) {
  const { bulkToggleTag, getEffectiveTags } = useTags();
  const { currencyConfig } = useCurrency();
  const count = selectedIds.length;
  const none = count === 0;
  const noun = `${count} campaign${count === 1 ? "" : "s"}`;

  const [open, setOpen] = useState<null | "active" | "pause" | "end" | "daily" | "total">(null);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [how, setHow] = useState<Adjustment>("set");
  const [amount, setAmount] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);

  const popover = (key: NonNullable<typeof open>) => ({
    open: open === key,
    onOpenChange: (o: boolean) => {
      if (o && none) return;
      setOpen(o ? key : null);
      if (o && (key === "daily" || key === "total")) { setHow("set"); setAmount(""); }
    },
  });

  const sharedTags = (() => {
    if (none) return [];
    const sets = selectedIds.map((id) => new Set(getEffectiveTags(id)));
    return Array.from(sets[0]).filter((t) => sets.every((s) => s.has(t)));
  })();

  const applyActive = (isActive: boolean) => {
    onBulkUpdate?.({ isActive, status: isActive ? "live" : "paused" });
    toast.success(`${isActive ? "Activated" : "Paused"} ${noun}`);
    setOpen(null);
  };

  const applyEndDate = () => {
    if (!endDate) return;
    onBulkUpdate?.({ endDate: format(endDate, "yyyy-MM-dd") });
    toast.success(`End date set on ${noun}`);
    setOpen(null);
  };

  const applyBudget = (field: "dailyBudget" | "totalBudget") => {
    const n = parseFloat(amount);
    if (!Number.isFinite(n) || n < 0 || (how === "set" && n === 0)) {
      toast.error("Enter a valid amount");
      return;
    }
    onBulkUpdate?.((c) => ({ [field]: adjust(c[field] ?? 0, how, n) }));
    toast.success(`${field === "dailyBudget" ? "Daily" : "Total"} budget updated on ${noun}`);
    setOpen(null);
  };

  const hint = none ? "Select campaigns first" : `Applies to ${noun}`;
  const dim = none ? "opacity-45 hover:bg-transparent hover:text-muted-foreground cursor-not-allowed" : undefined;

  const panel = (title: string, body: ReactNode, onApply: () => void, applyDisabled = false) => (
    <PopoverContent className="w-64 space-y-3 p-3" align="end">
      <div>
        <p className="text-xs font-medium text-foreground">{title}</p>
        <p className="text-2xs text-muted-foreground">Applies to {noun}</p>
      </div>
      {body}
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="xs" onClick={() => setOpen(null)}>Cancel</Button>
        <Button size="xs" onClick={onApply} disabled={applyDisabled}>Apply</Button>
      </div>
    </PopoverContent>
  );

  const budgetBody = (
    <div className="space-y-2">
      <Select value={how} onValueChange={(v) => setHow(v as Adjustment)}>
        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          {ADJUSTMENTS.map((a) => <SelectItem key={a.id} value={a.id} className="text-xs">{a.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {how.endsWith("pct") ? "%" : currencyConfig.symbol}
        </span>
        <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="h-8 pl-6 text-xs" autoFocus />
      </div>
      <p className="text-2xs text-muted-foreground">Changing budgets can affect spend.</p>
    </div>
  );

  return (
    <>
      <Popover {...popover("active")}>
        <PopoverTrigger asChild>
          <BarIconButton data-write-action icon={AnxPlay} name="Active" label="Set active" hint={hint} aria-disabled={none} className={dim} />
        </PopoverTrigger>
        {panel(`Activate ${noun}?`, null, () => applyActive(true))}
      </Popover>

      <Popover {...popover("pause")}>
        <PopoverTrigger asChild>
          <BarIconButton data-write-action icon={AnxPause} name="Pause" label="Pause" hint={hint} aria-disabled={none} className={dim} />
        </PopoverTrigger>
        {panel(`Pause ${noun}?`, null, () => applyActive(false))}
      </Popover>

      {none ? (
        <BarIconButton data-write-action icon={AnxTag} name="Tag" label="Tag" hint={hint} aria-disabled className={dim} />
      ) : (
        <TagPopover
          title="Tag the selected campaigns"
          selectedTags={sharedTags}
          onToggle={(tag) => bulkToggleTag(selectedIds, tag)}
          align="end"
          trigger={<BarIconButton data-write-action icon={AnxTag} name="Tag" label="Tag" hint={hint} />}
        />
      )}

      <Popover {...popover("end")}>
        <PopoverTrigger asChild>
          <BarIconButton data-write-action icon={AnxCalendar} name="End date" label="End date" hint={hint} aria-disabled={none} className={dim} />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="border-b border-border px-3 py-2">
            <p className="text-xs font-medium text-foreground">{endDate ? `End on ${format(endDate, "PP")}` : "Pick an end date"}</p>
            <p className="text-2xs text-muted-foreground">Applies to {noun}</p>
          </div>
          <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={{ before: new Date() }} initialFocus className="pointer-events-auto p-3" />
          <div className="flex justify-end gap-1 border-t border-border p-2">
            <Button variant="ghost" size="xs" onClick={() => setOpen(null)}>Cancel</Button>
            <Button size="xs" onClick={applyEndDate} disabled={!endDate}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover {...popover("daily")}>
        <PopoverTrigger asChild>
          <BarIconButton data-write-action icon={AnxBudget} name="Daily budget" label="Daily budget" hint={hint} aria-disabled={none} className={dim} />
        </PopoverTrigger>
        {panel("Adjust daily budget", budgetBody, () => applyBudget("dailyBudget"), amount === "")}
      </Popover>

      <Popover {...popover("total")}>
        <PopoverTrigger asChild>
          <BarIconButton data-write-action icon={AnxBudgetTotal} name="Total budget" label="Total budget" hint={hint} aria-disabled={none} className={dim} />
        </PopoverTrigger>
        {panel("Adjust total budget", budgetBody, () => applyBudget("totalBudget"), amount === "")}
      </Popover>

      <BarDivider className="mx-0.5" />

      <BarIconButton
        data-write-action
        icon={AnxUpload}
        name="Bulk upload"
        label="Bulk edit upload"
        hint="Download, edit offline, upload CSVs"
        onClick={() => setUploadOpen(true)}
      />
      <BulkUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  );
}
