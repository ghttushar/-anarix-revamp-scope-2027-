import { AppLayout } from "@/components/layout/AppLayout";
import SyncFilters from "@legacy/app/components/hoc/sync-filters";
import { LogsPage } from "@legacy/app/components/pages/logs-page/logs-page";
import { LogsTitlesEnum } from "@legacy/enums/logs.enums";
import { LegacyPage } from "@legacy/shell/legacy-page";

/**
 * Settings → Logs, ported from anarix-ui with its layout and behaviour unchanged (see src/legacy). There is no
 * change-log backend here, so it shows anarix-ui's sample logs, as anarix-ui does when the endpoint returns nothing.
 */
export default function Logs() {
  return (
    <AppLayout fullBleed>
      <LegacyPage>
        <SyncFilters selectedNavTitle={LogsTitlesEnum.LOGS_HOME}>
          <LogsPage />
        </SyncFilters>
      </LegacyPage>
    </AppLayout>
  );
}
