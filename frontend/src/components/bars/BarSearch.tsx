import { useRef } from "react";
import { X } from "lucide-react";
import { AnxSearch } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useBarDensity } from "./density";

interface BarSearchProps {
  value: string;
  onChange: (value: string) => void;
  /** Placeholder, e.g. "Search campaigns…". */
  placeholder?: string;
  className?: string;
}

/**
 * Search as a page-bar control: an always-open field the height of the bar's chips, with the same well styling.
 * Esc clears it; a ✕ clears it while there's a query. Used when a page's search belongs to the page (it filters
 * whichever table tab is showing) rather than to one table's toolbar.
 */
export function BarSearch({ value, onChange, placeholder = "Search…", className }: BarSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const compact = useBarDensity() === "compact";
  return (
    <div
      className={cn(
        "group/search relative flex h-[var(--k-control-h)] w-56 shrink-0 items-center rounded-md border border-control-border bg-control transition-colors",
        "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 hover:bg-hover focus-within:hover:bg-control",
        compact && "h-7 w-48",
        className,
      )}
      data-bar-search
    >
      <AnxSearch aria-hidden className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        aria-label={placeholder.replace(/(\.\.\.|…)$/, "")}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="h-full w-full min-w-0 bg-transparent pl-8 pr-7 text-xs text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { onChange(""); inputRef.current?.focus(); }}
          className="absolute right-1.5 flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-hover hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
