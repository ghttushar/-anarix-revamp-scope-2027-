import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { FilterProvider } from "@/contexts/FilterContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AccountProvider, useAccounts } from "@/contexts/AccountContext";
import { IntegrationsProvider } from "@/contexts/IntegrationsContext";
import { VisualEffectsProvider } from "@/contexts/VisualEffectsContext";
import { BillingFlowProvider } from "@/contexts/BillingFlowContext";
import { TrialProvider } from "@/contexts/TrialContext";
import { MaintenanceProvider, useMaintenance } from "@/contexts/MaintenanceContext";
import { ActivePanelProvider } from "@/contexts/ActivePanelContext";
import { AanProvider } from "@/components/aan";
import { AanPanelProvider } from "@/contexts/AanPanelContext";
import UnderMaintenance from "./pages/system/UnderMaintenance";
import { InsightsProvider } from "@/components/insights";
import { CreativeFeatures } from "@/features/creative";
import { toast } from "sonner";
import NotFound from "./pages/NotFound";
import Signals from "./pages/signals/Signals";

// Auth & Onboarding
import Login from "./pages/auth/Login";
import ConnectAccounts from "./pages/onboarding/ConnectAccounts";

// Advertising
import CampaignManager from "./pages/advertising/CampaignManager";
import CampaignCreator from "./pages/advertising/CampaignCreator";
import ImpactAnalysis from "./pages/advertising/ImpactAnalysis";
import ImpactCampaignDetail from "./pages/advertising/ImpactCampaignDetail";
import ImpactAdGroupDetail from "./pages/advertising/ImpactAdGroupDetail";
import TargetingActions from "./pages/advertising/TargetingActions";
import AdvCampaignDetail from "./pages/advertising/CampaignDetail";
import AdGroupDetail from "./pages/advertising/AdGroupDetail";
import ProductAdDetail from "./pages/advertising/ProductAdDetail";
import RuleAgents from "./pages/advertising/RuleAgents";
import RuleCreation from "./pages/advertising/RuleCreation";
import AppliedRules from "./pages/advertising/AppliedRules";
import RulesHistory from "./pages/advertising/RulesHistory";

// Profitability
import ProfitabilityDashboard from "./pages/profitability/Dashboard";
import ProfitabilityTrends from "./pages/profitability/Trends";
import ProfitLoss from "./pages/profitability/ProfitLoss";
import Geographical from "./pages/profitability/Geographical";

// Catalog
import CatalogProducts from "./pages/catalog/Products";

// Business Intelligence
import BrandSOV from "./pages/bi/BrandSOV";
import KeywordTracker from "./pages/bi/KeywordTracker";
import KeywordSOV from "./pages/bi/KeywordSOV";
import ProductSOV from "./pages/bi/ProductSOV";

// AMC
import AMCQueries from "./pages/amc/Queries";
import AMCExecutedQueries from "./pages/amc/ExecutedQueries";
import AMCSchedules from "./pages/amc/Schedules";
import AMCAudiences from "./pages/amc/Audiences";
import AMCCreatedAudiences from "./pages/amc/CreatedAudiences";
import AMCInstances from "./pages/amc/Instances";

// Day Parting
import HourlyData from "./pages/dayparting/HourlyData";
import Glance from "./pages/glance/Glance";
import Kit from "./pages/kit/Kit";

// Aan
import AanWorkspacePage from "./pages/aan/Workspace";
import AanFeedPage from "./pages/aan/Feed";
import AanPoliciesPage from "./pages/aan/Policies";
import { AanEventsProvider } from "@/components/aan/autonomous/AanEventsContext";
import PanelIndex, {
  AanInboxPanelRoute,
  AanInboxMorningRoute,
  AanInboxMeetingActionsRoute,
  AanInboxCardRoute,
  AanArtifactRoute,
  InsightsPanelRoute,
  NotificationsPanelRoute,
} from "./pages/panels/PanelRoute";

// Settings
import Preferences from "./pages/settings/Preferences";
import Accounts from "./pages/settings/Accounts";
import ConnectAmazon from "./pages/settings/ConnectAmazon";
import ConnectWalmart from "./pages/settings/ConnectWalmart";
import SettingsTeam from "./pages/settings/Team";
import Integrations from "./pages/settings/Integrations";
import Billing from "./pages/settings/Billing";
import Logs from "./pages/settings/Logs";
import ChangePlan from "./pages/settings/ChangePlan";
import CancelPlan from "./pages/settings/CancelPlan";

