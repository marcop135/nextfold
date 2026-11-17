import { seedPages } from "@/content/seed";
import type { ContentSource, Page } from "../types";
import { client } from "./client";
import { PAGE_QUERY, SITEMAP_QUERY } from "./queries";

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

export type SitemapEntry = { slug: string; updatedAt?: string };

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const fromSanity = client ? await client.fetch<SitemapEntry[]>(SITEMAP_QUERY, {}, { next }) : [];
  const slugs = new Set(fromSanity.map((entry) => entry.slug));
  return [...fromSanity, ...seedPages.filter((page) => !slugs.has(page.slug)).map((page) => ({ slug: page.slug }))];
}
