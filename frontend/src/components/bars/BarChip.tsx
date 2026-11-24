import { forwardRef, useMemo, useState, type ReactNode } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BAR_CHIP_CLASS } from "./tokens";
import { useBarDensity } from "./density";

export interface BarOption<V extends string = string> {
  value: V;
  label: string;
  /** Shorter text for the chip face when the full label is long. */
  short?: string;
  icon?: ReactNode;
  /** A series color, shown as a dot (metric pickers). */
  color?: string;
  description?: string;
  disabled?: boolean;
}

interface TriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Muted text before the value, e.g. "Frequency". */
  label?: ReactNode;
  icon?: ReactNode;
  value?: ReactNode;
  /** Hide the caret (for chips that toggle rather than open a menu). */
  noCaret?: boolean;
}

/**
 * The face of a bar chip. Use it directly as a PopoverTrigger / DropdownMenuTrigger child for controls with a custom
 * panel (the date range picker, the product picker); use BarChip for a plain single or multi select.
 */
export const BarChipTrigger = forwardRef<HTMLButtonElement, TriggerProps>(function BarChipTrigger(
  { label, icon, value, noCaret, className, children, ...props },
  ref,
) {
  const compact = useBarDensity() === "compact";
  return (
    <button ref={ref} type="button" className={cn(BAR_CHIP_CLASS, compact && "h-7 gap-1 px-2 text-[11px]", className)} {...props}>
      {icon && <span className={cn("flex shrink-0 text-muted-foreground", compact ? "[&_svg]:h-3 [&_svg]:w-3" : "[&_svg]:h-3.5 [&_svg]:w-3.5")}>{icon}</span>}
      {label && <span className="bar-chip-label shrink-0 text-muted-foreground">{label}</span>}
      {/* A long value (a campaign name) truncates so the bar stays one row; the full text is in the menu. */}
      {value !== undefined && <span className="min-w-0 max-w-[12rem] truncate font-medium text-foreground">{value}</span>}
      {children}
      {!noCaret && <ChevronDown className={cn("shrink-0 text-muted-foreground", compact ? "h-3 w-3" : "h-3.5 w-3.5")} />}
    </button>
  );
});

interface BaseProps<V extends string> {
  label?: ReactNode;
  icon?: ReactNode;
  options: BarOption<V>[];
  align?: "start" | "center" | "end";
  disabled?: boolean;
  className?: string;
  /** Shown at the top of the menu, e.g. "Up to 4 metrics". */
  heading?: string;
}

interface SingleProps<V extends string> extends BaseProps<V> {
  multiple?: false;
  value: V;
  onChange: (value: V) => void;
}

interface MultiProps<V extends string> extends BaseProps<V> {
  multiple: true;
  value: V[];
  onChange: (value: V[]) => void;
  /** Most that can be picked; further options are disabled until one is removed. */
  max?: number;
  /** Fewest that must stay picked (default 1). */
  min?: number;
  /** The chip's value text. Defaults to "n/max" (or "n/total"). */
  summary?: (selected: BarOption<V>[]) => ReactNode;
}

export type BarChipProps<V extends string = string> = SingleProps<V> | MultiProps<V>;

/** A dropdown chip: the only way a bar shows a setting. Single select by default, or `multiple` with an optional max. */
export function BarChip<V extends string = string>(props: BarChipProps<V>) {
  const { label, icon, options, align = "start", disabled, className, heading } = props;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchable = options.length > 8;
  const shown = useMemo(
    () => (query ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : options),
    [options, query],
  );

  let face: ReactNode;
  if (props.multiple) {
    const selected = options.filter((o) => props.value.includes(o.value));
    face = props.summary ? props.summary(selected) : `${selected.length}/${props.max ?? options.length}`;
  } else {
    const current = options.find((o) => o.value === props.value);
    face = current ? current.short ?? current.label : String(props.value);
  }

  const pick = (o: BarOption<V>) => {
    if (props.multiple) {
      const has = props.value.includes(o.value);
      if (has) {
        if (props.value.length <= (props.min ?? 1)) return;
        props.onChange(props.value.filter((v) => v !== o.value));
      } else {
        if (props.max && props.value.length >= props.max) return;
        props.onChange([...props.value, o.value]);
      }
    } else {
      (props.onChange as (v: V) => void)(o.value);
      setOpen(false);
    }
  };

  const headingText = heading ?? (props.multiple && props.max ? `Up to ${props.max}` : undefined);

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery(""); }}>
      <PopoverTrigger asChild disabled={disabled}>
        <BarChipTrigger label={label} icon={icon} value={face} className={className} disabled={disabled} />
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto min-w-[180px] max-w-[280px] p-1">
        {headingText && (
          <p className="px-2 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{headingText}</p>
        )}
        {searchable && (
          <div className="mb-1 flex items-center gap-1.5 border-b border-border px-2 pb-1.5 pt-1">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>
        )}
        <div className="max-h-[300px] overflow-auto">
          {shown.map((o) => {
            const selected = props.multiple ? props.value.includes(o.value) : props.value === o.value;
            const capped = props.multiple && !selected && !!props.max && props.value.length >= props.max;
            const isDisabled = o.disabled || capped;
            return (
              <button
                key={o.value}
                type="button"
                disabled={isDisabled}
                onClick={() => pick(o)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors",
                  selected ? "text-foreground" : "text-foreground/85",
                  isDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-muted",
                )}
              >
                {props.multiple ? (
                  <span
                    className={cn(
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border",
                      selected ? "border-primary bg-primary text-primary-foreground" : "border-input",
                    )}
                  >
                    {selected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                  </span>
                ) : null}
                {o.color && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: o.color }} />}
                {o.icon && <span className="flex shrink-0 text-muted-foreground [&_svg]:h-3.5 [&_svg]:w-3.5">{o.icon}</span>}
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate", selected && "font-medium")}>{o.label}</span>
                  {o.description && <span className="block text-[10px] text-muted-foreground">{o.description}</span>}
                </span>
                {!props.multiple && selected && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
              </button>
            );
          })}
          {shown.length === 0 && <p className="px-2 py-3 text-center text-xs text-muted-foreground">No matches</p>}
        </div>
      </PopoverContent>
    </Popover>
  );
}
