import { staticPages } from "@/content/static-pages";
import { cmsPageMarkdown, staticPageMarkdown } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";
import { getPage } from "@/sanity/lib/fetch-page";

/** Markdown twins, reached through /index.md and /<slug>.md rewrites in src/proxy.ts. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = slug === "index" ? "/" : `/${slug}`;

  let body: string | null = null;
  const fixed = staticPages.find((page) => page.path === path);
  if (fixed) body = staticPageMarkdown(fixed);
  else if (slug !== "home") {
    try {
      const loaded = await getPage(slug === "index" ? "home" : slug);
      if (loaded) body = cmsPageMarkdown(loaded.page, path);
    } catch {
      return new Response("Content temporarily unavailable.\n", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
  }

  if (!body) return new Response("Not found.\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      Link: `<${SITE_URL}${path}>; rel="canonical"; type="text/html"`,
      Vary: "Accept",
    },
  });
}
