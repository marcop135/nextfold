// Next Fold brand art: writes og.svg and readme-{light,dark}.svg from one centered layout,
// in the style of the sibling projects: the mark on a tile, the name, one line under it.
// Run from the repository root: node .github/brand/art.mjs, then node scripts/round-readme-images.mjs.
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../../", import.meta.url);
const font = (family, file) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:100 900;src:url(data:font/woff2;base64,${readFileSync(
    new URL(`.github/brand/fonts/${file}`, root),
  ).toString("base64")}) format('woff2');}`;
const FONTS = font("Geist", "geist-latin-wght-normal.woff2");

/** Site tokens from src/app/globals.css, plus Sanity red. */
const PALETTE = {
  light: { from: "#FFFFFF", to: "#ECEDF0", text: "#101112", muted: "#4F5562", accent: "#F03E2F", tile: "#101112", ink: "#FFFFFF", fold: "#8A8F9A" },
  dark: { from: "#17181A", to: "#0B0C0D", text: "#E8E9EC", muted: "#A3A9B3", accent: "#F03E2F", tile: "#E8E9EC", ink: "#101112", fold: "#7B818C" },
};

const TAGLINE = "Next.js + Sanity, run end to end";

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

const LABEL = `Next Fold: ${TAGLINE}`;
const outputs = [
  ["og.svg", PALETTE.light, { width: 1200, height: 630 }],
  ["readme-light.svg", PALETTE.light, { width: 1280, height: 640 }],
  ["readme-dark.svg", PALETTE.dark, { width: 1280, height: 640 }],
];
for (const [file, palette, size] of outputs) {
  writeFileSync(new URL(`.github/brand/${file}`, root), art(palette, { ...size, label: LABEL }));
}
console.log(`Wrote ${outputs.map(([file]) => file).join(", ")}`);
