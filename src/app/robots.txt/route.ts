import { IS_INDEXABLE, SITE_URL } from "@/lib/site";

export function GET() {
  const body = IS_INDEXABLE
    ? [
        "User-agent: *",
        "Content-Signal: search=yes, ai-input=yes",
        "Allow: /",
        "Disallow: /studio",
        "Disallow: /api/",
        "",
        `Sitemap: ${SITE_URL}/sitemap.xml`,
      ]
    : ["User-agent: *", "Disallow: /"];
  return new Response(`${body.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
