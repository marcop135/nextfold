/**
 * Round README images: gives the README header and the content-flow diagram rounded corners.
 *
 * Run:     node scripts/round-readme-images.mjs, after `node .github/brand/art.mjs` renders the brand SVGs
 *          or after the diagram is re-rendered from docs/content-flow.mmd (see docs/operations.md)
 * Reads:   .github/brand/readme-{light,dark}.svg, docs/content-flow-{light,dark}.svg
 * Writes:  .github/brand/readme-{light,dark}-rounded.svg (new files; the square sources stay for social.png),
 *          docs/content-flow-{light,dark}.svg (in place; safe to run again, the old background is replaced)
 */
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
/** The page background per theme (--color-bg in globals.css), so the rounded diagram blends into the site. */
const ground = { light: "#F3F3F5", dark: "#101112" };

for (const theme of ["light", "dark"]) {
  // Header: clip the full-bleed brand artwork to 24px corners. The square source stays for social.png.
  let header = readFileSync(new URL(`.github/brand/readme-${theme}.svg`, root), "utf8");
  header = header
    .replace(/(<\/style>)/, `$1\n  <defs><clipPath id="rounded-header"><rect width="1280" height="640" rx="24"/></clipPath></defs>\n  <g clip-path="url(#rounded-header)">`)
    .replace(/<\/svg>\s*$/, "  </g>\n</svg>\n");
  writeFileSync(new URL(`.github/brand/readme-${theme}-rounded.svg`, root), header);

  // Diagram: swap Mermaid's square background for a rounded rectangle.
  const path = new URL(`docs/content-flow-${theme}.svg`, root);
  let svg = readFileSync(path, "utf8");
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`Missing viewBox in docs/content-flow-${theme}.svg`);
  const [x, y, width, height] = viewBox.split(/\s+/).map(Number);
  svg = svg.replace(/<rect id="diagram-background"[^>]*\/>/, "");
  svg = svg.replace(/background-color:\s*[^;"]+;?/, "background-color: transparent;");
  const background = `<rect id="diagram-background" x="${x}" y="${y}" width="${width}" height="${height}" rx="16" fill="${ground[theme]}"/>`;
  svg = svg.replace(/(<svg\b[^>]*>)/, `$1${background}`);
  writeFileSync(path, svg);
}
