import assert from "node:assert/strict";
import test from "node:test";
import { preferredRepresentation } from "../src/lib/negotiate.ts";

test("defaults to HTML and respects explicit preferences and exclusions", () => {
  for (const [accept, expected] of [
    [null, "html"],
    ["*/*", "html"],
    ["text/html, text/markdown", "html"],
    ["text/markdown, */*", "markdown"],
    ["text/html;q=0.5, text/markdown;q=0.8", "markdown"],
    ["text/html;q=0, text/*;q=1", "markdown"],
    ["text/html;q=0, text/markdown;q=0, */*;q=1", "none"],
    ["application/json", "none"],
  ]) {
    assert.equal(preferredRepresentation(accept), expected, accept);
  }
});

test("does not treat malformed or out-of-range quality values as preferences", () => {
  for (const q of ["1junk", "2", "1.001", "0.9999", "1e0", "-1", "NaN", ""]) {
    assert.equal(preferredRepresentation(`text/markdown;q=${q}, text/html;q=0.5`), "html", q);
    assert.equal(preferredRepresentation(`text/markdown;q=${q}`), "none", q);
  }
});

test("accepts valid quality values, including zero and three decimal places", () => {
  for (const q of ["1", "1.", "1.000", "0.999"]) {
    assert.equal(preferredRepresentation(`text/markdown;Q=${q}, text/html;q=0.5`), "markdown", q);
  }
  for (const q of ["0", "0.", "0.000"]) {
    assert.equal(preferredRepresentation(`text/markdown;q=${q}`), "none", q);
  }
});

test("ignores malformed media ranges with extra path segments", () => {
  for (const range of ["text/markdown/extra", "text/html/", "*/*/extra", "text/*/extra"]) {
    assert.equal(preferredRepresentation(range), "none", range);
  }
  assert.equal(preferredRepresentation("text/markdown/extra, text/html;q=0.5"), "html");
});

test("keeps quoted delimiters and escaped quotes inside parameter values", () => {
  for (const profile of ['"a,b"', '"a;q=1,b"', '"a\\\",b"', '"a\\\\,b"']) {
    const accept = `text/markdown;profile=${profile};q=0, text/html;q=0.5`;
    assert.equal(preferredRepresentation(accept), "html", accept);
  }
  assert.equal(preferredRepresentation('text/html;profile="a;q=0";q=1, text/markdown;q=0.5'), "html");
});
