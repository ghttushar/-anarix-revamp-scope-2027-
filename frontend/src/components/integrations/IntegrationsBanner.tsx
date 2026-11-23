import "@legacy/scope.css";
import DashboardBanner, { type BannerConnect } from "@legacy/app/components/common/dashboard-banner/dashboard-banner";
import { cn } from "@/lib/utils";

export type { BannerConnect };

/**
 * What's new: connect MCP, or bring Aan into Slack. anarix-ui's two-slide dashboard banner, with its design kept and
 * its colors on this app's palette (src/legacy). On the Integrations page its buttons open the connect panels
 * (onConnect); elsewhere they open Integrations with that panel already open.
 */
export function IntegrationsBanner({ onConnect, className }: { onConnect?: (kind: BannerConnect) => void; className?: string }) {
  return (
    <div className={cn("np-scope", className)}>
      <DashboardBanner onConnect={onConnect} />
    </div>
  );
}
