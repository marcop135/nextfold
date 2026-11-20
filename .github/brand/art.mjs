// Next Fold brand art: writes og.svg (the mark on a tile, the name, one line under it) and
// readme-{light,dark}.svg (the name beside the Studio's page list, its corner folded back).
// Run from the repository root: node .github/brand/art.mjs, then node scripts/round-readme-images.mjs.
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../../", import.meta.url);
const font = (family, file) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:100 900;src:url(data:font/woff2;base64,${readFileSync(
    new URL(`.github/brand/fonts/${file}`, root),
  ).toString("base64")}) format('woff2');}`;
const FONTS = font("Geist", "geist-latin-wght-normal.woff2");
const FONTS_MONO = FONTS + font("Geist Mono", "geist-mono-latin-wght-normal.woff2");

/** Site tokens from src/app/globals.css, plus Sanity red. */
const PALETTE = {
  light: { from: "#FFFFFF", to: "#ECEDF0", text: "#101112", muted: "#4F5562", accent: "#F03E2F", tile: "#101112", ink: "#FFFFFF", fold: "#8A8F9A" },
  dark: { from: "#17181A", to: "#0B0C0D", text: "#E8E9EC", muted: "#A3A9B3", accent: "#F03E2F", tile: "#E8E9EC", ink: "#101112", fold: "#7B818C" },
};

const TAGLINE = "Next.js + Sanity CMS, run end to end";

function art(p, { width, height, label }) {
  const cx = width / 2;
  const tile = 140;
  const top = height / 2 - 175;
  // The site mark (src/app/icon.svg, a 32-unit folded page) scaled into the tile.
  const scale = 3;
  const mx = cx - 16 * scale;
  const my = top + tile / 2 - 16 * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
  <title>Next Fold</title>
  <style>${FONTS}</style>
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.from}"/>
      <stop offset="1" stop-color="${p.to}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#ground)"/>
  <rect x="${cx - tile / 2}" y="${top}" width="${tile}" height="${tile}" rx="32" fill="${p.tile}"/>
  <g transform="translate(${mx} ${my}) scale(${scale})">
    <path fill="${p.ink}" d="M6.5 2H20l8 8v17.5a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 4 27.5v-23A2.5 2.5 0 0 1 6.5 2z"/>
    <path fill="${p.fold}" d="M20 2v5.5a2.5 2.5 0 0 0 2.5 2.5H28z"/>
    <rect x="8" y="17" width="16" height="5" fill="${p.accent}"/>
  </g>
  <text x="${cx}" y="${top + tile + 118}" text-anchor="middle" font-family="Geist" font-weight="800" font-size="104" letter-spacing="-4" fill="${p.text}">Next <tspan fill="${p.accent}">Fold</tspan></text>
  <text x="${cx}" y="${top + tile + 186}" text-anchor="middle" font-family="Geist" font-weight="500" font-size="38" fill="${p.muted}">${TAGLINE}</text>
</svg>
`;
}

/** README header palette: site tokens plus a grid line and a drop shadow. */
const README = {
  light: { bg: "#F3F3F5", surface: "#FFFFFF", text: "#101112", muted: "#4F5562", border: "#DFE0E4", accent: "#F03E2F", grid: "#E6E7EA", soft: "#F0F1F3", band: "#101112", onBand: "#FFFFFF", shadow: "rgba(16,17,18,0.14)" },
  dark: { bg: "#101112", surface: "#17181A", text: "#E8E9EC", muted: "#A3A9B3", border: "#2C2E33", accent: "#F03E2F", grid: "#1A1B1E", soft: "#1F2023", band: "#E8E9EC", onBand: "#101112", shadow: "rgba(0,0,0,0.55)" },
};

/** The 0.7.0 demo pages, each with what it shows. */
const PAGES = [
  { name: "Inside a page", shows: "Sections and their fields" },
  { name: "Guardrails", shows: "Rules checked before publish" },
  { name: "Caching", shows: "Expired on publish" },
  { name: "How it's run", shows: "Hosting, headers, CI, releases" },
];

