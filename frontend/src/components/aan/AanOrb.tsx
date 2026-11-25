import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThinkingOrb } from "thinking-orbs";
import { cn } from "@/lib/utils";

/**
 * Aan's thinking and working states, drawn with Thinking Orbs (libraries.dev/orbs, MIT, © Jakub Antalik):
 *  - thinking → "searching": a scan meridian sweeps a dotted globe
 *  - working  → "solving":   dotted bands scramble in quarter turns, then click back solved (the Rubik's cube)
 * Tinted Aan coral. Idle, hover, listening and speaking stay the AanMascot diamond / ball.
 */
export type AanOrbMode = "thinking" | "working";

const AAN_CORAL = "#f46d76";
/** The library fades the tint toward black for depth on dark substrates, so dark mode needs a lighter coral to read. */
const AAN_CORAL_ON_DARK = "#ffa3aa";

/** Follows the app's `.dark` class live (the theme toggle flips it on <html>). */
function useIsDark() {
  const read = () => typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const [dark, setDark] = useState(read);
  useEffect(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

/** The library is hand-tuned at 20, 32 and 64px; pick the nearest and scale the canvas to the slot. */
function presetFor(size: number): 20 | 32 | 64 {
  if (size <= 26) return 20;
  if (size <= 40) return 32;
  return 64;
}

interface AanOrbProps {
  mode: AanOrbMode;
  size?: number;
  /** Soft coral glow behind the orb (the mascot's aura), for the larger sizes. */
  aura?: boolean;
  className?: string;
}

export function AanOrb({ mode, size = 64, aura = size >= 24, className }: AanOrbProps) {
  const dark = useIsDark();
  return (
    <motion.span
      key={mode}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {aura && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: "rgba(244, 109, 118, 0.22)", filter: `blur(${Math.round(size * 0.22)}px)` }}
        />
      )}
      <ThinkingOrb
        state={mode === "thinking" ? "searching" : "solving"}
        size={presetFor(size)}
        color={dark ? AAN_CORAL_ON_DARK : AAN_CORAL}
        theme="auto"
        aria-label={mode === "thinking" ? "Aan is thinking" : "Aan is working"}
        style={{ position: "relative", width: size, height: size }}
      />
    </motion.span>
  );
}

export default AanOrb;
