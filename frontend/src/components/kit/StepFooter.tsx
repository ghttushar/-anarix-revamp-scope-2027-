import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StepFooterProps {
  /** Left: go back a step (or out of the flow). Omit to leave the left side empty. */
  onBack?: () => void;
  backLabel?: string;
  /** Right: the primary next step. */
  onNext?: () => void;
  nextLabel: ReactNode;
  nextDisabled?: boolean;
  /** Extra status on the right, before the primary button (e.g. "2 of 4 done"). */
  status?: ReactNode;
  className?: string;
}

/**
 * The flow footer shared with the Campaign Creator: a full-width bar stuck to the bottom of the page, Back on the
 * left (ghost), the primary next step on the right. Translucent with a blur and a soft line on top.
 * Place it as the last child of a page inside AppLayout: it bleeds over the main area's p-6 and sticks at -bottom-6, because sticky
 * offsets count from the scroll container's padding edge.
 */
export function StepFooter({ onBack, backLabel = "Back", onNext, nextLabel, nextDisabled, status, className }: StepFooterProps) {
  return (
    <footer
      className={cn(
        "sticky -bottom-6 z-20 -mx-6 -mb-6 mt-6 grid min-h-[72px] grid-cols-[1fr_auto_1fr] items-center border-t border-border px-8 py-2.5",
        "bg-card/95 shadow-[0_-10px_28px_-28px_rgb(32_32_41)] backdrop-blur-[18px]",
        className,
      )}
    >
      <div>
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </Button>
        )}
      </div>
      <div />
      <div className="flex items-center justify-end gap-5">
        {status}
        {onNext && (
          <Button size="sm" onClick={onNext} disabled={nextDisabled} className="gap-1.5">
            {nextLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </footer>
  );
}
