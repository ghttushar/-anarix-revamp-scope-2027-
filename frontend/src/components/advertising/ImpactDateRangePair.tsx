import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { BarChipTrigger } from "@/components/bars";
import type { DateRange as RDDateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange, formatShort, pairShift } from "@/lib/utils/impactSeries";

interface ImpactDateRangePairProps {
  previous: DateRange;
  impact: DateRange;
  onChange: (next: { previous: DateRange; impact: DateRange }) => void;
}

function RangePill({
  label,
  range,
  onApply,
}: {
  label: string;
  range: DateRange;
  onApply: (r: DateRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<RDDateRange | undefined>({ from: range.from, to: range.to });

  const apply = () => {
    if (draft?.from && draft?.to) {
      onApply({ from: draft.from, to: draft.to });
      setOpen(false);
    }
  };

  return (
    <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o) setDraft({ from: range.from, to: range.to });
        }}
      >
        <PopoverTrigger asChild>
          <BarChipTrigger icon={<CalendarIcon />} label={label} value={`${formatShort(range.from)} – ${formatShort(range.to)}`} />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={draft}
            onSelect={setDraft}
            numberOfMonths={2}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
          <div className="flex items-center justify-end gap-2 border-t border-border p-2">
            <Button variant="outline" size="xs" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="xs"
              disabled={!draft?.from || !draft?.to}
              onClick={apply}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
  );
}

export function ImpactDateRangePair({ previous, impact, onChange }: ImpactDateRangePairProps) {
  return (
    <div className="flex items-center gap-1.5">
      <RangePill
        label="Previous"
        range={previous}
        onApply={(r) => onChange(pairShift("previous", r))}
      />
      <span className="text-[11px] font-medium text-muted-foreground">vs</span>
      <RangePill
        label="Impact"
        range={impact}
        onApply={(r) => onChange(pairShift("impact", r))}
      />
    </div>
  );
}
