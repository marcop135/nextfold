import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";
import { MATOMO_ENABLED, aiAssistantHitUrl, isAiAssistant, isTrackablePath } from "@/lib/matomo";
import { preferredRepresentation } from "@/lib/negotiate";
import { DISCOVERY_LINK, markdownPath } from "@/lib/site";

const PREFIXED = locales.filter((locale) => locale !== defaultLocale).join("|");
/** /x.md, /index.md, /de/x.md, /de/index.md */
const MARKDOWN_FILE = new RegExp(`^(?:/(${PREFIXED}))?/([a-z0-9-]+)\\.md$`);
/** /, /x, /de, /de/x */
const PAGE_PATH = new RegExp(`^(?:/(${PREFIXED}))?(?:/([a-z0-9-]+))?/?$`);
/** /en and /en/x: the default language has no prefix, so these redirect to it. */
const DEFAULT_PREFIX = new RegExp(`^/${defaultLocale}(/.*)?$`);
const NOT_PAGES = new Set(["studio", "md", "api", "og"]);

/**
 * - /en/... redirects to the unprefixed URL; English pages render from /en internally.
 * - /index.md, /<slug>.md, and their /de twins rewrite to the Markdown route.
 * - Page URLs negotiate on Accept: Markdown, HTML with a Link to its twin, or 406.
 * - AI-assistant fetches are reported to Matomo without changing the response.
 */
export function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent");
  if (MATOMO_ENABLED && isAiAssistant(ua) && isTrackablePath(pathname)) {
    event.waitUntil(fetch(aiAssistantHitUrl(request.url, ua ?? "")).catch(() => undefined));
  }

  const prefixed = DEFAULT_PREFIX.exec(pathname);
  if (prefixed) {
    const url = request.nextUrl.clone();
    url.pathname = prefixed[1] || "/";
    return NextResponse.redirect(url, 308);
  }

  const file = MARKDOWN_FILE.exec(pathname);
  if (file) return NextResponse.rewrite(new URL(`/md/${file[1] ?? defaultLocale}/${file[2]}`, request.url));

  const page = PAGE_PATH.exec(pathname);
  if (!page || (page[2] && NOT_PAGES.has(page[2]))) return NextResponse.next();
  const locale = page[1] ?? defaultLocale;
  const slug = page[2];
  const internal = new URL(`/${locale}${slug ? `/${slug}` : ""}${request.nextUrl.search}`, request.url);

  if (!negotiable(request)) return NextResponse.rewrite(internal);

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
    const name = twin.split("/").pop()!.slice(0, -3);
    const response = NextResponse.rewrite(new URL(`/md/${locale}/${name}`, request.url));
    response.headers.set("Vary", "Accept");
    return response;
  }
  const response = NextResponse.rewrite(internal);
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
