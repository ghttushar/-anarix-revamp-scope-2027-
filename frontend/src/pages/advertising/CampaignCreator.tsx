import { AppLayout } from "@/components/layout/AppLayout";
import CampaignCreatorPage from "@legacy/app/components/pages/advertising-page/campaign-creator/campaign-creator";
import { LegacyPage } from "@legacy/shell/legacy-page";

/** Campaign Creator, ported from anarix-ui with its layout and behaviour unchanged (see src/legacy). */
export default function CampaignCreator() {
  return (
    <AppLayout fullBleed>
      <LegacyPage>
        <CampaignCreatorPage />
      </LegacyPage>
    </AppLayout>
  );
}
