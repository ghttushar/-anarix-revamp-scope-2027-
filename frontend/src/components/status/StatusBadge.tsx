import { CampaignStatus } from "@/types/campaign";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatusBadgeProps {
  status: CampaignStatus;
  /** "pill" (default, compact tinted pill) or "mark": a dot and coloured label with no background, for meta lines. */
  variant?: "pill" | "mark";
  className?: string;
}

const markTone: Record<CampaignStatus, string> = {
  live: "text-success",
  paused: "text-muted-foreground",
  archived: "text-faint",
  scheduled: "text-primary",
  out_of_budget: "text-warning",
  completed: "text-muted-foreground",
};

const statusConfig: Record<CampaignStatus, { 
  label: string; 
  className: string; 
  tooltip: string;
}> = {
  live: {
    label: "Live",
    className: "status-live",
    tooltip: "Campaign is actively running",
  },
  paused: {
    label: "Paused",
    className: "status-paused",
    tooltip: "Campaign paused by user",
  },
  archived: {
    label: "Archived",
    className: "status-archived",
    tooltip: "Permanently stopped",
  },
  scheduled: {
    label: "Scheduled",
    className: "status-scheduled",
    tooltip: "Campaign scheduled to start",
  },
  out_of_budget: {
    label: "Out of Budget",
    className: "status-out-of-budget",
    tooltip: "Daily budget exhausted",
  },
  completed: {
    label: "Completed",
    className: "status-completed",
    tooltip: "Campaign ended",
  },
};

export function StatusBadge({ status, variant = "pill", className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            variant === "pill"
              ? cn("k-status inline-flex h-[18px] items-center whitespace-nowrap rounded-full px-1.5 text-2xs font-medium leading-none", config.className)
              : cn("inline-flex items-center gap-1 whitespace-nowrap text-2xs font-medium leading-none", markTone[status]),
            className
          )}
        >
          {variant === "mark" && <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />}
          {config.label}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
