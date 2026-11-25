/* eslint-disable */
/**
 * CSS Paint worklet: the mask for the light/dark switch.
 *
 * Used as `mask-image: paint(ink-reveal)` on ::view-transition-new(root). Opaque pixels show the NEW theme.
 * The new theme sweeps out from the toggle behind a torn, angular front: a faceted edge with sharp spikes, and a
 * fringe of thin angular shards riding the front. Shards ahead of it are flecks of the new theme; shards behind it
 * are slivers of the old theme left behind. Some are half-transparent, like smears. The fringe clears by the end.
 *
 * Inputs (registered custom properties):
 *   --ink-progress  0 → 1 (animated)
 *   --ink-x, --ink-y  origin in px (the click point)
 *   --ink-seed      per-switch seed: every switch tears differently, but nothing jitters mid-flight
 */

const TAU = Math.PI * 2;

/** Small deterministic PRNG (mulberry32). */
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function num(props, name, fallback) {
  const v = props.get(name);
  if (!v) return fallback;
  const n = parseFloat(v.toString());
  return Number.isFinite(n) ? n : fallback;
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** A thin, tapered sliver with sharp tips and an off-centre kink (unit shape, scaled by len × wid). */
function shardPath(ctx, cx, cy, angle, len, wid, k1, k2, k3) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const pts = [
    [-0.5, 0],
    [-0.18, -0.5 - k1 * 0.4],
    [0.12 + k2 * 0.2, -0.32],
    [0.5, k3 * 0.3],
    [0.22, 0.42 + k2 * 0.3],
    [-0.24 + k1 * 0.2, 0.3],
  ];
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    const lx = pts[i][0] * len;
    const ly = pts[i][1] * wid;
    const x = cx + lx * c - ly * s;
    const y = cy + lx * s + ly * c;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

class InkReveal {
  static get inputProperties() {
    return ["--ink-progress", "--ink-x", "--ink-y", "--ink-seed"];
  }

  paint(ctx, size, props) {
    const p = Math.min(1, Math.max(0, num(props, "--ink-progress", 0)));
    const { width: w, height: h } = size;
    if (p <= 0) return;
    ctx.fillStyle = "#000";
    if (p >= 0.995) {
      ctx.fillRect(0, 0, w, h);
      return;
    }

    const ox = num(props, "--ink-x", w);
    const oy = num(props, "--ink-y", 0);
    const rand = rng(Math.floor(num(props, "--ink-seed", 7)));
    const D = Math.hypot(w, h);
    const far = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy));

    // The torn edge dips to ~0.7 R, so R reaches ~1.45× the farthest corner to clear it by the end.
    const R = far * 1.45 * Math.pow(p, 1.5); // area grows with R², so a steeper curve keeps the front mid-screen at mid-time

    // ---------------------------------------------------------------- the front: a torn, faceted coastline
    // Irregularly spaced vertices joined by straight segments (no smoothing) give angular facets; low-frequency
    // lobes make it a coastline rather than a circle; rare tongues and bites tear it.
    const lobes = [2, 3, 4, 6, 9, 13].map((k, i) => ({ k, amp: 0.16 / Math.pow(1.6, i), phase: rand() * TAU, drift: (rand() - 0.5) * 2.4 }));
    const angles = [];
    const facets = [];
    for (let t = 0; t < TAU; ) {
      angles.push(t);
      const u = rand();
      const v = rand();
      // facet depth: mostly shallow, sometimes a tongue (out) or a bite (in)
      facets.push(u > 0.95 ? 0.1 + v * 0.22 : u < 0.06 ? -(0.06 + v * 0.12) : (v - 0.5) * 0.07);
      t += (0.4 + rand() * 2.6) * (Math.PI / 180);
    }
    const N = angles.length;
    const edge = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      let n = 0;
      for (const l of lobes) n += l.amp * Math.sin(l.k * angles[i] + l.phase + l.drift * p);
      edge[i] = Math.max(0, R * (1 + n + facets[i]));
    }
    const edgeAt = (theta) => {
      const t = ((theta % TAU) + TAU) % TAU;
      let lo = 0;
      let hi = N - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (angles[mid] <= t) lo = mid;
        else hi = mid - 1;
      }
      const j = (lo + 1) % N;
      const span = (j === 0 ? TAU : angles[j]) - angles[lo];
      const f = span > 0 ? (t - angles[lo]) / span : 0;
      return edge[lo] * (1 - f) + edge[j] * f;
    };

    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const k = i % N;
      const x = ox + Math.cos(angles[k]) * edge[k];
      const y = oy + Math.sin(angles[k]) * edge[k];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // ---------------------------------------------------------------- the fringe: angular shards on the front
    // Every shard is brushed in one direction (diagonal to the sweep), so the fringe reads as one torn smear,
    // like the reference, not a radial burst.
    const sweep = Math.atan2(h / 2 - oy, w / 2 - ox); // toward the screen's middle
    const brush = sweep + Math.PI / 3 + (rand() - 0.5) * 0.25; // ~60° off the sweep, as in the reference
    const grow = smooth(0, 0.12, p); // shards appear just after the tear starts
    const clear = 1 - smooth(0.82, 0.985, p); // and are gone before the end
    const scale = grow * clear * Math.min(1, 0.35 + p * 1.4);
    const reach = Math.min(1, R / (0.25 * D)); // a small blot carries a tight fringe

    const SHARDS = 220;
    for (let i = 0; i < SHARDS; i++) {
      // every random number is drawn before any skip, so the sequence never shifts between frames
      const theta = rand() * TAU;
      const behind = rand() < 0.55; // old-theme sliver left inside the new region
      const offU = rand();
      const len = (0.02 + Math.pow(rand(), 1.4) * 0.12) * D;
      const wid = (0.0015 + Math.pow(rand(), 2) * 0.008) * D;
      const tilt = (rand() - 0.5) * 0.35;
      const ghost = rand() < 0.35; // half-transparent smear
      const k1 = rand() - 0.5;
      const k2 = rand() - 0.5;
      const k3 = rand() - 0.5;
      if (scale <= 0.01) continue;

      const off = (behind ? -(0.004 + Math.pow(offU, 1.5) * 0.11) : 0.003 + Math.pow(offU, 1.5) * 0.07) * D * reach; // dense at the front, thinning away from it
      const r = edgeAt(theta) + off;
      if (r <= 0) continue;
      const cx = ox + Math.cos(theta) * r;
      const cy = oy + Math.sin(theta) * r;
      if (cx < -0.1 * D || cx > w + 0.1 * D || cy < -0.1 * D || cy > h + 0.1 * D) continue;

      ctx.globalCompositeOperation = behind ? "destination-out" : "source-over";
      ctx.globalAlpha = ghost ? 0.45 : 1;
      shardPath(ctx, cx, cy, brush + tilt, len * scale, wid * Math.max(0.4, scale), k1, k2, k3);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }
}

registerPaint("ink-reveal", InkReveal);
