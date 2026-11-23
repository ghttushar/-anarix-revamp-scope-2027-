import { useEffect, useState } from 'react';

/**
 * anarix-ui sets the root font size to 11px, stepping down on narrower screens. The ported pages are sized in rem
 * against that root, so `legacy/scope.css` defines the same steps as `--np-rem`. This mirrors those steps in JS for
 * the places that need the number (the MUI theme).
 */
const STEPS: Array<{ maxWidth: number; px: number }> = [
  { maxWidth: 1250, px: 7 },
  { maxWidth: 1350, px: 9 },
  { maxWidth: 1450, px: 10 },
];

export function currentNpRem(width = window.innerWidth): number {
  for (const step of STEPS) if (width <= step.maxWidth) return step.px;
  return 11;
}

export function useNpRem(): number {
  const [rem, setRem] = useState(() => currentNpRem());
  useEffect(() => {
    const onResize = () => setRem(currentNpRem());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return rem;
}
