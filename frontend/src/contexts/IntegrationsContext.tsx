import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ServiceKey =
  | "profitability"
  | "advertising"
  | "rules"
  | "catalog"
  | "bi"
  | "dayparting";

export interface WhatsAppIntegration {
  id: string;
  phoneNumber: string;
  countryCode: string;
  verifiedAt: string;
  services: ServiceKey[];
  accountIds: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationsContextType {
  integrations: WhatsAppIntegration[];
  addIntegration: (i: Omit<WhatsAppIntegration, "id" | "createdAt" | "updatedAt">) => WhatsAppIntegration;
  updateIntegration: (id: string, updates: Partial<WhatsAppIntegration>) => void;
  removeIntegration: (id: string) => void;
  toggleEnabled: (id: string) => void;
  getIntegration: (id: string) => WhatsAppIntegration | undefined;
  /** MCP: an AI assistant (Claude, ChatGPT) connected to Aan. */
  mcpConnected: boolean;
  setMcpConnected: (on: boolean) => void;
  /** Workspace AI: ids of the chat workspaces Aan is connected to (slack, teams, google, discord, zoom). */
  workspaces: string[];
  setWorkspaceConnected: (id: string, on: boolean) => void;
}

const IntegrationsContext = createContext<IntegrationsContextType | null>(null);
const STORAGE_KEY = "anarix_integrations";
const MCP_KEY = "anarix_mcp_connected";
const WORKSPACES_KEY = "anarix_workspaces";

function readStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function IntegrationsProvider({ children }: { children: ReactNode }) {
  const [integrations, setIntegrations] = useState<WhatsAppIntegration[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations));
  }, [integrations]);

  const [mcpConnected, setMcpConnected] = useState<boolean>(() => readStored(MCP_KEY, false));
  const [workspaces, setWorkspaces] = useState<string[]>(() => readStored(WORKSPACES_KEY, []));
  useEffect(() => {
    try { localStorage.setItem(MCP_KEY, JSON.stringify(mcpConnected)); } catch { /* storage unavailable */ }
  }, [mcpConnected]);
  useEffect(() => {
    try { localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces)); } catch { /* storage unavailable */ }
  }, [workspaces]);
  const setWorkspaceConnected = (id: string, on: boolean) =>
    setWorkspaces((prev) => (on ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((w) => w !== id)));

  const addIntegration: IntegrationsContextType["addIntegration"] = (i) => {
    const now = new Date().toISOString();
    const created: WhatsAppIntegration = {
      ...i,
      id: `wa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    setIntegrations((prev) => [...prev, created]);
    return created;
  };

  const updateIntegration: IntegrationsContextType["updateIntegration"] = (id, updates) => {
    setIntegrations((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, ...updates, updatedAt: new Date().toISOString() } : it
      )
    );
  };

  const removeIntegration = (id: string) =>
    setIntegrations((prev) => prev.filter((it) => it.id !== id));

  const toggleEnabled = (id: string) =>
    setIntegrations((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, enabled: !it.enabled, updatedAt: new Date().toISOString() } : it
      )
    );

  const getIntegration = (id: string) => integrations.find((it) => it.id === id);

  return (
    <IntegrationsContext.Provider
      value={{
        integrations, addIntegration, updateIntegration, removeIntegration, toggleEnabled, getIntegration,
        mcpConnected, setMcpConnected, workspaces, setWorkspaceConnected,
      }}
    >
      {children}
    </IntegrationsContext.Provider>
  );
}

export function useIntegrations() {
  const ctx = useContext(IntegrationsContext);
  if (!ctx) throw new Error("useIntegrations must be used within IntegrationsProvider");
  return ctx;
}

export const SERVICE_META: Record<
  ServiceKey,
  { label: string; description: string }
> = {
  profitability: { label: "Profitability", description: "Margin drops, COGS swings, P&L anomalies." },
  advertising: { label: "Advertising", description: "ACoS spikes, budget pacing, campaign issues." },
  rules: { label: "Rules", description: "Rule triggers, execution errors, applied changes." },
  catalog: { label: "Catalog", description: "Stockouts, listing suppressions, inventory risks." },
  bi: { label: "Business Intelligence", description: "Share of voice shifts, keyword anomalies." },
  dayparting: { label: "Day Parting", description: "Schedule changes, missed windows, overrides." },
};