// Brand


const queryClient = new QueryClient();

function WelcomeToasts() {
  const { hasAccounts } = useAccounts();

  useEffect(() => {
    if (hasAccounts) {
      const timer1 = setTimeout(() => {
        toast.success("Welcome to Anarix! Your data is syncing...");
      }, 2000);

      const timer2 = setTimeout(() => {
        toast.info("💡 Tip: Press ⌘K to open the command palette", {
          duration: 5000,
        });
      }, 8000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [hasAccounts]);

  return null;
}

function MaintenanceGate() {
  const { maintenanceMode } = useMaintenance();
  if (maintenanceMode) return <UnderMaintenance />;
  return <AppRoutes />;
}

function AppRoutes() {
  const { hasAccounts, isOnboarding } = useAccounts();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isOnboarding && !hasAccounts ? (
            <Navigate to="/login" replace />
          ) : (
            <Navigate to="/profitability/dashboard" replace />
          )
        }
      />

      {/* Auth & Onboarding */}
      <Route path="/maintenance" element={<UnderMaintenance />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding/connect" element={<ConnectAccounts />} />

      {/* Sandbox */}
      <Route path="/glance" element={<Glance />} />
      <Route path="/workspace" element={<Navigate to="/glance" replace />} />
      <Route path="/workspace/*" element={<Navigate to="/glance" replace />} />
      <Route path="/dashboard" element={<Navigate to="/glance" replace />} />
      {/* The "pro" UI kit showcase (pilot) */}
      <Route path="/kit" element={<Kit />} />

      {/* Profitability */}
      <Route path="/profitability/dashboard" element={<ProfitabilityDashboard />} />
      <Route path="/profitability/dashboard/:tab" element={<ProfitabilityDashboard />} />
      <Route path="/profitability/trends" element={<ProfitabilityTrends />} />
      <Route path="/profitability/pnl" element={<ProfitLoss />} />
      <Route path="/profitability/geo" element={<Geographical />} />

      {/* Advertising */}
      <Route path="/advertising/campaigns" element={<CampaignManager />} />
      <Route path="/advertising/campaign-creator/*" element={<CampaignCreator />} />
      <Route path="/advertising/campaigns/:campaignId" element={<AdvCampaignDetail />} />
      <Route path="/advertising/campaigns/:campaignId/:adGroupId" element={<AdGroupDetail />} />
      <Route path="/advertising/campaigns/:campaignId/:adGroupId/:productAdId" element={<ProductAdDetail />} />
      <Route path="/advertising/impact" element={<ImpactAnalysis />} />
      <Route path="/advertising/impact/campaigns/:campaignId" element={<ImpactCampaignDetail />} />
      <Route path="/advertising/impact/campaigns/:campaignId/:adGroupId" element={<ImpactAdGroupDetail />} />
      <Route path="/advertising/targeting" element={<TargetingActions />} />
      <Route path="/advertising/rules/agents" element={<RuleAgents />} />
      <Route path="/advertising/rules/applied" element={<AppliedRules />} />
      <Route path="/advertising/rules/history" element={<RulesHistory />} />
      <Route path="/advertising/rules/create" element={<RuleCreation />} />
      <Route path="/advertising/rules/create/:templateId" element={<RuleCreation />} />
      <Route path="/advertising/rules/edit/:ruleId" element={<RuleCreation />} />

      {/* Catalog */}
      <Route path="/catalog/products" element={<CatalogProducts />} />

      {/* Business Intelligence */}
      <Route path="/bi/brand-sov" element={<BrandSOV />} />
      <Route path="/bi/keyword-tracker" element={<KeywordTracker />} />
      <Route path="/bi/keyword-sov" element={<KeywordSOV />} />
      <Route path="/bi/product-sov" element={<ProductSOV />} />

      {/* AMC */}
      <Route path="/amc/queries" element={<AMCQueries />} />
      <Route path="/amc/executed" element={<AMCExecutedQueries />} />
      <Route path="/amc/schedules" element={<AMCSchedules />} />
      <Route path="/amc/audiences" element={<AMCAudiences />} />
      <Route path="/amc/created-audiences" element={<AMCCreatedAudiences />} />
      <Route path="/amc/instances" element={<AMCInstances />} />

      {/* Day Parting */}
      <Route path="/dayparting" element={<HourlyData />} />
      <Route path="/dayparting/hourly" element={<Navigate to="/dayparting" replace />} />
      <Route path="/dayparting/campaigns" element={<Navigate to="/dayparting" replace />} />
      <Route path="/dayparting/campaigns/:campaignId" element={<Navigate to="/dayparting" replace />} />
      <Route path="/dayparting/history" element={<HourlyData />} />
      <Route path="/dayparting/scheduled" element={<Navigate to="/dayparting" replace />} />
      <Route path="/dayparting/scheduled/*" element={<Navigate to="/dayparting" replace />} />

      {/* Aan */}
      <Route path="/aan" element={<AanWorkspacePage />} />
      <Route path="/aan/feed" element={<AanFeedPage />} />
      <Route path="/aan/policies" element={<AanPoliciesPage />} />

      {/* Reports */}

      {/* Signals (Alerts, Meetings, Work-station), ported from anarix-ui. The old /alerts addresses open it. */}
      <Route path="/signals" element={<Signals />} />
      <Route path="/alerts" element={<Navigate to="/signals" replace />} />
      <Route path="/alerts/*" element={<Navigate to="/signals" replace />} />

      {/* Standalone panel routes — for figma export and shareable deep links */}
      <Route path="/panels" element={<PanelIndex />} />
      <Route path="/panels/aan-inbox" element={<AanInboxPanelRoute />} />
      <Route path="/panels/aan-inbox/morning" element={<AanInboxMorningRoute />} />
      <Route path="/panels/aan-inbox/meeting-actions" element={<AanInboxMeetingActionsRoute />} />
      <Route path="/panels/aan-inbox/card/:scenarioId" element={<AanInboxCardRoute />} />
      <Route path="/panels/aan-inbox/details/:scenarioId" element={<AanArtifactRoute />} />
      <Route path="/panels/insights" element={<InsightsPanelRoute />} />
      <Route path="/panels/notifications" element={<NotificationsPanelRoute />} />

      {/* Settings */}
      <Route path="/settings/appearance" element={<Preferences />} />
      <Route path="/settings/accounts" element={<Accounts />} />
      <Route path="/settings/integrations" element={<Integrations />} />
      <Route path="/settings/accounts/connect/amazon" element={<ConnectAmazon />} />
      <Route path="/settings/accounts/connect/walmart" element={<ConnectWalmart />} />
      <Route path="/settings/team" element={<SettingsTeam />} />
      <Route path="/settings/billing/change-plan" element={<ChangePlan mode="change" />} />
      <Route path="/settings/billing/downgrade" element={<ChangePlan mode="downgrade" />} />
      <Route path="/settings/billing/cancel" element={<CancelPlan />} />
      <Route path="/settings/logs" element={<Logs />} />
      <Route path="/settings/billing" element={<Billing />} />
      <Route path="/settings/billing/:tab" element={<Billing />} />


      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
        <CurrencyProvider>
        <AccountProvider>
          <IntegrationsProvider>
          <MarketplaceProvider defaultMarketplace="walmart">
            <FilterProvider>
              <ActivePanelProvider>
                <AanProvider>
                  <AanEventsProvider>
                  <AanPanelProvider>
                  <InsightsProvider>
                    <VisualEffectsProvider>
                    <BillingFlowProvider>
                    <TrialProvider>
                    <MaintenanceProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner position="bottom-left" />
                      <BrowserRouter>
                            <CreativeFeatures>
                              <WelcomeToasts />
                              <MaintenanceGate />
                            </CreativeFeatures>
                      </BrowserRouter>
                    </TooltipProvider>
                    </MaintenanceProvider>
                    </TrialProvider>
                    </BillingFlowProvider>
                    </VisualEffectsProvider>
                  </InsightsProvider>
                  </AanPanelProvider>
                  </AanEventsProvider>
                </AanProvider>
              </ActivePanelProvider>
            </FilterProvider>
          </MarketplaceProvider>
          </IntegrationsProvider>
        </AccountProvider>
        </CurrencyProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
