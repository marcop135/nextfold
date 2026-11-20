import { cacheTag } from "next/cache";
import { seedPages, seedSettings } from "@/content/seed";
import { defaultLocale, type Locale } from "@/lib/i18n";
import { settingsId } from "../structure";
import type { ContentSource, Page, SiteSettings } from "../types";
import { PUBLISHED, live, type FetchOptions } from "./live";
import { PAGE_QUERY, SETTINGS_QUERY, SITEMAP_QUERY } from "./queries";

/** `locale` is the language the page is in; it differs from the requested one when English filled in. */
export type LoadedPage = { page: Page; source: ContentSource; locale: Locale; cachedAt: string };

/** Cache tags the publish webhook in src/app/api/revalidate/route.ts expires. One tag per slug covers both languages. */
export const TAGS = {
  page: (slug: string) => `page:${slug}`,
  pageList: "page-list",
  settings: "settings",
} as const;

async function fromSanity(slug: string, locale: Locale, options: FetchOptions): Promise<Page | null> {
  if (!live) return null;
  const { data } = await live.sanityFetch({
    query: PAGE_QUERY,
    params: { slug, language: locale },
    tags: [TAGS.page(slug)],
    ...options,
  });
  return (data as Page | null) ?? null;
}

const fromSeed = (slug: string, locale: Locale) => seedPages[locale].find((page) => page.slug === slug) ?? null;

/**
 * Sanity in the requested language, then the seed copy in that language, then the same two in English.
 * One cache entry per slug, language, and perspective. `sanityFetch` adds the document sync tags the
 * Live Content API expires; `TAGS.page` is the tag the publish webhook expires.
 */
export async function getPage(slug: string, locale: Locale, options: FetchOptions = PUBLISHED): Promise<LoadedPage | null> {
  "use cache";
  cacheTag(TAGS.page(slug));
  // The moment this entry was written, shown on /caching. Inside the cache, so a hit returns the same time.
  const cachedAt = new Date().toISOString();
  const chain: Locale[] = locale === defaultLocale ? [locale] : [locale, defaultLocale];
  for (const language of chain) {
    const sanity = await fromSanity(slug, language, options);
    if (sanity) return { page: sanity, source: "sanity", locale: language, cachedAt };
    const seed = fromSeed(slug, language);
    if (seed) return { page: seed, source: "seed", locale: language, cachedAt };
  }
  return null;
}

/** Header and footer content in one language: its settings document, or the seed settings until it is published. */
export async function getSiteSettings(locale: Locale, options: FetchOptions = PUBLISHED): Promise<SiteSettings> {
  "use cache";
  cacheTag(TAGS.settings);
  if (!live) return seedSettings[locale];
  const { data } = await live.sanityFetch({
    query: SETTINGS_QUERY,
    params: { id: settingsId(locale) },
    tags: [TAGS.settings],
    ...options,
  });
  return (data as SiteSettings | null) ?? seedSettings[locale];
}

export type SitemapEntry = { slug: string; updatedAt?: string };

/** Every page slug in one language: Sanity's, then seed pages Sanity does not have yet. */
export async function getSitemapEntries(locale: Locale): Promise<SitemapEntry[]> {
  "use cache";
  cacheTag(TAGS.pageList);
  const sanity = live
    ? ((await live.sanityFetch({ query: SITEMAP_QUERY, params: { language: locale }, tags: [TAGS.pageList], ...PUBLISHED }))
        .data as SitemapEntry[])
    : [];
  const slugs = new Set(sanity.map((entry) => entry.slug));
  return [...sanity, ...seedPages[locale].filter((page) => !slugs.has(page.slug)).map((page) => ({ slug: page.slug }))];
}
