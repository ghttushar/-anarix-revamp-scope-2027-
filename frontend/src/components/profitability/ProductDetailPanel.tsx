import { useState } from "react";
import { X, ChevronDown, ChevronRight, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfitabilityProduct } from "@/types/profitability";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface ProductDetailPanelProps {
  product: ProfitabilityProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PnLSection {
  id: string;
  label: string;
  total: number;
  children?: { label: string; value: number }[];
}

/** Breakdown sections in the Profitability moods: revenue lilac, cost of goods peach, expenses rose. */
const SECTION_TONE: Record<string, string> = { revenue: "pf-tone-lilac", cogs: "pf-tone-peach", expenses: "pf-tone-rose" };

export function ProductDetailPanel({ product, isOpen, onClose }: ProductDetailPanelProps) {
  const { formatCurrency: fmt } = useCurrency();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["revenue"]));

  if (!product || !isOpen) return null;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Build sparkline data from weeklyData
  const sparkData = product.weeklyData
    ? Object.entries(product.weeklyData).map(([week, value]) => ({ week, value }))
    : [];

  // P&L breakdown
  const pnlSections: PnLSection[] = [
    {
      id: "revenue",
      label: "Revenue",
      total: product.authSales - product.refundSales - product.cancelledSales,
      children: [
        { label: "Order Sales", value: product.authSales },
        { label: "Refund Sales", value: -product.refundSales },
        { label: "Cancelled Sales", value: -product.cancelledSales },
      ],
    },
    {
      id: "cogs",
      label: "Cost of Goods",
      total: -(product.cogs * product.units),
      children: [
        { label: `COGS (${fmt(product.cogs)} × ${product.units} units)`, value: -(product.cogs * product.units) },
      ],
    },
    {
      id: "expenses",
      label: "Expenses",
      total: -(product.adSpend + product.commissionProduct + product.commissionShipping + product.wfsFulfillmentFee + product.shippingFees + product.additionalFee),
      children: [
        { label: "Advertising Cost", value: -product.adSpend },
        { label: "Commission on Product", value: -product.commissionProduct },
        { label: "Commission on Shipping", value: -product.commissionShipping },
        { label: "WFS Fulfillment Fee", value: -product.wfsFulfillmentFee },
        { label: "Shipping Fees", value: -product.shippingFees },
        { label: "Additional Fee", value: -product.additionalFee },
      ],
    },
  ];

  const unitsSections = [
    { label: "Units Sold", value: product.units.toLocaleString() },
    { label: "Refund Units", value: product.refundUnits.toLocaleString() },
    { label: "Cancelled Units", value: product.cancelledUnits.toLocaleString() },
  ];

  return (
    <div
      data-app-panel="productDetail"
      className="sticky top-0 self-start h-screen max-h-screen flex w-[360px] shrink-0 flex-col border-l border-border bg-surface z-10"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="border-b border-border shrink-0">
        <div className="flex items-center gap-3 px-4 py-4">
          <img
            src={product.image}
            alt={product.name}
            className="h-10 w-10 rounded-md border border-border object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-sm font-semibold text-foreground line-clamp-1">{product.name}</h2>
            <p className="text-xs text-muted-foreground">{product.itemId} • {product.sku}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-5 p-4">
          {/* Net Profit Hero + Sparkline */}
          <div className={cn(product.netProfit < 0 ? "pf-tone-rose" : "pf-tone-mint", "pf-wash pf-hero pf-rise overflow-hidden rounded-lg border border-[color:var(--pf-soft)] p-3")}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xs text-muted-foreground font-medium">What this product keeps</div>
                <div className="pf-text text-xl font-semibold">{fmt(product.netProfit)}</div>
                {product.profitMargin != null && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Margin: <span className={cn("font-medium", product.profitMargin > 20 ? "text-success" : "text-destructive")}>{product.profitMargin.toFixed(1)}%</span>
                  </div>
                )}
              </div>
              {sparkData.length > 0 && (
                <div className="h-10 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                      <defs>
                        <linearGradient id="pf-spark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={product.netProfit < 0 ? "hsl(350, 58%, 56%)" : "hsl(162, 52%, 38%)"} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={product.netProfit < 0 ? "hsl(350, 58%, 56%)" : "hsl(162, 52%, 38%)"} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke={product.netProfit < 0 ? "hsl(350, 58%, 56%)" : "hsl(162, 52%, 38%)"} fill="url(#pf-spark)" strokeWidth={1.75} dot={false} animationDuration={900} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* P&L Breakdown — expandable sections */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Where the money went</h3>
              <button
                onClick={() => {
                  const allIds = pnlSections.filter((s) => s.children && s.children.length > 0).map((s) => s.id);
                  const allExpanded = allIds.every((id) => expandedSections.has(id));
                  setExpandedSections(allExpanded ? new Set() : new Set(allIds));
                }}
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-2xs font-medium text-muted-foreground hover:bg-hover hover:text-foreground transition-colors cursor-pointer"
                title="Expand or collapse all sections"
              >
                <ChevronsUpDown className="h-3 w-3" />
                {pnlSections.filter((s) => s.children?.length).every((s) => expandedSections.has(s.id)) ? "Collapse all" : "Expand all"}
              </button>
            </div>
            <div className="pf-stagger space-y-1">
              {pnlSections.map((section) => {
                const isExpanded = expandedSections.has(section.id);
                const hasChildren = section.children && section.children.length > 0;
                return (
                  <div key={section.id} className={SECTION_TONE[section.id] ?? "pf-tone-lilac"}>
                    <button
                      onClick={() => hasChildren && toggleSection(section.id)}
                      className={cn(
                        "pf-bar flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                        hasChildren ? "cursor-pointer hover:bg-[color:var(--pf-wash-a)]" : "cursor-default",
                        isExpanded && "pf-wash-x"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {hasChildren && <ChevronRight className={cn("h-3 w-3 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-90")} />}
                        <span className="pf-dot" />
                        <span className="font-medium text-foreground">{section.label}</span>
                      </div>
                      <span className={cn("font-semibold", section.total >= 0 ? "text-success" : "text-destructive")}>
                        {fmt(section.total)}
                      </span>
                    </button>
                    {isExpanded && section.children && (
                      <div className="ml-5 space-y-0.5 pb-1">
                        {section.children.map((child) => (
                          <div key={child.label} className="flex items-center justify-between px-3 py-1.5 text-xs">
                            <span className="text-muted-foreground">{child.label}</span>
                            <span className="font-medium text-foreground">{fmt(child.value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Net Profit total row */}
              <div className={cn(product.netProfit < 0 ? "pf-tone-rose" : "pf-tone-mint", "pf-wash flex items-center justify-between rounded-md px-3 py-2 border border-[color:var(--pf-soft)] mt-2")}>
                <span className="text-sm font-semibold text-foreground">Net Profit</span>
                <span className={cn("text-sm font-bold", product.netProfit >= 0 ? "text-success" : "text-destructive")}>
                  {fmt(product.netProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Units */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Units</h3>
            <div className="space-y-1">
              {unitsSections.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-md bg-muted/70 px-3 py-2">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculated Metrics */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Calculated Metrics</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between rounded-md bg-muted/70 px-3 py-2">
                <span className="text-sm text-muted-foreground">GMV</span>
                <span className="font-medium text-foreground">{fmt(product.gmv)}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/70 px-3 py-2">
                <span className="text-sm text-muted-foreground">Est. Payout</span>
                <span className="font-medium text-foreground">{fmt(product.authSales - product.commissionProduct - product.commissionShipping)}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/70 px-3 py-2">
                <span className="text-sm text-muted-foreground">Profit Margin</span>
                <span className="font-medium text-foreground">{product.profitMargin ? `${product.profitMargin.toFixed(1)}%` : "-"}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/70 px-3 py-2">
                <span className="text-sm text-muted-foreground">COGS / Unit</span>
                <span className="font-medium text-foreground">{fmt(product.cogs)}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/70 px-3 py-2">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-medium text-foreground">{fmt(product.price)}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
