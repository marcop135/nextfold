// Round the README header and content-flow diagram corners, as Next Story does.
// Run from the repository root after rendering the brand SVGs or the diagram: node scripts/round-readme-images.mjs
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
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
