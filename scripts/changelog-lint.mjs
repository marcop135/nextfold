/**
 * Changelog lint: checks CHANGELOG.md against the format block at its top.
 *
 * Run:    npm run changelog:lint (CI runs it on every pull request)
 * Reads:  CHANGELOG.md
 * Checks: the format block is present; version headings are "## [Unreleased]" or "## [x.y.z] - YYYY-MM-DD";
 *         ### sections are Added, Changed, Removed, Fixed, Security, in that order, each at most once;
 *         every bullet sits in a section, fits 120 visible characters (link URLs excluded), and has no em dash.
 * Exit:   0 when clean; 1 with one line per problem on stderr.
 */
import { readFileSync } from "node:fs";

const md = readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf8");
const lines = md.split(/\r?\n/);
const errors = [];

const SECTIONS = ["Added", "Changed", "Removed", "Fixed", "Security"];
/** Lines the format block must keep, so the rules this script enforces stay written down in the file itself. */
const PREAMBLE = ["- **Format:**", "- **Voice:**", "- **Length:**"];
const EM_DASH = "\u2014";

for (const needle of PREAMBLE) {
  if (!md.includes(needle)) errors.push(`Missing format line starting "${needle}"`);
}

/** Visible length: a Markdown link counts as its text only. */
const visibleLength = (text) => text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").length;

// One pass over the file: `version` is the current ## heading, `seen` the ### sections met under it so far.
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

  // Bullets before the first ## heading belong to the format block and are not checked.
  const bullet = line.match(/^- (.+)$/);
  if (!bullet || !version) return;
  if (!seen.length) errors.push(`${at}: bullet outside a ### section under ${version}`);
  const length = visibleLength(bullet[1]);
  if (length > 120) errors.push(`${at}: ${length} visible characters, max 120`);
  if (line.includes(EM_DASH)) errors.push(`${at}: em dash`);
});

if (errors.length) {
  console.error(`CHANGELOG.md has ${errors.length} problem${errors.length === 1 ? "" : "s"}:\n${errors.map((e) => `  ${e}`).join("\n")}`);
  process.exit(1);
}
console.log("CHANGELOG.md follows its format.");
