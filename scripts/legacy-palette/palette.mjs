/**
 * Recolors the pages ported from anarix-ui (frontend/src/legacy) onto this app's palette, "Periwinkle Refined"
 * (frontend/src/contexts/ColorSchemeContext.tsx). Only color changes: every literal keeps its lightness step and
 * alpha, so contrast and hierarchy stay as designed; hue and saturation move onto this app's families.
 *
 *   node scripts/legacy-palette/palette.mjs map     writes map.json + map.html (old → new swatches) next to this file
 *   node scripts/legacy-palette/palette.mjs apply   rewrites the literals in frontend/src/legacy using map.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const LEGACY = path.resolve(here, '../../frontend/src/legacy');

/** Third-party brand marks (marketplace and integration logos) keep their own colors. */
const PROTECTED = new Set([
  '#ff9900', '#0071ce', '#ffc220', // Amazon, Walmart
  '#4285f4', '#ea4335', '#fbbc05', '#34a853', '#00832d', '#00ac47', '#ffba00', // Google, Gmail, Meet
  '#36c5f0', '#2eb67d', '#ecb22e', '#e01e5a', // Slack
  '#ffffff', '#000000',
]);

/**
 * Each family: the anarix-ui color it was built around (anchor) and this app's token it becomes (target), as HSL.
 * Hue moves to the target (keeping a little of each color's offset from the anchor, so gradients and related shades
 * stay distinct); saturation scales by target/anchor with a soft ceiling; lightness maps the anchor's onto the
 * target's and keeps every other step in proportion.
 */
const FAMILIES = {
  brand: { anchor: [275, 38, 44], target: [234, 68, 55], hueKeep: 0.4, hueClamp: [222, 250] }, // #77469b → --primary
  blue: { anchor: [220, 84, 56], target: [229, 84, 56], hueKeep: 0.5 }, // accent blues → periwinkle family
  green: { anchor: [162, 33, 37], target: [142, 55, 38], hueKeep: 0.5 }, // #3f7d6a → --success
  red: { anchor: [3, 48, 47], target: [0, 65, 48], hueKeep: 0.5 }, // #b3453f → --destructive
  amber: { anchor: [31, 45, 45], target: [38, 75, 45], hueKeep: 0.5 }, // #a8763f → --warning
};

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const rgbToHex = (rgb) => '#' + rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');

function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return [h, s * 100, l * 100];
}

function hslToRgb([h, s, l]) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => {
    t = ((t % 1) + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h / 360 + 1 / 3), f(h / 360), f(h / 360 - 1 / 3)].map((v) => v * 255);
}

const hueDelta = (a, b) => ((a - b + 540) % 360) - 180;

function family([h, s, l]) {
  const purple = h >= 250 && h < 320;
  const blue = h >= 200 && h < 250;
  if (purple && s >= 18 && l > 3) return 'brand';
  if (s < 18 || l > 96 || l < 6 || (blue && s < 24)) return 'neutral';
  if (blue) return 'blue';
  if (h >= 70 && h < 200) return 'green';
  if (h >= 15 && h < 70) return 'amber';
  if (h >= 320 || h < 15) return 'red';
  return 'brand';
}

/** This app's neutral ramp: cool gray, hue 220 (240 for the darkest text), saturation 9–14%. */
function mapNeutral([, s, l]) {
  const h = l < 25 ? 240 : 220;
  const cap = l >= 85 ? 14 : l >= 25 ? 10 : 12;
  return [h, Math.min(s, cap), l];
}

function mapFamily(name, [h, s, l]) {
  const { anchor, target, hueKeep, hueClamp } = FAMILIES[name];
  let nh = target[0] + hueDelta(h, anchor[0]) * hueKeep;
  if (hueClamp) nh = Math.min(hueClamp[1], Math.max(hueClamp[0], nh));
  const k = target[1] / anchor[1];
  const ns = Math.min(s * k, s + (100 - s) * 0.6, 100);
  const [al, tl] = [anchor[2], target[2]];
  const nl = l <= al ? (l * tl) / al : tl + ((l - al) * (100 - tl)) / (100 - al);
  return [nh, ns, nl];
}

