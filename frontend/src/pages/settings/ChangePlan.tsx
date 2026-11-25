import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CheckoutDialog, type CheckoutPlan } from "@/components/billing/CheckoutDialog";
import { Button } from "@/components/ui/button";
import { pricingMajors } from "@/data/pricingPlans";
import { useTrial } from "@/contexts/TrialContext";
import { toast } from "sonner";

/**
 * Settings → Billing plan picker.
 * - "change": every plan (Upgrade plan, Edit Plan, Reheat my plan).
 * - "downgrade": only the lower tiers, reached from Cancel Plan.
 */
export default function ChangePlan({ mode }: { mode: "change" | "downgrade" }) {
  const navigate = useNavigate();
  const { setTrial } = useTrial();
  const downgrading = mode === "downgrade";
  const [checkout, setCheckout] = useState<CheckoutPlan | null>(null);

  const options = pricingMajors.flatMap((m) =>
    m.sections.flatMap((s) =>
      (downgrading ? s.plans.slice(0, -1) : s.plans).map((p) => ({ ...p, sectionLabel: `${m.label} · ${s.label}` }))
    )
  );

  const finish = (message: string) => {
    setTrial("paid");
    toast.success(message);
    navigate("/profitability/dashboard");
  };

  // Downgrading confirms straight away; choosing a plan goes through the (dummy) checkout.
  const handlePick = (plan: CheckoutPlan) => {
    if (downgrading) finish(`Downgraded to ${plan.name}`);
    else setCheckout(plan);
  };

  return (
    <AppLayout showWhenLapsed>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <button
            onClick={() => navigate(downgrading ? "/settings/billing/cancel" : "/settings/billing/manage-plans")}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{downgrading ? "Pick a smaller plan" : "Choose your plan"}</h1>
          <p className="text-muted-foreground mb-10">
            {downgrading
              ? "Keep what you love about Anarix on a lighter plan. You can upgrade again any time."
              : "Pick the plan that fits your team. You can change it again any time."}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {options.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-5">
                <p className="text-2xs uppercase tracking-wider text-muted-foreground mb-1">{p.sectionLabel}</p>
                <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{p.description}</p>
                <p className="text-2xl font-bold text-foreground mb-4">
                  {p.monthly !== null ? `$${p.monthly}` : "Custom"}
                  {p.monthly !== null && <span className="text-sm text-muted-foreground font-normal">/mo</span>}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button size="sm" variant="outline" className="w-full rounded-pill" onClick={() => handlePick(p)}>
                  {downgrading ? "Confirm Downgrade" : "Choose plan"}
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <CheckoutDialog
        plan={checkout}
        onClose={() => setCheckout(null)}
        onPaid={(plan) => {
          setCheckout(null);
          finish(`Payment received — you're on ${plan.name}`);
        }}
      />
    </AppLayout>
  );
}
