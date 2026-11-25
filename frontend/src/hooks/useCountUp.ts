import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from its previous value to `target` (ease-out, `duration` ms) so figures arrive instead of
 * snapping. Returns the target immediately when the user prefers reduced motion.
 */
export function useCountUp(target: number, duration = 600): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(0);
  const firstRef = useRef(true);

  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !Number.isFinite(target)) {
      setValue(target);
      return;
    }
    const from = firstRef.current ? 0 : fromRef.current;
    firstRef.current = false;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      fromRef.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
