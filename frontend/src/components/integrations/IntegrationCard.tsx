import { Button } from "@/components/ui/button";
import { WhatsAppLogo } from "./WhatsAppLogo";

interface Props {
  count: number;
  onConnect: () => void;
}

export function IntegrationCard({ count, onConnect }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
        <WhatsAppLogo className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">WhatsApp</h3>
          <span className="text-2xs uppercase tracking-wide text-muted-foreground border border-border rounded px-1.5 py-0.5">
            Alerts
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Receive Anarix alerts and notifications on WhatsApp. Choose which services and accounts trigger messages.
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {count > 0 && (
          <span className="text-xs text-muted-foreground">
            {count} active {count === 1 ? "connection" : "connections"}
          </span>
        )}
        <Button size="sm" onClick={onConnect}>
          {count > 0 ? "Add another connection" : "Connect WhatsApp"}
        </Button>
      </div>
    </div>
  );
}
