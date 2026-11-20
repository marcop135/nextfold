// Next Fold brand art: writes og.svg and readme-{light,dark}.svg from one layout.
// The Studio's document pane, its corner folded back to show the page it renders.
// Run from the repository root: node .github/brand/art.mjs, then render the PNG and JPG (see .github/brand/README in the plan).
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../../", import.meta.url);
const font = (family, file) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:100 900;src:url(data:font/woff2;base64,${readFileSync(
    new URL(`.github/brand/fonts/${file}`, root),
  ).toString("base64")}) format('woff2');}`;
const FONTS = font("Geist", "geist-latin-wght-normal.woff2") + font("Geist Mono", "geist-mono-latin-wght-normal.woff2");

/** Site tokens from src/app/globals.css, plus Sanity red. */
const PALETTE = {
  light: {
    bg: "#F3F3F5", surface: "#FFFFFF", text: "#101112", muted: "#4F5562", border: "#DFE0E4", accent: "#F03E2F",
    accentText: "#C42A1C", grid: "#E4E5E9", bar: "#C9CBD1", soft: "#F0F1F3", band: "#101112", onBand: "#FFFFFF",
    tint: "#FDE7E4", ok: "#1A7F37", shadow: "rgba(16,17,18,0.16)",
  },
  dark: {
    bg: "#101112", surface: "#17181A", text: "#E8E9EC", muted: "#A3A9B3", border: "#2C2E33", accent: "#F03E2F",
    accentText: "#FF8478", grid: "#1B1C1F", bar: "#3A3D44", soft: "#1F2023", band: "#E8E9EC", onBand: "#101112",
    tint: "#3A1A17", ok: "#3FB950", shadow: "rgba(0,0,0,0.55)",
  },
};

const ROWS = [
  { type: "Hero", heading: "The CMS is the easy part" },
  { type: "Feature grid", heading: "Pick your way in" },
  { type: "App block", heading: "Try to break a rule" },
  { type: "Call to action", heading: "The code is public" },
];

function art(p, { width, height, label }) {
  const og = width === 1200;
  const x0 = og ? 80 : 96;
  // Right-hand composition, anchored to the canvas edge.
  const px = width - (og ? 520 : 556);
  const py = og ? 74 : 76;
  const pw = 420;
  const ph = 456;
  const fold = 108; // size of the folded corner

  const grid = `<defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="${p.grid}" stroke-width="1"/></pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="${p.shadow}"/></filter>
    <filter id="lift" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-6" dy="-6" stdDeviation="8" flood-color="${p.shadow}"/></filter>
    <clipPath id="pane"><path d="M${px} ${py + 14}a14 14 0 0 1 14-14H${px + pw - 14}a14 14 0 0 1 14 14V${py + ph - fold}L${px + pw - fold} ${py + ph}H${px + 14}a14 14 0 0 1-14-14z"/></clipPath>
  </defs>
  <rect width="${width}" height="${height}" fill="${p.bg}"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>`;

  // The rendered page, behind the pane and offset down-right, so the folded corner uncovers it.
  const gx = px + 52;
  const gy = py + 40;
  const page = `<g filter="url(#shadow)">
    <rect x="${gx}" y="${gy}" width="${pw}" height="${ph}" rx="14" fill="${p.surface}" stroke="${p.border}" stroke-width="1.5"/>
  </g>
  <g>
    <rect x="${gx + 24}" y="${gy + 20}" width="190" height="22" rx="11" fill="${p.soft}" stroke="${p.border}"/>
    <text x="${gx + 38}" y="${gy + 35.5}" font-family="Geist Mono" font-size="11" fill="${p.muted}">nextfold.marcopontili.com</text>
    ${[0, 1, 2].map((i) => `<rect x="${gx + pw - 196 + i * 58}" y="${gy + ph - 102}" width="50" height="34" rx="5" fill="${p.soft}" stroke="${p.border}"/>`).join("")}
    <rect x="${gx + pw - 196}" y="${gy + ph - 56}" width="168" height="30" rx="6" fill="${p.band}"/>
    <rect x="${gx + pw - 184}" y="${gy + ph - 45}" width="70" height="8" rx="3" fill="${p.onBand}" opacity="0.7"/>
  </g>`;

  // The Studio pane, its bottom-right corner cut where the fold lifts.
  const rowY = (i) => py + 104 + i * 62;
  const rows = ROWS.map(
    (row, i) => `<g>
      <rect x="${px + 20}" y="${rowY(i)}" width="${pw - 40}" height="52" rx="8" fill="${p.surface}" stroke="${p.border}"/>
      <rect x="${px + 20}" y="${rowY(i)}" width="4" height="52" rx="2" fill="${p.accent}"/>
      ${[0, 1, 2].map((d) => `<circle cx="${px + 40}" cy="${rowY(i) + 18 + d * 8}" r="1.6" fill="${p.bar}"/><circle cx="${px + 47}" cy="${rowY(i) + 18 + d * 8}" r="1.6" fill="${p.bar}"/>`).join("")}
      <text x="${px + 62}" y="${rowY(i) + 21}" font-family="Geist Mono" font-size="12" fill="${p.muted}">${row.type}</text>
      <text x="${px + 62}" y="${rowY(i) + 40}" font-family="Geist" font-weight="600" font-size="16" fill="${p.text}">${row.heading}</text>
    </g>`,
  ).join("");
  const pane = `<g filter="url(#shadow)">
    <path d="M${px} ${py + 14}a14 14 0 0 1 14-14H${px + pw - 14}a14 14 0 0 1 14 14V${py + ph - fold}L${px + pw - fold} ${py + ph}H${px + 14}a14 14 0 0 1-14-14z" fill="${p.surface}" stroke="${p.border}" stroke-width="1.5"/>
  </g>
  <g clip-path="url(#pane)">
    <rect x="${px}" y="${py}" width="${pw}" height="54" fill="${p.soft}"/>
    <line x1="${px}" y1="${py + 54}" x2="${px + pw}" y2="${py + 54}" stroke="${p.border}"/>
    <text x="${px + 20}" y="${py + 25}" font-family="Geist Mono" font-size="11" letter-spacing="1.2" fill="${p.muted}">SANITY STUDIO</text>
    <text x="${px + 20}" y="${py + 43}" font-family="Geist" font-weight="700" font-size="15" fill="${p.text}">Home page</text>
    <circle cx="${px + pw - 104}" cy="${py + 28}" r="4.5" fill="${p.ok}"/>
    <text x="${px + pw - 94}" y="${py + 32.5}" font-family="Geist" font-weight="600" font-size="13" fill="${p.text}">Published</text>
    <text x="${px + 20}" y="${py + 84}" font-family="Geist Mono" font-size="11" letter-spacing="1.2" fill="${p.muted}">SECTIONS</text>
    ${rows}
  </g>
  <g filter="url(#lift)">
    <path d="M${px + pw} ${py + ph - fold}L${px + pw - fold} ${py + ph}L${px + pw - fold} ${py + ph - fold}z" fill="${p.accent}"/>
  </g>
  <path d="M${px + pw} ${py + ph - fold}L${px + pw - fold} ${py + ph}" stroke="${p.accent}" stroke-width="2"/>`;

  const tag = og ? 36 : 32;
  const text = `
    <rect x="${x0}" y="${og ? 186 : 186}" width="14" height="14" fill="${p.accent}"/>
    <text x="${x0 + 26}" y="${og ? 199 : 199}" font-family="Geist Mono" font-weight="500" font-size="20" letter-spacing="2" fill="${p.muted}">NEXT.JS + SANITY</text>
    <text x="${x0 - 5}" y="${og ? 318 : 312}" font-family="Geist" font-weight="800" font-size="${og ? 120 : 112}" letter-spacing="-5.5" fill="${p.text}">Next <tspan fill="${p.accent}">Fold</tspan></text>
    <text x="${x0}" y="${og ? 392 : 384}" font-family="Geist" font-weight="500" font-size="${tag}" fill="${p.text}">The CMS is the easy part.</text>
    <text x="${x0}" y="${og ? 438 : 426}" font-family="Geist" font-weight="400" font-size="${tag - 6}" fill="${p.muted}">Schema, Studio, cache, security, releases:</text>
    <text x="${x0}" y="${og ? 474 : 460}" font-family="Geist" font-weight="400" font-size="${tag - 6}" fill="${p.muted}">the whole system, in public.</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
  <title>Next Fold</title>
  <style>${FONTS}</style>
  ${grid}
  ${page}
  ${pane}
  ${text}
</svg>
`;
}

const LABEL = "Next Fold: the Sanity Studio pane for the home page, its corner folded back to show the page it renders";
const outputs = [
  ["og.svg", PALETTE.light, { width: 1200, height: 630 }],
  ["readme-light.svg", PALETTE.light, { width: 1280, height: 640 }],
  ["readme-dark.svg", PALETTE.dark, { width: 1280, height: 640 }],
];
for (const [file, palette, size] of outputs) {
  writeFileSync(new URL(`.github/brand/${file}`, root), art(palette, { ...size, label: LABEL }));
}
console.log(`Wrote ${outputs.map(([file]) => file).join(", ")}`);
