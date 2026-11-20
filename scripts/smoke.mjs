// Checks a running Next Fold: status codes, security headers, hreflang, Markdown twins, and discovery files.
// Usage: node scripts/smoke.mjs [base URL]   (default https://nextfold.marcopontili.com)
// Exits 1 with a list of failures; the weekly prod-smoke workflow opens an issue from that output.
const base = (process.argv[2] ?? "https://nextfold.marcopontili.com").replace(/\/$/, "");
const failures = [];
const fail = (where, message) => failures.push(`${where}: ${message}`);

async function get(path, accept = "text/html") {
  const response = await fetch(base + path, { redirect: "manual", headers: { accept, "user-agent": "nextfold-smoke" } });
  return { response, body: await response.text() };
}

const SECURITY_HEADERS = {
  "content-security-policy": /default-src 'self'/,
  "strict-transport-security": /max-age=\d+/,
  "x-content-type-options": /^nosniff$/,
  "referrer-policy": /strict-origin-when-cross-origin/,
  "permissions-policy": /camera=\(\)/,
  "cross-origin-opener-policy": /^same-origin$/,
  "x-frame-options": /^SAMEORIGIN$/i,
};

const PAGES = [
  ["/", "en", "/index.md"],
  ["/guardrails", "en", "/guardrails.md"],
  ["/caching", "en", "/caching.md"],
  ["/de", "de", "/de/index.md"],
  ["/de/guardrails", "de", "/de/guardrails.md"],
];

for (const [path, lang, twin] of PAGES) {
  const { response, body } = await get(path);
  if (response.status !== 200) {
    fail(path, `status ${response.status}`);
    continue;
  }
  for (const [name, pattern] of Object.entries(SECURITY_HEADERS)) {
    const value = response.headers.get(name);
    if (!value || !pattern.test(value)) fail(path, `header ${name} is ${value ?? "missing"}`);
  }
  if (!body.includes(`<html lang="${lang}"`)) fail(path, `html lang is not ${lang}`);
  for (const hreflang of ["en", "de", "x-default"]) {
    if (!new RegExp(`<link rel="alternate" hrefLang="${hreflang}"`, "i").test(body)) fail(path, `no hreflang="${hreflang}" link`);
  }
  const link = response.headers.get("link") ?? "";
  if (!link.includes(`<${twin}>; rel="alternate"; type="text/markdown"`)) fail(path, `Link header does not name ${twin}`);

  const markdown = await get(twin, "text/markdown");
  if (markdown.response.status !== 200) fail(twin, `status ${markdown.response.status}`);
  if (!markdown.response.headers.get("content-type")?.startsWith("text/markdown")) fail(twin, "not text/markdown");
  if (markdown.response.headers.get("content-language") !== lang) fail(twin, `Content-Language is not ${lang}`);
}

const redirect = await get("/en/guardrails");
if (redirect.response.status !== 308 || redirect.response.headers.get("location") !== "/guardrails") {
  fail("/en/guardrails", `expected 308 to /guardrails, got ${redirect.response.status} ${redirect.response.headers.get("location")}`);
}

const llms = await get("/llms.txt", "text/plain");
if (llms.response.status !== 200 || !llms.body.includes("/de/index.md")) fail("/llms.txt", "missing or without German pages");
const sitemap = await get("/sitemap.xml", "application/xml");
if (sitemap.response.status !== 200 || !sitemap.body.includes('hreflang="de"')) fail("/sitemap.xml", "missing or without hreflang");
const securityTxt = await get("/.well-known/security.txt", "text/plain");
if (securityTxt.response.status !== 200 || !securityTxt.body.includes("Contact:")) fail("/.well-known/security.txt", "missing");
const missing = await get("/this-page-does-not-exist");
if (missing.response.status !== 404) fail("/this-page-does-not-exist", `status ${missing.response.status}, expected 404`);

if (failures.length) {
  console.error(`Smoke test against ${base}: ${failures.length} failure${failures.length === 1 ? "" : "s"}\n${failures.map((f) => `- ${f}`).join("\n")}`);
  process.exit(1);
}
console.log(`Smoke test against ${base}: every check passed.`);
