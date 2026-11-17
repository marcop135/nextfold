import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { MATOMO_ENABLED, aiAssistantHitUrl, isAiAssistant, isTrackablePath } from "@/lib/matomo";
import { preferredRepresentation } from "@/lib/negotiate";
import { DISCOVERY_LINK, markdownPath } from "@/lib/site";

const MARKDOWN_FILE = /^\/([a-z0-9-]+)\.md$/;
const PAGE_PATH = /^\/(?:[a-z0-9-]+)?$/;
const NOT_PAGES = new Set(["/studio", "/md", "/api"]);

/**
 * - /index.md and /<slug>.md rewrite to the Markdown route.
 * - Page URLs negotiate on Accept: Markdown, HTML with a Link to its twin, or 406.
 * - AI-assistant fetches are reported to Matomo without changing the response.
 */
export function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent");
  if (MATOMO_ENABLED && isAiAssistant(ua) && isTrackablePath(pathname)) {
    event.waitUntil(fetch(aiAssistantHitUrl(request.url, ua ?? "")).catch(() => undefined));
  }

  const file = MARKDOWN_FILE.exec(pathname);
  if (file) return NextResponse.rewrite(new URL(`/md/${file[1]}`, request.url));

  if (!PAGE_PATH.test(pathname) || NOT_PAGES.has(pathname) || !negotiable(request)) return NextResponse.next();

  const twin = markdownPath(pathname);
  const link = `<${twin}>; rel="alternate"; type="text/markdown", ${DISCOVERY_LINK}`;
  const representation = preferredRepresentation(request.headers.get("accept"));
  if (representation === "none") {
    return new NextResponse("Not Acceptable: this page is available as text/html or text/markdown.\n", {
      status: 406,
      headers: { "Content-Type": "text/plain; charset=utf-8", Vary: "Accept", Link: link },
    });
  }
  if (representation === "markdown") {
    const response = NextResponse.rewrite(new URL(`/md/${twin.slice(1, -3)}`, request.url));
    response.headers.set("Vary", "Accept");
    return response;
  }
  const response = NextResponse.next();
  response.headers.set("Vary", "Accept");
  response.headers.set("Link", link);
  return response;
}

function negotiable(request: NextRequest): boolean {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  return !request.headers.has("rsc") && !request.headers.has("next-router-prefetch");
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|.*\\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|css|js)$).*)"],
};
