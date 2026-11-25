import { useEffect, useRef, useState, type ReactNode } from "react";
import { BarChart3, Check, CheckCircle2, ChevronDown, Copy, KeyRound, Lightbulb, Loader2, Lock, Sparkles, TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AanMascot } from "@/components/aan/AanMascot";
import { useIntegrations } from "@/contexts/IntegrationsContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChatGptLogo, ClaudeLogo } from "./BrandLogos";
import { FlowStepper } from "./FlowStepper";

const MCP_SERVER_URL = "https://mcp.anarix.ai/mcp/sse";
const LOGIN_COMMAND = "use anarix mcp and login";
const STEPS = ["Choose", "Setup", "Authenticate", "Verify"];

type ClientKey = "claude" | "codex";

const CLIENTS: { key: ClientKey; name: string; Logo: typeof ClaudeLogo; desc: string }[] = [
  { key: "claude", name: "Claude", Logo: ClaudeLogo, desc: "Anthropic’s assistant in the web app, desktop, and Code." },
  { key: "codex", name: "ChatGPT (Codex)", Logo: ChatGptLogo, desc: "OpenAI’s agentic coding environment." },
];

const REAUTH_TRIGGERS = [
  "Your session expires",
  "You switch accounts",
  "You clear browser or app data",
  "You’ve been inactive for an extended period",
];

const VERIFY_PROMPTS = [
  { id: "accounts", Icon: KeyRound, title: "Verify Account Access", prompt: "Show me the accounts I have access to." },
  { id: "campaigns", Icon: BarChart3, title: "Verify Campaign Data", prompt: "Show my top campaigns from the last month." },
  { id: "visuals", Icon: TrendingUp, title: "Verify Visualization", prompt: "Create a chart showing weekly ad spend and ROAS." },
];

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (value: string) => {
    navigator.clipboard?.writeText(value).catch(() => undefined);
    setCopied(value);
    toast.success("Copied", { description: value });
    window.setTimeout(() => setCopied((c) => (c === value ? null : c)), 1500);
  };
  return { copied, copy };
}

function CopyField({ label, value }: { label: string; value: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="space-y-1.5">
      <p className="text-sm text-foreground">{label}</p>
      <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 pl-3 pr-1 py-1">
        <code className="flex-1 min-w-0 truncate text-xs text-foreground">{value}</code>
        <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => copy(value)}>
          {copied === value ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          {copied === value ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

function Timeline({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary/10 text-primary text-2xs font-semibold flex items-center justify-center">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0 text-sm text-foreground">{item}</div>
        </li>
      ))}
    </ol>
  );
}

function Section({ title, icon, open, onToggle, children }: { title: string; icon: ReactNode; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <Collapsible open={open} onOpenChange={onToggle} className="rounded-lg border border-border bg-card">
      <CollapsibleTrigger className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-foreground">
        <span className="text-primary">{icon}</span>
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-4 py-4">{children}</CollapsibleContent>
    </Collapsible>
  );
}

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

