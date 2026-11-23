import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import SignalsPageWrapper from "@legacy/app/components/pages/signals-page/signals-page-wrapper";
import { LegacyPage } from "@legacy/shell/legacy-page";

/**
 * Signals (Alerts, Meetings, Work-station), ported from anarix-ui with its layout and behaviour unchanged
 * (see src/legacy). As on every page, the page level metric bar sits under the page heading; it holds the date range,
 * in the same picker as Profitability. The page fills the height of the main column.
 */
export default function Signals() {
  return (
    <AppLayout fullBleed>
      <div className="relative h-full">
        <div className="absolute inset-0">
          <LegacyPage subHeader={false} fill>
            <SignalsPageWrapper bar={<AppTaskbar showDateRange />} />
          </LegacyPage>
        </div>
      </div>
    </AppLayout>
  );
}
