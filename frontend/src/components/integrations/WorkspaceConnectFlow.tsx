import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIntegrations } from "@/contexts/IntegrationsContext";
import { toast } from "sonner";
import { WORKSPACE_APPS, WorkspaceStack, type WorkspaceApp } from "./BrandLogos";

/** Connecting is a mock: it waits a moment and the workspace counts as connected. */
const CONNECT_DELAY_MS = 700;

function WorkspaceRow({ app, connected, onConnect, onDisconnect }: {
  app: WorkspaceApp;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const { Logo } = app;
  const connect = () => {
    if (busy) return;
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      onConnect();
    }, CONNECT_DELAY_MS);
  };
  return (
    <li className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
      <span className="h-10 w-10 rounded-lg bg-muted/70 flex items-center justify-center shrink-0">
        <Logo size={22} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{app.name}</p>
        {connected ? (
          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Connected
          </p>
        ) : (
          <p className="mt-0.5 text-xs text-muted-foreground">{app.desc}</p>
        )}
      </div>
      {connected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              Manage
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDisconnect}>
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="outline" size="sm" onClick={connect} disabled={busy} aria-label={`Connect ${app.name}`} className="min-w-[84px]">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
        </Button>
      )}
    </li>
  );
}

/** Workspace AI: Aan as a bot in the chat tools a team already uses. Opens as a right side panel. */
export function WorkspaceConnectFlow({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { workspaces, setWorkspaceConnected } = useIntegrations();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="p-5 border-b border-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <WorkspaceStack size={10} />
            </div>
            <div>
              <SheetTitle className="text-base">Connect a workspace</SheetTitle>
              <SheetDescription className="text-xs">
                Bring Aan into the tools your team already chats in. You can connect more than one.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <ul className="p-5 space-y-2">
            {WORKSPACE_APPS.map((app) => (
              <WorkspaceRow
                key={app.id}
                app={app}
                connected={workspaces.includes(app.id)}
                onConnect={() => {
                  setWorkspaceConnected(app.id, true);
                  toast.success(`${app.name} connected`, { description: "Aan can now post alerts and answer questions there." });
                }}
                onDisconnect={() => {
                  setWorkspaceConnected(app.id, false);
                  toast.success(`${app.name} disconnected`);
                }}
              />
            ))}
          </ul>
        </ScrollArea>

        <div className="border-t border-border p-4 flex items-center justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
