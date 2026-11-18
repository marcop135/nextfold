import { seedPages, seedSettings } from "@/content/seed";
import type { ContentSource, Page, SiteSettings } from "../types";
import { client } from "./client";
import { PAGE_QUERY, SETTINGS_QUERY, SITEMAP_QUERY } from "./queries";

const REVALIDATE_SECONDS = 60;
const next = { revalidate: REVALIDATE_SECONDS, tags: ["page"] };

export type LoadedPage = { page: Page; source: ContentSource };

/** Sanity first; a seed page fills in until the dataset has its own version. */
export async function getPage(slug: string): Promise<LoadedPage | null> {
  const seed = seedPages.find((page) => page.slug === slug) ?? null;
  if (!client) return seed && { page: seed, source: "seed" };
  const page = await client.fetch<Page | null>(PAGE_QUERY, { slug }, { next });
  if (page) return { page, source: "sanity" };
  return seed && { page: seed, source: "seed" };
}

/** Header and footer content: the siteSettings document, or the seed settings until it is published. */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!client) return seedSettings;
  const settings = await client.fetch<SiteSettings | null>(
    SETTINGS_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SECONDS, tags: ["siteSettings"] } },
  );
  return settings ?? seedSettings;
}

export type SitemapEntry = { slug: string; updatedAt?: string };

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const fromSanity = client ? await client.fetch<SitemapEntry[]>(SITEMAP_QUERY, {}, { next }) : [];
  const slugs = new Set(fromSanity.map((entry) => entry.slug));
  return [...fromSanity, ...seedPages.filter((page) => !slugs.has(page.slug)).map((page) => ({ slug: page.slug }))];
}