/** Connect MCP: an AI assistant (Claude or ChatGPT) connected to Aan, in four steps. Opens as a right side panel. */
export function McpConnectFlow({ open, onOpenChange }: Props) {
  const { setMcpConnected } = useIntegrations();
  const [step, setStep] = useState(0);
  const [client, setClient] = useState<ClientKey>("claude");
  const [section, setSection] = useState<null | "team" | "individual" | "codex">(null);
  const [reauthOpen, setReauthOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const { copied, copy } = useCopy();
  const closeTimer = useRef<number>();

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setVerifying(false);
    setSuccess(false);
    setReauthOpen(false);
    setSection(null);
  }, [open]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const clientName = CLIENTS.find((c) => c.key === client)?.name;
  const last = step === STEPS.length - 1;

  const finish = () => {
    setVerifying(true);
    window.setTimeout(() => {
      setVerifying(false);
      setSuccess(true);
      setMcpConnected(true);
      toast.success("MCP connected", { description: "Your AI assistant is now connected to Aan." });
      closeTimer.current = window.setTimeout(() => onOpenChange(false), 2000);
    }, 1500);
  };

  const close = (o: boolean) => {
    if (!o && verifying) return;
    onOpenChange(o);
  };

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="p-5 border-b border-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <AanMascot size={22} interactive={false} />
            </div>
            <div>
              <SheetTitle className="text-base">Connect MCP</SheetTitle>
              <SheetDescription className="text-xs">Connect your AI assistant to Aan.</SheetDescription>
            </div>
          </div>
          <FlowStepper steps={STEPS} current={step} />
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-5 space-y-5">
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Choose your AI assistant</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Select which assistant will connect to Aan.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {CLIENTS.map(({ key, name, Logo, desc }) => {
                    const selected = client === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setClient(key)}
                        className={cn(
                          "relative rounded-xl border p-4 text-left transition-colors",
                          selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40"
                        )}
                      >
                        {selected && (
                          <span className="absolute right-3 top-3 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                        <Logo size={28} />
                        <p className="mt-3 text-sm font-medium text-foreground">{name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Set up your client</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Follow the steps below to connect <strong className="text-foreground">{clientName}</strong>.
                  </p>
                </div>
                {client === "claude" ? (
                  <div className="space-y-3">
                    <Section title="Team & Enterprise owners" icon={<Sparkles className="h-4 w-4" />} open={section === "team"} onToggle={() => setSection((s) => (s === "team" ? null : "team"))}>
                      <Timeline
                        items={[
                          <>Go to <strong>Organization Settings</strong> → <strong>Connectors</strong>.</>,
                          <>Click <strong>Add</strong>, select <strong>Custom</strong> → <strong>Web</strong>.</>,
                          <CopyField label="Paste the MCP server URL" value={MCP_SERVER_URL} />,
                          <>Click <strong>Save</strong> to add the connector.</>,
                        ]}
                      />
                    </Section>
                    <Section title="Individual users" icon={<Sparkles className="h-4 w-4" />} open={section === "individual"} onToggle={() => setSection((s) => (s === "individual" ? null : "individual"))}>
                      <Timeline
                        items={[
                          <>Open <strong>Settings</strong> → <strong>Connectors</strong>.</>,
                          <>Click <strong>Add Custom Connector</strong>.</>,
                          <CopyField label="Connector name" value="Aan" />,
                          <CopyField label="Paste the MCP server URL" value={MCP_SERVER_URL} />,
                          <>Click <strong>Save</strong>, then verify <strong>Aan</strong> appears in the connector list.</>,
                        ]}
                      />
                    </Section>
                  </div>
                ) : (
                  <Section title="ChatGPT (Codex)" icon={<Sparkles className="h-4 w-4" />} open={section === "codex"} onToggle={() => setSection((s) => (s === "codex" ? null : "codex"))}>
                    <Timeline
                      items={[
                        <>Open <strong>Settings</strong> → <strong>MCP Servers</strong>.</>,
                        <>Click <strong>Add Server</strong>.</>,
                        <CopyField label="Name" value="Anarix" />,
                        <CopyField label="Transport" value="Streamable HTTP" />,
                        <CopyField label="Paste the server URL" value={MCP_SERVER_URL} />,
                        <>Click <strong>Save</strong>.</>,
                      ]}
                    />
                  </Section>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Authenticate</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Authorize the connection to <strong className="text-foreground">{clientName}</strong>.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <Timeline
                    items={[
                      <>Open a new chat with {clientName}.</>,
                      <CopyField label="Run the authentication command:" value={LOGIN_COMMAND} />,
                      <>Click the generated login link.</>,
                      <>Sign in using your Anarix account.</>,
                      <>Return to {clientName}.</>,
                      <>Authentication completes automatically.</>,
                    ]}
                  />
                </div>
                <Section title="Need to authenticate again?" icon={<Lock className="h-4 w-4" />} open={reauthOpen} onToggle={() => setReauthOpen((o) => !o)}>
                  <p className="text-sm text-foreground mb-2">Repeat the login flow if:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {REAUTH_TRIGGERS.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </Section>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Verify connection</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Run these prompts in <strong className="text-foreground">{clientName}</strong> to confirm everything works.
                  </p>
                </div>
                <div className="space-y-2">
                  {VERIFY_PROMPTS.map(({ id, Icon, title, prompt }) => (
                    <div key={id} className="rounded-lg border border-border bg-card p-3 flex items-start gap-3">
                      <span className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">“{prompt}”</p>
                      </div>
                      <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => copy(prompt)}>
                        {copied === prompt ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied === prompt ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex gap-3">
                  <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Your MCP connection is almost complete</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Run each prompt in your connected AI assistant. If all three prompts return valid results, your MCP
                      connection is ready to use.
                    </p>
                  </div>
                </div>
                {success && (
                  <div className="flex items-center gap-2 text-sm font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    MCP connected — your AI assistants are ready.
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={step === 0 ? () => close(false) : () => setStep((s) => s - 1)} disabled={verifying}>
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          <Button onClick={last ? finish : () => setStep((s) => s + 1)} disabled={verifying || success}>
            {verifying && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
            {verifying ? "Verifying…" : last ? "Done" : "Next"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