function readmeArt(p, { width, height, label }) {
  const x0 = 96;
  const px = 724;
  const py = 70;
  const pw = 460;
  const ph = 500;
  const fold = 84;
  const outline = `M${px} ${py + 14}a14 14 0 0 1 14-14H${px + pw - 14}a14 14 0 0 1 14 14V${py + ph - fold}L${px + pw - fold} ${py + ph}H${px + 14}a14 14 0 0 1-14-14z`;
  const gx = px + 36;
  const gy = py + 32;
  const rowY = (i) => py + 86 + i * 82;
  const rows = PAGES.map(
    (page, i) => `<rect x="${px + 24}" y="${rowY(i)}" width="${pw - 48}" height="70" rx="10" fill="${p.surface}" stroke="${p.border}"/>
    <rect x="${px + 24}" y="${rowY(i)}" width="5" height="70" rx="2.5" fill="${p.accent}"/>
    <text x="${px + 48}" y="${rowY(i) + 31}" font-family="Geist" font-weight="700" font-size="24" fill="${p.text}">${page.name.replace("'", "&#8217;")}</text>
    <text x="${px + 48}" y="${rowY(i) + 56}" font-family="Geist Mono" font-size="16" fill="${p.muted}">${page.shows}</text>`,
  ).join("\n    ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
  <title>Next Fold</title>
  <style>${FONTS_MONO}</style>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${p.grid}" stroke-width="1"/></pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="${p.shadow}"/></filter>
    <filter id="lift" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-6" dy="-6" stdDeviation="8" flood-color="${p.shadow}"/></filter>
  </defs>
  <rect width="${width}" height="${height}" fill="${p.bg}"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <rect x="${gx}" y="${gy}" width="${pw}" height="${ph}" rx="14" fill="${p.surface}" stroke="${p.border}" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="${gx + pw - 176}" y="${gy + ph - 52}" width="148" height="28" rx="6" fill="${p.band}"/>
  <path d="${outline}" fill="${p.surface}" stroke="${p.border}" stroke-width="1.5" filter="url(#shadow)"/>
  <text x="${px + 24}" y="${py + 38}" font-family="Geist Mono" font-weight="500" font-size="15" letter-spacing="1.5" fill="${p.muted}">SANITY STUDIO</text>
  <text x="${px + 24}" y="${py + 66}" font-family="Geist" font-weight="700" font-size="24" fill="${p.text}">Pages</text>
  <rect x="${px + pw - 124}" y="${py + 28}" width="100" height="34" rx="17" fill="${p.soft}" stroke="${p.border}"/>
  <rect x="${px + pw - 122}" y="${py + 30}" width="50" height="30" rx="15" fill="${p.band}"/>
  <text x="${px + pw - 97}" y="${py + 50.5}" text-anchor="middle" font-family="Geist Mono" font-weight="600" font-size="14" fill="${p.onBand}">EN</text>
  <text x="${px + pw - 48}" y="${py + 50.5}" text-anchor="middle" font-family="Geist Mono" font-weight="600" font-size="14" fill="${p.muted}">DE</text>
  ${rows}
  <path d="M${px + pw} ${py + ph - fold}L${px + pw - fold} ${py + ph}L${px + pw - fold} ${py + ph - fold}z" fill="${p.accent}" filter="url(#lift)"/>
  <rect x="${x0}" y="${196}" width="16" height="16" fill="${p.accent}"/>
  <text x="${x0 + 30}" y="${211}" font-family="Geist Mono" font-weight="500" font-size="22" letter-spacing="2" fill="${p.muted}">NEXT.JS + SANITY</text>
  <text x="${x0 - 5}" y="${330}" font-family="Geist" font-weight="800" font-size="116" letter-spacing="-5.5" fill="${p.text}">Next <tspan fill="${p.accent}">Fold</tspan></text>
  <text x="${x0}" y="${402}" font-family="Geist" font-weight="500" font-size="32" fill="${p.text}" data-fit-w="600">A CMS site is more than the CMS.</text>
  <text x="${x0}" y="${450}" font-family="Geist" font-weight="400" font-size="28" fill="${p.muted}" data-fit-w="600">Run end to end, in public.</text>
</svg>
`;
}

writeFileSync(new URL(".github/brand/og.svg", root), art(PALETTE.light, { width: 1200, height: 630, label: `Next Fold: ${TAGLINE}` }));
const README_LABEL =
  "Next Fold, Next.js + Sanity: a CMS site is more than the CMS. A Studio page list with a folded corner: Inside a page, Guardrails, Caching, How it's run, in English and German";
const outputs = [
  ["readme-light.svg", README.light],
  ["readme-dark.svg", README.dark],
];
for (const [file, palette] of outputs) {
  writeFileSync(new URL(`.github/brand/${file}`, root), readmeArt(palette, { width: 1280, height: 640, label: README_LABEL }));
}
console.log(`Wrote og.svg, ${outputs.map(([file]) => file).join(", ")}`);
