import { AppLayout } from "@/components/layout/AppLayout";
import SignalsPageWrapper from "@legacy/app/components/pages/signals-page/signals-page-wrapper";
import { LegacyPage } from "@legacy/shell/legacy-page";

/**
 * Signals (Alerts, Meetings, Work-station), ported from anarix-ui with its layout and behaviour unchanged
 * (see src/legacy). Like in anarix-ui, it has no page header strip: its own tab header runs across the top.
 */
export default function Signals() {
  return (
    <AppLayout fullBleed>
      <LegacyPage subHeader={false}>
        <SignalsPageWrapper />
      </LegacyPage>
    </AppLayout>
  );
}
