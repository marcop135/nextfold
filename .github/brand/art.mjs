// Next Fold brand art: writes og.svg (the proportionally fitted light README header) and
// readme-{light,dark}.svg (the name beside a page list, its corner folded back; sized to read at phone width).
// Run from the repository root: node .github/brand/art.mjs --render-og, then node scripts/round-readme-images.mjs.
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../../", import.meta.url);
const font = (family, file) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:100 900;src:url(data:font/woff2;base64,${readFileSync(
    new URL(`.github/brand/fonts/${file}`, root),
  ).toString("base64")}) format('woff2');}`;
const FONTS = font("Geist", "geist-latin-wght-normal.woff2");
const FONTS_MONO = FONTS + font("Geist Mono", "geist-mono-latin-wght-normal.woff2");

/** README header palette: site tokens plus a grid line and a drop shadow. */
const README = {
  light: { bg: "#F3F3F5", surface: "#FFFFFF", text: "#101112", muted: "#4F5562", border: "#DFE0E4", accent: "#F03E2F", grid: "#E6E7EA", soft: "#F0F1F3", band: "#101112", onBand: "#FFFFFF", shadow: "rgba(16,17,18,0.14)" },
  dark: { bg: "#101112", surface: "#17181A", text: "#E8E9EC", muted: "#A3A9B3", border: "#2C2E33", accent: "#F03E2F", grid: "#1A1B1E", soft: "#1F2023", band: "#E8E9EC", onBand: "#101112", shadow: "rgba(0,0,0,0.55)" },
};

/** The demo pages listed in the README header. */
const PAGES = [
  { name: "Inside a page" },
  { name: "Guardrails" },
  { name: "Caching" },
  { name: "How it's run" },
];

function readmeArt(p, { width, height, label }) {
  const scale = Math.min(width / 1280, height / 640);
  const fitted = width !== 1280 || height !== 640;
  const frame = fitted ? `<g transform="translate(${(width - 1280 * scale) / 2} ${(height - 640 * scale) / 2}) scale(${scale})">` : "";
  // Equal space left of the wordmark, between it and the page list, and right of the list: 76 px each.
  const x0 = 82;
  const px = 729;
  const py = 56;
  const pw = 440;
  const ph = 520;
  const fold = 72;
  const outline = `M${px} ${py + 14}a14 14 0 0 1 14-14H${px + pw - 14}a14 14 0 0 1 14 14V${py + ph - fold}L${px + pw - fold} ${py + ph}H${px + 14}a14 14 0 0 1-14-14z`;
  const gx = px + 36;
  const gy = py + 32;
  // Rows carry the page name only, large enough to read when the image shrinks to a phone's width.
  const rowY = (i) => py + 88 + i * 88;
  const rows = PAGES.map(
    (page, i) => `<rect x="${px + 24}" y="${rowY(i)}" width="${pw - 48}" height="72" rx="12" fill="${p.surface}" stroke="${p.border}"/>
    <rect x="${px + 24}" y="${rowY(i)}" width="6" height="72" rx="3" fill="${p.accent}"/>
    <text x="${px + 52}" y="${rowY(i) + 46}" font-family="Geist" font-weight="400" font-size="28" fill="${p.text}">${page.name.replaceAll("'", "&#8217;")}</text>`,
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
${frame}  <rect x="${gx}" y="${gy}" width="${pw}" height="${ph}" rx="14" fill="${p.surface}" stroke="${p.border}" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="${gx + pw - 176}" y="${gy + ph - 52}" width="148" height="28" rx="6" fill="${p.band}"/>
  <path d="${outline}" fill="${p.surface}" stroke="${p.border}" stroke-width="1.5" filter="url(#shadow)"/>
  <text x="${px + 26}" y="${py + 62}" font-family="Geist Mono" font-weight="500" font-size="22" letter-spacing="2" fill="${p.muted}">PAGES</text>
  ${rows}
  <path d="M${px + pw} ${py + ph - fold}L${px + pw - fold} ${py + ph}L${px + pw - fold} ${py + ph - fold}z" fill="${p.accent}" filter="url(#lift)"/>
  <rect x="${x0}" y="${213}" width="20" height="20" fill="${p.accent}"/>
  <text x="${x0 + 34}" y="${232}" font-family="Geist Mono" font-weight="500" font-size="22" letter-spacing="1.5" fill="${p.muted}">NEXT.JS + SANITY CMS DEMO</text>
  <text x="${x0 - 6}" y="${364}" font-family="Geist" font-weight="700" font-size="132" letter-spacing="-6" fill="${p.text}">Next <tspan fill="${p.accent}">Fold</tspan></text>
  <text x="${x0}" y="${440}" font-family="Geist" font-weight="400" font-size="33" fill="${p.text}" data-fit-w="600">A CMS site is more than the CMS.</text>
${fitted ? "</g>" : ""}</svg>
`;
}

const README_LABEL =
  "Next Fold, Next.js + Sanity CMS Demo: a CMS site is more than the CMS. A page list with a folded corner: Inside a page, Guardrails, Caching, How it's run";
writeFileSync(new URL(".github/brand/og.svg", root), readmeArt(README.light, { width: 1200, height: 630, label: README_LABEL }));
const outputs = [
  ["readme-light.svg", README.light],
  ["readme-dark.svg", README.dark],
];
for (const [file, palette] of outputs) {
  writeFileSync(new URL(`.github/brand/${file}`, root), readmeArt(palette, { width: 1280, height: 640, label: README_LABEL }));
}
console.log(`Wrote og.svg, ${outputs.map(([file]) => file).join(", ")}`);

if (process.argv.includes("--render-og")) {
  const { chromium } = await import("playwright");
  const { default: sharp } = await import("sharp");
  const browser = await chromium.launch({ channel: "chrome" });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.setContent(`<html><body style="margin:0">${readFileSync(new URL(".github/brand/og.svg", root), "utf8")}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const png = await sharp(await page.screenshot()).png({ compressionLevel: 9, effort: 10 }).toBuffer();
    if (png.length > 50000) throw new Error(`OG image exceeds 50 KB: ${png.length} bytes`);
    writeFileSync(new URL("public/og.png", root), png);
    console.log(`Wrote public/og.png: 1200x630, ${png.length} bytes`);
  } finally {
    await browser.close();
  }
}
