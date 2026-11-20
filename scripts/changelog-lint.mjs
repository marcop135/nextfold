// Checks CHANGELOG.md against its own format block: Keep a Changelog sections in order, no duplicates,
// one-line bullets of at most 120 visible characters (link URLs excluded). Ported from Next Story.
// Run with `npm run changelog:lint`.
import { readFileSync } from "node:fs";

const md = readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf8");
const lines = md.split(/\r?\n/);
const errors = [];

const SECTIONS = ["Added", "Changed", "Removed", "Fixed", "Security"];
const PREAMBLE = ["- **Format:**", "- **Voice:**", "- **Length:**"];

for (const needle of PREAMBLE) {
  if (!md.includes(needle)) errors.push(`Missing format line starting "${needle}"`);
}

/** Visible length: a Markdown link counts as its text only. */
const visibleLength = (text) => text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").length;

let version = null;
let seen = [];
lines.forEach((line, index) => {
  const at = `Line ${index + 1}`;
  const heading = line.match(/^## \[([^\]]+)\](?: - (\d{4}-\d{2}-\d{2}))?$/);
  if (line.startsWith("## ")) {
    if (!heading || (heading[1] !== "Unreleased" && !heading[2])) {
      errors.push(`${at}: version heading must be "## [Unreleased]" or "## [x.y.z] - YYYY-MM-DD"`);
    }
    version = heading?.[1] ?? line;
    seen = [];
    return;
  }

  const section = line.match(/^### (.+)$/);
  if (section) {
    const name = section[1].trim();
    if (!SECTIONS.includes(name)) errors.push(`${at}: unknown section "${name}" (use ${SECTIONS.join(", ")})`);
    else if (seen.includes(name)) errors.push(`${at}: duplicate ### ${name} under ${version}`);
    else if (seen.length && SECTIONS.indexOf(name) < SECTIONS.indexOf(seen.at(-1))) {
      errors.push(`${at}: ### ${name} out of order under ${version} (want ${SECTIONS.join(", ")})`);
    }
    seen.push(name);
    return;
  }

  const bullet = line.match(/^- (.+)$/);
  if (!bullet || !version) return;
  if (!seen.length) errors.push(`${at}: bullet outside a ### section under ${version}`);
  const length = visibleLength(bullet[1]);
  if (length > 120) errors.push(`${at}: ${length} visible characters, max 120`);
  if (line.includes("—")) errors.push(`${at}: em dash`);
});

if (errors.length) {
  console.error(`CHANGELOG.md has ${errors.length} problem${errors.length === 1 ? "" : "s"}:\n${errors.map((e) => `  ${e}`).join("\n")}`);
  process.exit(1);
}
console.log("CHANGELOG.md follows its format.");
