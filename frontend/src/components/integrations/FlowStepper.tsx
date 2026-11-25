import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** The numbered step row used in the integration side panels (same look as the WhatsApp flow's). */
export function FlowStepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((label, idx) => {
        const isDone = idx < current;
        const isCurrent = idx === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-2 text-xs font-medium",
                isCurrent ? "text-foreground" : isDone ? "text-foreground/80" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-2xs border",
                  isCurrent
                    ? "bg-primary text-primary-foreground border-primary"
                    : isDone
                    ? "bg-primary/10 text-primary border-primary/40"
                    : "bg-muted text-muted-foreground border-border"
                )}
              >
                {isDone ? <Check className="h-3 w-3" /> : idx + 1}
              </span>
              <span>{label}</span>
            </span>
            {idx < steps.length - 1 && <span className="h-px w-6 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
