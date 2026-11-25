import { useId } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface UnderlineTabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
}

/** Tabs whose underline slides to the active tab (a spring, like Aan's moves); text fades between tones. */
export function UnderlineTabs({ tabs, value, onChange }: UnderlineTabsProps) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <LayoutGroup id={id}>
      <div role="tablist" className="flex gap-1 border-b border-border">
        {tabs.map((tab) => {
          const active = value === tab.value;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.value)}
              className={cn(
                "relative flex items-center gap-1.5 rounded-t-md px-3 pb-2.5 pt-1 text-sm font-medium transition-colors duration-150 cursor-pointer",
                active ? "text-foreground" : "text-muted-foreground hover:bg-hover hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-2xs tabular-nums leading-4 transition-colors",
                    active ? "bg-tint text-primary" : "bg-field text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              )}
              {active && (
                <motion.span
                  layoutId="underline"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                  className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
