import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface CheckoutPlan {
  name: string;
  sectionLabel: string;
  monthly: number | null;
}

interface CheckoutDialogProps {
  plan: CheckoutPlan | null;
  onClose: () => void;
  onPaid: (plan: CheckoutPlan) => void;
}

/**
 * Dummy checkout: plan summary plus card details. Nothing is charged; after a short
 * "processing" pause it reports the plan as paid.
 */
export function CheckoutDialog({ plan, onClose, onPaid }: CheckoutDialogProps) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [paying, setPaying] = useState(false);

  const reset = () => { setNumber(""); setName(""); setExp(""); setCvc(""); setPaying(false); };

  const handlePay = () => {
    if (!plan) return;
    if (number.replace(/\s/g, "").length < 12 || !name || !exp || cvc.length < 3) {
      toast.error("Please complete all card details.");
      return;
    }
    setPaying(true);
    window.setTimeout(() => {
      onPaid(plan);
      reset();
    }, 1200);
  };

  const price = plan?.monthly != null ? `$${plan.monthly}/mo` : "Custom pricing";

  return (
    <Dialog open={!!plan} onOpenChange={(v) => { if (!v && !paying) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Demo billing — no card is charged.</DialogDescription>
        </DialogHeader>

        {plan && (
          <div className="rounded-lg border border-border bg-muted/30 p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{plan.sectionLabel}</p>
              <p className="font-semibold text-foreground">{plan.name}</p>
            </div>
            <p className="text-lg font-bold text-foreground shrink-0">{price}</p>
          </div>
        )}

        <div className="space-y-4 py-1">
          <div className="space-y-2">
            <Label htmlFor="checkout-card-number">Card number</Label>
            <Input id="checkout-card-number" placeholder="4242 4242 4242 4242" value={number} onChange={(e) => setNumber(e.target.value)} disabled={paying} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout-card-name">Name on card</Label>
            <Input id="checkout-card-name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} disabled={paying} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="checkout-card-exp">Expiry</Label>
              <Input id="checkout-card-exp" placeholder="MM/YY" value={exp} onChange={(e) => setExp(e.target.value)} disabled={paying} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-card-cvc">CVC</Label>
              <Input id="checkout-card-cvc" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} disabled={paying} />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => { reset(); onClose(); }} disabled={paying}>Cancel</Button>
          <Button onClick={handlePay} disabled={paying}>
            {paying ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Lock className="h-3.5 w-3.5 mr-1.5" />}
            {paying ? "Processing…" : `Pay ${price}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
