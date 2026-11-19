import { seedPages, seedSettings } from "@/content/seed";
import type { ContentSource, Page, SiteSettings } from "../types";
import { live } from "./live";
import { PAGE_QUERY, SETTINGS_QUERY, SITEMAP_QUERY } from "./queries";

export type LoadedPage = { page: Page; source: ContentSource };

/**
 * `published` skips draft mode: Markdown twins, llms.txt, the sitemap, and static params always read published content.
 * `clean` keeps drafts but drops stega, for strings that end up outside the page body, such as metadata.
 */
export type FetchMode = "page" | "clean" | "published";

function options(mode: FetchMode) {
  if (mode === "published") return { perspective: "published", stega: false } as const;
  if (mode === "clean") return { stega: false } as const;
  return {};
}

/** Sanity first; a seed page fills in until the dataset has its own version. */
export async function getPage(slug: string, mode: FetchMode = "page"): Promise<LoadedPage | null> {
  const seed = seedPages.find((page) => page.slug === slug) ?? null;
  if (!live) return seed && { page: seed, source: "seed" };
  const { data } = await live.sanityFetch({ query: PAGE_QUERY, params: { slug }, ...options(mode) });
  if (data) return { page: data as Page, source: "sanity" };
  return seed && { page: seed, source: "seed" };
}

/** Header and footer content: the siteSettings document, or the seed settings until it is published. */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!live) return seedSettings;
  const { data } = await live.sanityFetch({ query: SETTINGS_QUERY });
  return (data as SiteSettings | null) ?? seedSettings;
}

export type SitemapEntry = { slug: string; updatedAt?: string };

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const fromSanity = live
    ? ((await live.sanityFetch({ query: SITEMAP_QUERY, ...options("published") })).data as SitemapEntry[])
    : [];
  const slugs = new Set(fromSanity.map((entry) => entry.slug));
  return [...fromSanity, ...seedPages.filter((page) => !slugs.has(page.slug)).map((page) => ({ slug: page.slug }))];
}
