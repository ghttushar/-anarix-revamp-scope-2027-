import { GeographicalData } from "@/types/profitability";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCountUp } from "@/hooks/useCountUp";

/** A figure that counts up when the region changes. */
function Count({ value, format }: { value: number; format: (v: number) => string }) {
  return <>{format(useCountUp(value, 700))}</>;
}

interface RegionStatsPanelProps {
  region: GeographicalData;
  dateRange: string;
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function RegionStatsPanel({ region, dateRange }: RegionStatsPanelProps) {
  const { formatCurrency } = useCurrency();
  const refundRate = (region.refunds / region.orders) * 100;
  const margin = ((region.sales - region.amazonFees) / region.sales) * 100;
  const roi = (region.sales / region.amazonFees) * 100;

  return (
    <div className="pf-rise h-full rounded-lg border border-border bg-card p-4 flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
        <span className="text-3xl">{region.flag}</span>
        <div>
          <h3 className="font-semibold text-foreground">{region.region}</h3>
          <p className="text-sm text-muted-foreground">{dateRange}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="pf-stagger mb-4 grid grid-cols-2 gap-3">
        <div className="pf-tone-mint pf-bar pf-lift rounded-lg border border-border bg-card p-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="pf-dot" />Sales</p>
          <p className="mt-1 text-xl font-semibold text-foreground"><Count value={region.sales} format={formatCurrency} /></p>
        </div>
        <div className="pf-tone-lilac pf-bar pf-lift rounded-lg border border-border bg-card p-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="pf-dot" />Units</p>
          <p className="mt-1 text-xl font-semibold text-foreground"><Count value={region.unitsSold} format={(v) => formatNumber(Math.round(v))} /></p>
        </div>
        <div className="pf-tone-sky pf-bar pf-lift rounded-lg border border-border bg-card p-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="pf-dot" />Orders</p>
          <p className="mt-1 text-xl font-semibold text-foreground"><Count value={region.orders} format={(v) => formatNumber(Math.round(v))} /></p>
        </div>
        <div className="pf-tone-rose pf-bar pf-lift rounded-lg border border-border bg-card p-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="pf-dot" />Total Expenses</p>
          <p className="mt-1 text-xl font-semibold text-foreground"><Count value={region.amazonFees} format={formatCurrency} /></p>
        </div>
      </div>

      {/* Calculated Metrics */}
      <div className="border-t border-border pt-4 flex-1">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          How it adds up
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">% Refunds</span>
            <span className={cn("font-medium", refundRate > 10 ? "text-destructive" : "text-foreground")}>
              {formatPercent(refundRate)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sellable Returns</span>
            <span className="font-medium text-foreground">{formatNumber(region.sellableReturns)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Margin</span>
            <span className={cn("font-semibold", margin > 20 ? "text-success" : margin < 0 ? "text-destructive" : "text-foreground")}>
              {formatPercent(margin)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ROI</span>
            <span className="font-semibold text-success">{formatPercent(roi)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
