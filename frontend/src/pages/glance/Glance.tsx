import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "@legacy/app/components/pages/dashboard-page/dashboard-page";
import { LegacyPage } from "@legacy/shell/legacy-page";

/** Glance (the nuggets dashboard), ported from anarix-ui with its layout and behaviour unchanged (see src/legacy). */
export default function Glance() {
  return (
    <AppLayout fullBleed>
      <LegacyPage>
        <DashboardPage />
      </LegacyPage>
    </AppLayout>
  );
}
