import { cn } from "@/lib/utils";

interface CampaignTypeMarkProps {
  type: "auto" | "manual" | string;
  /** "chip": a 16px tinted tag beside a name; "text": plain coloured text inside a meta line. */
  variant?: "chip" | "text";
  className?: string;
}

/** Auto / Manual targeting, as small as it can be and still read: never a full pill. */
export function CampaignTypeMark({ type, variant = "chip", className }: CampaignTypeMarkProps) {
  const auto = type === "auto";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap text-2xs font-medium leading-none",
        variant === "chip" && "h-4 rounded px-1",
        variant === "chip" && (auto ? "bg-primary/10 text-primary" : "bg-track text-body"),
        variant === "text" && (auto ? "text-primary" : "text-muted-foreground"),
        className,
      )}
    >
      {auto ? "Auto" : "Manual"}
    </span>
  );
}
