import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TagPopover } from "./TagPopover";
import { useTags } from "@/contexts/TagsContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Campaign } from "@/types/campaign";
import { format } from "date-fns";
import { CheckCircle2, PauseCircle, Tag as TagIcon, Calendar as CalendarIcon, DollarSign, CircleDollarSign } from "lucide-react";
import { toast } from "sonner";
import { BarIconButton } from "@/components/bars";

interface CampaignBulkActionsProps {
  selectedIds: string[];
  onBulkUpdate?: (updates: Partial<Campaign>) => void;
}

/**
 * Campaign Manager's bulk edits, as icon actions for the table toolbar's selection slot (they show while campaigns
 * are selected in edit mode): Activate, Pause, Tag, End date, Daily budget, Total budget. Each opens a small
 * confirm or input panel. Saving the edits is the toolbar's primary action.
 */
export function CampaignBulkActions({ selectedIds, onBulkUpdate }: CampaignBulkActionsProps) {
  const { bulkToggleTag, getEffectiveTags } = useTags();
  const { currencyConfig } = useCurrency();
  const count = selectedIds.length;

  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [dailyBudget, setDailyBudget] = useState("");
  const [dailyOpen, setDailyOpen] = useState(false);
  const [totalBudget, setTotalBudget] = useState("");
  const [totalOpen, setTotalOpen] = useState(false);
  const [activeOpen, setActiveOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);

  const sharedTags = (() => {
    if (selectedIds.length === 0) return [];
    const sets = selectedIds.map((id) => new Set(getEffectiveTags(id)));
    const first = Array.from(sets[0]);
    return first.filter((t) => sets.every((s) => s.has(t)));
  })();

  const applyActive = (isActive: boolean) => {
    onBulkUpdate?.({ isActive, status: isActive ? "live" : "paused" });
    toast.success(`${isActive ? "Activated" : "Paused"} ${count} campaign(s)`);
    setActiveOpen(false);
    setPauseOpen(false);
  };

  const applyEndDate = () => {
    if (!endDate) return;
    onBulkUpdate?.({ endDate: endDate.toISOString().slice(0, 10) });
    toast.success(`End date set on ${count} campaign(s)`);
    setEndDateOpen(false);
  };

  const applyBudget = (kind: "daily" | "total") => {
    const raw = kind === "daily" ? dailyBudget : totalBudget;
    const n = parseFloat(raw);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error(`Enter a valid ${kind} budget`);
      return;
    }
    onBulkUpdate?.(kind === "daily" ? { dailyBudget: n } : { totalBudget: n });
    toast.success(`${kind === "daily" ? "Daily" : "Total"} budget updated on ${count} campaign(s)`);
    if (kind === "daily") { setDailyOpen(false); setDailyBudget(""); } else { setTotalOpen(false); setTotalBudget(""); }
  };

  const confirm = (text: string, onCancel: () => void, onApply: () => void) => (
    <PopoverContent className="w-56 space-y-2 p-3" align="start">
      <p className="text-xs text-foreground">{text}</p>
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="xs" onClick={onCancel}>Cancel</Button>
        <Button size="xs" onClick={onApply}>Apply</Button>
      </div>
    </PopoverContent>
  );

  const budget = (label: string, value: string, set: (v: string) => void, onCancel: () => void, onApply: () => void) => (
    <PopoverContent className="w-56 space-y-2 p-3" align="start">
      <label className="text-[11px] text-muted-foreground">{label}</label>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{currencyConfig.symbol}</span>
        <Input type="number" min="0" step="0.01" value={value} onChange={(e) => set(e.target.value)} placeholder="0.00" className="h-8 pl-6 text-xs" autoFocus />
      </div>
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="xs" onClick={onCancel}>Cancel</Button>
        <Button size="xs" onClick={onApply}>Apply</Button>
      </div>
    </PopoverContent>
  );

  return (
    <>
      <Popover open={activeOpen} onOpenChange={setActiveOpen}>
        <PopoverTrigger asChild>
          <BarIconButton icon={CheckCircle2} label="Activate" />
        </PopoverTrigger>
        {confirm(`Activate ${count} selected campaign(s)?`, () => setActiveOpen(false), () => applyActive(true))}
      </Popover>

      <Popover open={pauseOpen} onOpenChange={setPauseOpen}>
        <PopoverTrigger asChild>
          <BarIconButton icon={PauseCircle} label="Pause" />
        </PopoverTrigger>
        {confirm(`Pause ${count} selected campaign(s)?`, () => setPauseOpen(false), () => applyActive(false))}
      </Popover>

      <TagPopover
        title="Tag the selected campaigns"
        selectedTags={sharedTags}
        onToggle={(tag) => bulkToggleTag(selectedIds, tag)}
        align="start"
        trigger={<BarIconButton icon={TagIcon} label="Tag" />}
      />

      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
        <PopoverTrigger asChild>
          <BarIconButton icon={CalendarIcon} label="End date" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="border-b border-border p-2">
            <p className="px-1 text-[11px] text-muted-foreground">{endDate ? `End: ${format(endDate, "PPP")}` : "Pick end date"}</p>
          </div>
          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="pointer-events-auto p-3" />
          <div className="flex justify-end gap-1 border-t border-border p-2">
            <Button variant="ghost" size="xs" onClick={() => setEndDateOpen(false)}>Cancel</Button>
            <Button size="xs" onClick={applyEndDate} disabled={!endDate}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={dailyOpen} onOpenChange={setDailyOpen}>
        <PopoverTrigger asChild>
          <BarIconButton icon={DollarSign} label="Daily budget" />
        </PopoverTrigger>
        {budget("New daily budget", dailyBudget, setDailyBudget, () => setDailyOpen(false), () => applyBudget("daily"))}
      </Popover>

      <Popover open={totalOpen} onOpenChange={setTotalOpen}>
        <PopoverTrigger asChild>
          <BarIconButton icon={CircleDollarSign} label="Total budget" />
        </PopoverTrigger>
        {budget("New total budget", totalBudget, setTotalBudget, () => setTotalOpen(false), () => applyBudget("total"))}
      </Popover>
    </>
  );
}
