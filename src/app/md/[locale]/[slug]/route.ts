import { staticPagesFor } from "@/content/static-pages";
import { LOCALE_NAMES, isLocale, locales, localizedPath } from "@/lib/i18n";
import { cmsPageMarkdown, staticPageMarkdown } from "@/lib/markdown";
import { DISCOVERY_LINK, IS_INDEXABLE, SITE_URL, absoluteUrl, markdownPath } from "@/lib/site";
import { getPage } from "@/sanity/lib/fetch-page";

const text = (body: string, status: number) =>
  new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

/** Markdown twins, reached through /index.md, /<slug>.md, and their /de versions, rewritten in src/proxy.ts. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return text("Not found.\n", 404);
  const path = slug === "index" ? "/" : `/${slug}`;

  let body: string | null = null;
  let contentLocale = locale;
  const fixed = staticPagesFor(locale).find((page) => page.path === path);
  if (fixed) body = staticPageMarkdown(fixed, locale);
  else if (slug !== "home") {
    try {
      const loaded = await getPage(slug === "index" ? "home" : slug, locale);
      if (loaded) {
        body = cmsPageMarkdown(loaded.page, path, locale);
        contentLocale = loaded.locale;
      }
    } catch {
      return text("Content temporarily unavailable.\n", 503);
    }
  }

  if (!body) return text("Not found.\n", 404);
  const html = localizedPath(path, locale);
  const alternates = locales
    .filter((other) => other !== locale)
    .map((other) => `<${SITE_URL}${markdownPath(localizedPath(path, other))}>; rel="alternate"; type="text/markdown"; hreflang="${LOCALE_NAMES[other].hreflang}"`);
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Language": LOCALE_NAMES[contentLocale].hreflang,
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      Link: [`<${absoluteUrl(html)}>; rel="canonical"; type="text/html"`, ...alternates, DISCOVERY_LINK].join(", "),
      Vary: "Accept",
      ...(IS_INDEXABLE ? {} : { "X-Robots-Tag": "noindex, nofollow" }),
    },
  });
}
