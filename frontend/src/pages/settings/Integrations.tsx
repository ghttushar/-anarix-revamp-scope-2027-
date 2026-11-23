import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIntegrations } from "@/contexts/IntegrationsContext";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { ConnectionRow } from "@/components/integrations/ConnectionRow";
import { WhatsAppPurposeInfo } from "@/components/integrations/WhatsAppPurposeInfo";
import { IntegrationWhatsAppFlow } from "./IntegrationWhatsApp";
import { IntegrationOption } from "@/components/integrations/IntegrationOption";
import { IntegrationsBanner, type BannerConnect } from "@/components/integrations/IntegrationsBanner";
import { McpConnectFlow } from "@/components/integrations/McpConnectFlow";
import { WorkspaceConnectFlow } from "@/components/integrations/WorkspaceConnectFlow";
import { ChatGptLogo, ClaudeLogo, WORKSPACE_APPS, WorkspaceStack } from "@/components/integrations/BrandLogos";
import { AanMascot } from "@/components/aan/AanMascot";
import { toast } from "sonner";

const breadcrumbItems = [
  { label: "Settings", href: "/settings/integrations" },
  { label: "Integrations" },
];

export default function Integrations() {
  const { integrations, removeIntegration, toggleEnabled, mcpConnected, workspaces } = useIntegrations();
  const [mcpOpen, setMcpOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const connectedApps = WORKSPACE_APPS.filter((a) => workspaces.includes(a.id));

  // Arriving from a banner elsewhere (location.state.connect): bring that card into view, flash it, open its panel.
  const location = useLocation();
  const mcpCardRef = useRef<HTMLDivElement | null>(null);
  const workspaceCardRef = useRef<HTMLDivElement | null>(null);
  const [flash, setFlash] = useState<BannerConnect | null>(null);
  const openConnect = (kind: BannerConnect) => (kind === "mcp" ? setMcpOpen(true) : setWorkspaceOpen(true));
  useEffect(() => {
    const kind = (location.state as { connect?: BannerConnect } | null)?.connect;
    if (!kind) return undefined;
    (kind === "mcp" ? mcpCardRef : workspaceCardRef).current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setFlash(kind);
    openConnect(kind);
    navigate(location.pathname, { replace: true, state: null });
    const t = window.setTimeout(() => setFlash(null), 1600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);
  const [flowOpen, setFlowOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const openCreate = () => {
    setEditId(null);
    setFlowOpen(true);
  };

  const openEdit = (id: string) => {
    setEditId(id);
    setFlowOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDelete) {
      removeIntegration(pendingDelete);
      toast.success("Integration removed");
      setPendingDelete(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        <IntegrationsBanner onConnect={openConnect} />
        <AppTaskbar breadcrumbItems={breadcrumbItems} />

        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground">
            Connect your AI assistants, chat workspaces and alert channels to Anarix.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-foreground">Available integrations</h2>
          <IntegrationOption
            ref={mcpCardRef}
            highlight={flash === "mcp"}
            icon={<AanMascot size={28} interactive={false} />}
            title="MCP"
            tag="AI assistants"
            isNew={!mcpConnected}
            description="Connect Claude or ChatGPT to Aan and unlock AI-powered marketplace intelligence."
            actionLabel={mcpConnected ? "Set up again" : "Connect MCP"}
            onAction={() => setMcpOpen(true)}
            status={mcpConnected ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                <ClaudeLogo size={14} />
                <ChatGptLogo size={14} />
                Connected
              </span>
            ) : undefined}
          />
          <IntegrationCard count={integrations.length} onConnect={openCreate} />
          <IntegrationOption
            ref={workspaceCardRef}
            highlight={flash === "workspace"}
            icon={<WorkspaceStack size={12} />}
            title="Workspace AI"
            tag="Chat"
            isNew={connectedApps.length === 0}
            description="Chat with Aan where your team works: alerts, answers and approvals in Slack, Teams or Google Chat."
            actionLabel={connectedApps.length > 0 ? "Manage" : "Connect a workspace"}
            onAction={() => setWorkspaceOpen(true)}
            status={connectedApps.length > 0 ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                {connectedApps.map(({ id, Logo }) => <Logo key={id} size={14} />)}
                {connectedApps.length} connected
              </span>
            ) : undefined}
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">Your connections</h2>
            {integrations.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {integrations.length} {integrations.length === 1 ? "connection" : "connections"}
              </span>
            )}
          </div>

          {integrations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
              <p className="text-sm font-medium text-foreground">No integrations yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Connect WhatsApp to receive operational alerts — ACoS spikes, stockouts, rule triggers — for the
                accounts and services you care about.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {integrations.map((it) => (
                <ConnectionRow
                  key={it.id}
                  integration={it}
                  onToggle={() => {
                    toggleEnabled(it.id);
                    toast.success(it.enabled ? "Alerts paused" : "Alerts resumed");
                  }}
                  onEdit={() => openEdit(it.id)}
                  onDelete={() => setPendingDelete(it.id)}
                />
              ))}
            </div>
          )}
        </section>

      </div>

      <McpConnectFlow open={mcpOpen} onOpenChange={setMcpOpen} />
      <WorkspaceConnectFlow open={workspaceOpen} onOpenChange={setWorkspaceOpen} />

      <IntegrationWhatsAppFlow
        open={flowOpen}
        onOpenChange={setFlowOpen}
        editId={editId}
      />

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove WhatsApp integration?</AlertDialogTitle>
            <AlertDialogDescription>
              This number will stop receiving Anarix alerts. You can reconnect it anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
