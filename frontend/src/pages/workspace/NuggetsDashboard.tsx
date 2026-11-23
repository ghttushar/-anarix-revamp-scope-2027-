import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "@legacy/app/components/pages/dashboard-page/dashboard-page";
import { LegacyPage } from "@legacy/shell/legacy-page";

/** The Dashboard (nuggets), ported from anarix-ui with its layout and behaviour unchanged (see src/legacy). */
export default function NuggetsDashboard() {
  return (
    <AppLayout fullBleed>
      <LegacyPage>
        <DashboardPage />
      </LegacyPage>
    </AppLayout>
  );
}
