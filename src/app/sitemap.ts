import type { MetadataRoute } from "next";
import { staticPages } from "@/content/static-pages";
import { SITE_URL } from "@/lib/site";
import { getSitemapEntries } from "@/sanity/lib/fetch-page";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  return [
    ...entries.map(({ slug, updatedAt }) => ({
      url: `${SITE_URL}${slug === "home" ? "/" : `/${slug}`}`,
      ...(updatedAt ? { lastModified: updatedAt } : {}),
    })),
    ...staticPages.map((page) => ({ url: `${SITE_URL}${page.path}` })),
  ];
}
