import { cacheTag } from "next/cache";
import { seedPages, seedSettings } from "@/content/seed";
import type { ContentSource, Page, SiteSettings } from "../types";
import { PUBLISHED, live, type FetchOptions } from "./live";
import { PAGE_QUERY, SETTINGS_QUERY, SITEMAP_QUERY } from "./queries";

export type LoadedPage = { page: Page; source: ContentSource; cachedAt: string };

/** Cache tags the publish webhook in src/app/api/revalidate/route.ts expires. */
export const TAGS = {
  page: (slug: string) => `page:${slug}`,
  pageList: "page-list",
  settings: "settings",
} as const;

/**
 * Sanity first; a seed page fills in until the dataset has its own version.
 * One cache entry per slug and perspective. `sanityFetch` adds the document sync tags the Live Content API
 * expires; `TAGS.page` is the tag the publish webhook expires. Seed pages keep the same tag, so a
 * webhook for a page that is not in Sanity yet still drops the cached seed copy.
 */
export async function getPage(slug: string, options: FetchOptions = PUBLISHED): Promise<LoadedPage | null> {
  "use cache";
  cacheTag(TAGS.page(slug));
  // The moment this entry was written, shown on /caching. Inside the cache, so a hit returns the same time.
  const cachedAt = new Date().toISOString();
  const seed = seedPages.find((page) => page.slug === slug) ?? null;
  if (!live) return seed && { page: seed, source: "seed", cachedAt };
  const { data } = await live.sanityFetch({ query: PAGE_QUERY, params: { slug }, tags: [TAGS.page(slug)], ...options });
  if (data) return { page: data as Page, source: "sanity", cachedAt };
  return seed && { page: seed, source: "seed", cachedAt };
}

/** Header and footer content: the siteSettings document, or the seed settings until it is published. */
export async function getSiteSettings(options: FetchOptions = PUBLISHED): Promise<SiteSettings> {
  "use cache";
  cacheTag(TAGS.settings);
  if (!live) return seedSettings;
  const { data } = await live.sanityFetch({ query: SETTINGS_QUERY, tags: [TAGS.settings], ...options });
  return (data as SiteSettings | null) ?? seedSettings;
}

export type SitemapEntry = { slug: string; updatedAt?: string };

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  "use cache";
  cacheTag(TAGS.pageList);
  const fromSanity = live
    ? ((await live.sanityFetch({ query: SITEMAP_QUERY, tags: [TAGS.pageList], ...PUBLISHED })).data as SitemapEntry[])
    : [];
  const slugs = new Set(fromSanity.map((entry) => entry.slug));
  return [...fromSanity, ...seedPages.filter((page) => !slugs.has(page.slug)).map((page) => ({ slug: page.slug }))];
}
