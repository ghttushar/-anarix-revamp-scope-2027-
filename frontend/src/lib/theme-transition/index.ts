/**
 * The light/dark switch, run as an "ink" reveal: the new theme bleeds out from the toggle with a ragged, fragmented
 * edge (a CSS Paint worklet masks the view transition's new snapshot), over the untouched old one.
 *
 * Rules it follows (the user's reference video):
 *  1. Know the setting first: index.html applies the saved theme before the first paint.
 *  2. Fade in, don't flash: one eased reveal; every element's own colour transition is frozen for the swap, so
 *     nothing fades separately ("white, then dark").
 *  3. Match every screen: the whole document (dialogs, popovers, toasts) is one snapshot, and JS-driven colours
 *     are flushed before it is taken.
 *  4. Night stays night: the choice is persisted by ThemeContext.
 */

export interface ThemeOrigin {
  x: number;
  y: number;
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => ViewTransitionHandle;
};

interface ViewTransitionHandle {
  finished: Promise<void>;
  ready: Promise<void>;
  skipTransition: () => void;
}

let current: ViewTransitionHandle | null = null;

type PaintWorkletCSS = typeof CSS & {
  paintWorklet?: { addModule: (url: string) => Promise<void> };
  registerProperty?: (def: { name: string; syntax: string; inherits: boolean; initialValue: string }) => void;
};

const DURATION_MS = 1400;

let inkReady: Promise<boolean> | null = null;

/** Register the ink properties and load the worklet, once. Resolves false where the Paint API isn't available. */
function prepareInk(): Promise<boolean> {
  if (inkReady) return inkReady;
  const css = CSS as PaintWorkletCSS;
  if (!css.paintWorklet || !css.registerProperty) return (inkReady = Promise.resolve(false));
  for (const [name, initialValue] of [
    ["--ink-progress", "0"],
    ["--ink-x", "0"],
    ["--ink-y", "0"],
    ["--ink-seed", "0"],
  ] as const) {
    try {
      css.registerProperty({ name, syntax: "<number>", inherits: true, initialValue });
    } catch {
      /* already registered (HMR) */
    }
  }
  inkReady = css.paintWorklet
    .addModule(new URL("./ink-reveal.worklet.js", import.meta.url).href)
    .then(() => true)
    .catch(() => false);
  return inkReady;
}

// Start loading early so the first switch doesn't wait on the worklet.
if (typeof window !== "undefined") void prepareInk();

/** The click point of a toggle; for a keyboard press (no pointer position), the centre of the control. */
export function originFromEvent(e?: { clientX?: number; clientY?: number; currentTarget?: EventTarget | null } | null): ThemeOrigin | undefined {
  if (!e) return undefined;
  if (e.clientX || e.clientY) return { x: e.clientX ?? 0, y: e.clientY ?? 0 };
  const el = e.currentTarget as Element | null;
  if (el && "getBoundingClientRect" in el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return undefined;
}

/** Freeze every element's own transitions while the new state is captured, then release them. */
function freezeTransitions(root: HTMLElement) {
  root.classList.add("theme-switching");
  // two frames: the new snapshot is captured after the update callback's frame
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
}

/**
 * Swap the theme inside `apply` (synchronously: class on <html> + flushed React state) and animate the switch.
 */
export async function runThemeTransition(apply: () => void, origin?: ThemeOrigin): Promise<void> {
  const root = document.documentElement;
  const doc = document as ViewTransitionDoc;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!doc.startViewTransition) {
    freezeTransitions(root);
    apply();
    return;
  }

  const ink = reduce ? false : await prepareInk();
  const o = origin ?? { x: window.innerWidth - 24, y: 24 };
  const mode = reduce ? "fade" : ink ? "ink" : "circle";

  root.style.setProperty("--ink-x", String(Math.round(o.x)));
  root.style.setProperty("--ink-y", String(Math.round(o.y)));
  root.style.setProperty("--ink-seed", String(Math.floor(Math.random() * 1e6)));
  root.style.setProperty("--ink-r", `${Math.ceil(Math.hypot(Math.max(o.x, window.innerWidth - o.x), Math.max(o.y, window.innerHeight - o.y)))}px`);
  root.setAttribute("data-theme-ink", mode);

  // A second switch while one is running: jump the first to its end, then run the new one.
  current?.skipTransition();

  const t = doc.startViewTransition(() => {
    freezeTransitions(root);
    apply();
  });
  current = t;
  // Never leave the page in "switching" state, even if the transition is interrupted.
  const safety = window.setTimeout(() => t.skipTransition(), DURATION_MS + 800);
  try {
    await t.finished;
  } catch {
    /* skipped or aborted: the theme is applied either way */
  } finally {
    window.clearTimeout(safety);
    if (current === t) {
      current = null;
      root.removeAttribute("data-theme-ink");
    }
  }
}

export const THEME_TRANSITION_MS = DURATION_MS;
