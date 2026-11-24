import assert from "node:assert/strict";
import { test } from "node:test";
import { aiAssistantHitBody, isAiAssistant, isTrackablePath, reportAiAssistant } from "../src/lib/matomo.ts";

test("AI payload stays bot-only and preserves encoded request data", () => {
  const body = aiAssistantHitBody("https://example.test/page?a=1&b=two words", "ChatGPT-User/1.0");
  assert.equal(body.get("recMode"), "1");
  assert.equal(body.get("url"), "https://example.test/page?a=1&b=two words");
  assert.equal(body.get("ua"), "ChatGPT-User/1.0");
  assert.equal(body.get("source"), "vercel-proxy");
  assert.equal(isAiAssistant("ChatGPT-User/1.0"), true);
  assert.equal(isAiAssistant("Mozilla/5.0"), false);
  assert.equal(isTrackablePath("/_next/static/app.js"), false);
});

test("delivery uses POST and isolates HTTP and network failures", async (t) => {
  const warnings = [];
  t.mock.method(console, "warn", (...args) => warnings.push(args));
  const fetchMock = t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://mt.marcopontili.com/m/");
    assert.equal(options.method, "POST");
    assert.ok(options.body instanceof URLSearchParams);
    assert.ok(options.signal instanceof AbortSignal);
    return new Response(null, { status: 404 });
  });
  await reportAiAssistant("https://example.test/?private=value", "Claude-User/1.0");
  assert.deepEqual(warnings, [["Matomo AI tracking failed", 404]]);
  fetchMock.mock.mockImplementation(async () => { throw new Error("private=value"); });
  await reportAiAssistant("https://example.test/?private=value", "Claude-User/1.0");
  assert.equal(warnings.length, 2);
  assert.equal(JSON.stringify(warnings).includes("private"), false);
});
