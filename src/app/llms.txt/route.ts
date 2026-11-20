import { staticPages } from "@/content/static-pages";
import { REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, markdownPath } from "@/lib/site";
import { getPage, getSitemapEntries } from "@/sanity/lib/fetch-page";

export async function GET() {
  return new Response(`${await llmsTxt()}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

/** Cached with the page list and every page it reads; their tags expire it on publish. */
async function llmsTxt(): Promise<string> {
  "use cache";
  const entries = await getSitemapEntries();
  const pages = await Promise.all(
    entries.map(async ({ slug }) => {
      const loaded = await getPage(slug);
      const path = slug === "home" ? "/" : `/${slug}`;
      return loaded ? `- [${loaded.page.title}](${SITE_URL}${markdownPath(path)}): ${loaded.page.description}` : null;
    }),
  );
  const fixed = staticPages.map((page) => `- [${page.title}](${SITE_URL}${markdownPath(page.path)}): ${page.description}`);

  return [
    `# ${SITE_NAME}`,
    `> ${SITE_DESCRIPTION}`,
    "Every page is also available as Markdown: add .md to its path, use /index.md for the home page, or send Accept: text/markdown.",
    "## Pages",
    [...pages.filter(Boolean), ...fixed].join("\n"),
    "## Optional",
    `- [Sitemap](${SITE_URL}/sitemap.xml): every public URL`,
    `- [Source code](${REPO_URL}): the Next.js and Sanity project behind this site`,
  ].join("\n\n");
}
