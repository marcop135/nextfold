/**
 * Self-hosted, cookieless Matomo. Tracking is off until both IDs are set,
 * so forks and local runs send nothing.
 */
/** Serves the Tag Manager container. */
export const MATOMO_ORIGIN = "https://mt.marcopontili.com";
/** Receives tracking requests. */
const MATOMO_TRACKER = "https://mt.marcopontili.com/m/";
export const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? "";
export const MATOMO_CONTAINER_ID = process.env.NEXT_PUBLIC_MATOMO_CONTAINER_ID ?? "";
export const MATOMO_ENABLED = Boolean(MATOMO_SITE_ID && MATOMO_CONTAINER_ID);

/** AI assistants fetching a page for a user; mirrors the Next Story list. */
const UA_NEEDLES = ["ChatGPT-User", "Claude-User", "Perplexity-User", "MistralAI-User", "Gemini-Deep-Research", "Google-NotebookLM"];
const STATIC_ASSET = /\.(?:css|js|mjs|map|woff2?|ttf|eot|png|jpe?g|gif|webp|avif|svg|ico)$/i;

export function isAiAssistant(ua: string | null): boolean {
  if (!ua) return false;
  const haystack = ua.toLowerCase();
  return UA_NEEDLES.some((needle) => haystack.includes(needle.toLowerCase()));
}

export function isTrackablePath(path: string): boolean {
  return !path.startsWith("/_next/") && !/^\/(?:studio|api)(?:\/|$)/.test(path) && !STATIC_ASSET.test(path);
}

/** Server-side hit for an AI-assistant fetch: no browser, no cookies. */
export function aiAssistantHitBody(url: string, ua: string): URLSearchParams {
  return new URLSearchParams({ idsite: MATOMO_SITE_ID, rec: "1", recMode: "1", url, ua, source: "vercel-proxy" });
}

export async function reportAiAssistant(url: string, ua: string): Promise<void> {
  try {
    const response = await fetch(MATOMO_TRACKER, {
      method: "POST",
      body: aiAssistantHitBody(url, ua),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) console.warn("Matomo AI tracking failed", response.status);
  } catch {
    console.warn("Matomo AI tracking failed: network or timeout");
  }
}
