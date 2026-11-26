import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  /** One word after the title in the brand→coral two-tone (Profitability's creative headings). */
  accent?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, accent, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className={cn("font-heading text-2xl font-semibold text-foreground", accent && "pf-rise")}>
          {accent ? (
            <>
              <span className="pf-title">{title}</span> <span className="pf-accent">{accent}</span>
            </>
          ) : (
            title
          )}
        </h1>
        {subtitle && <p className={cn("mt-0.5 text-sm text-muted-foreground", accent && "pf-rise")} style={accent ? { ["--pf-i" as string]: 1 } : undefined}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