export function mapColor(hex) {
  hex = hex.toLowerCase();
  if (PROTECTED.has(hex)) return { hex, family: 'kept' };
  const hsl = rgbToHsl(hexToRgb(hex));
  const fam = family(hsl);
  const next = fam === 'neutral' ? mapNeutral(hsl) : mapFamily(fam, hsl);
  return { hex: rgbToHex(hslToRgb(next)), family: fam };
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const sourceFiles = () => walk(LEGACY).filter((f) => /\.(tsx?|s?css)$/.test(f));

// A hex color that is not part of an identifier, an entity (&#...) or a url(#id) reference.
const HEX = /(?<![\w&])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![\w-])/g;
const RGB = /(rgba?)\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*((?:,\s*[\d.]+%?\s*)?)\)/g;
const isUrlRef = (text, index) => /url\(\s*['"]?$/.test(text.slice(Math.max(0, index - 8), index));
const expand = (h) => (h.length <= 4 ? h.split('').map((c) => c + c).join('') : h);

function collect() {
  const uses = new Map();
  for (const f of sourceFiles()) {
    const t = fs.readFileSync(f, 'utf8');
    for (const m of t.matchAll(HEX)) {
      if (isUrlRef(t, m.index)) continue;
      const k = '#' + expand(m[1].toLowerCase()).slice(0, 6);
      uses.set(k, (uses.get(k) ?? 0) + 1);
    }
    for (const m of t.matchAll(RGB)) {
      const k = rgbToHex([m[2], m[3], m[4]].map(Number));
      uses.set(k, (uses.get(k) ?? 0) + 1);
    }
  }
  return uses;
}

function writeMap() {
  const uses = collect();
  const map = {};
  for (const [hex, n] of [...uses].sort((a, b) => b[1] - a[1])) map[hex] = { ...mapColor(hex), uses: n };
  fs.writeFileSync(path.join(here, 'map.json'), JSON.stringify(map, null, 1) + '\n');

  const groups = {};
  for (const [from, v] of Object.entries(map)) (groups[v.family] ??= []).push([from, v]);
  const order = ['brand', 'neutral', 'blue', 'green', 'red', 'amber', 'kept'];
  const sw = (c) => `<span class="sw" style="background:${c}"></span>`;
  const html = `<!doctype html><meta charset="utf-8"><title>Legacy palette map</title>
<style>body{font:13px/1.4 Inter,system-ui,sans-serif;margin:24px;color:#1a1a22;background:#fafafa}h2{margin:28px 0 8px;font-size:15px;text-transform:capitalize}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:6px}.row{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e6e6ea;border-radius:8px;padding:6px 8px}
.sw{width:30px;height:30px;border-radius:6px;border:1px solid rgba(0,0,0,.08);flex:none}code{font:11px ui-monospace,monospace}.n{margin-left:auto;color:#888;font-size:11px}</style>
<h1 style="font-size:18px">anarix-ui → Periwinkle Refined: ${Object.keys(map).length} colors</h1>
${order.filter((g) => groups[g]).map((g) => `<h2>${g} (${groups[g].length})</h2><div class="grid">${groups[g].map(([from, v]) => `<div class="row">${sw(from)}→${sw(v.hex)}<code>${from}<br>${v.hex}</code><span class="n">×${v.uses}</span></div>`).join('')}</div>`).join('\n')}`;
  fs.writeFileSync(path.join(here, 'map.html'), html);
  console.log(`map.json + map.html: ${Object.keys(map).length} colors`);
}

function apply() {
  const map = JSON.parse(fs.readFileSync(path.join(here, 'map.json'), 'utf8'));
  const to = (hex) => map[hex]?.hex ?? mapColor(hex).hex;
  let files = 0, edits = 0;
  for (const f of sourceFiles()) {
    const t = fs.readFileSync(f, 'utf8');
    let n = 0;
    const out = t
      .replace(HEX, (m, h, offset, whole) => {
        if (isUrlRef(whole, offset)) return m;
        const full = expand(h);
        const next = to('#' + full.slice(0, 6).toLowerCase());
        const alpha = full.length === 8 ? full.slice(6) : '';
        const res = (h === h.toUpperCase() && /[A-F]/.test(h) ? next.toUpperCase() : next) + alpha;
        if (res.toLowerCase() !== m.toLowerCase()) n++;
        return res;
      })
      .replace(RGB, (m, fn, r, g, b, alpha) => {
        const [nr, ng, nb] = hexToRgb(to(rgbToHex([r, g, b].map(Number))));
        const res = `${fn}(${nr}, ${ng}, ${nb}${alpha.replace(/^\s*,\s*/, ', ')})`;
        if (nr !== +r || ng !== +g || nb !== +b) n++;
        return res;
      });
    if (n) { fs.writeFileSync(f, out); files++; edits += n; }
  }
  console.log(`recolored ${edits} literals in ${files} files`);
}

const cmd = process.argv[2];
if (cmd === 'map') writeMap();
else if (cmd === 'apply') apply();
else console.log('usage: node scripts/legacy-palette/palette.mjs map|apply');
