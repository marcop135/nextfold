import { staticPagesFor } from "@/content/static-pages";
import { LOCALE_NAMES, localizedPath, locales, type Locale } from "@/lib/i18n";
import { REPO_URL, SITE_DESCRIPTIONS, SITE_NAME, SITE_URL, markdownPath } from "@/lib/site";
import { getPage, getSitemapEntries } from "@/sanity/lib/fetch-page";

export async function GET() {
  return new Response(`${await llmsTxt()}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

const HEADINGS: Record<Locale, string> = { en: "Pages in English", de: "Seiten auf Deutsch" };

/** Every page in one language with its Markdown link. A page shown in English as a fallback is left out. */
async function pagesIn(locale: Locale): Promise<string[]> {
  const entries = await getSitemapEntries(locale);
  const pages = await Promise.all(
    entries.map(async ({ slug }) => {
      const loaded = await getPage(slug, locale);
      if (!loaded || loaded.locale !== locale) return null;
      const path = localizedPath(slug === "home" ? "/" : `/${slug}`, locale);
      return `- [${loaded.page.title}](${SITE_URL}${markdownPath(path)}): ${loaded.page.description}`;
    }),
  );
  const fixed = staticPagesFor(locale).map(
    (page) => `- [${page.title}](${SITE_URL}${markdownPath(localizedPath(page.path, locale))}): ${page.description}`,
  );
  return [...pages.filter((line): line is string => line !== null), ...fixed];
}

/** Cached with the page list and every page it reads; their tags expire it on publish. */
async function llmsTxt(): Promise<string> {
  "use cache";
  const sections = await Promise.all(
    locales.map(async (locale) => [`## ${HEADINGS[locale]} (${LOCALE_NAMES[locale].hreflang})`, (await pagesIn(locale)).join("\n")]),
  );
  return [
    `# ${SITE_NAME}`,
    `> ${SITE_DESCRIPTIONS.en}`,
    "Every page is also available as Markdown: add .md to its path, use /index.md for the home page (/de/index.md in German), or send Accept: text/markdown. German pages live under /de.",
    ...sections.flat(),
    "## Optional",
    `- [Sitemap](${SITE_URL}/sitemap.xml): every public URL with its language versions`,
    `- [Source code](${REPO_URL}): the Next.js and Sanity project behind this site`,
  ].join("\n\n");
}
