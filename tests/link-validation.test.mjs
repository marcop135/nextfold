import assert from "node:assert/strict";
import test from "node:test";
import { checkLinkUrl } from "../src/lib/rules.ts";

test("accepts site paths and valid HTTPS URLs", () => {
  for (const href of ["/", "/contact", "/de/contact?source=nav#form", "/search?q=two words", "https://example.com/path?query=1#section"]) {
    assert.equal(checkLinkUrl(href), null, href);
  }
});

test("rejects paths that resolve to another origin", () => {
  for (const href of ["//example.com/path", "/\\example.com/path", "/\n/example.com/path"]) {
    assert.notEqual(checkLinkUrl(href), null, href);
  }
});

test("rejects malformed HTTPS URLs", () => {
  for (const href of ["https://", "https://bad host/path", "https:///example.com"]) {
    assert.notEqual(checkLinkUrl(href), null, href);
  }
});
