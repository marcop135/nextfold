import type { MetadataRoute } from "next";
import { STATIC_PATHS } from "@/content/static-pages";
import { LOCALE_NAMES, defaultLocale, localizedPath, locales } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";
import { getSitemapEntries } from "@/sanity/lib/fetch-page";

/** One URL per page and language, each listing every language version (hreflang in the sitemap). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  const perLocale = await Promise.all(locales.map(async (locale) => ({ locale, entries: await getSitemapEntries(locale) })));
  const updated = new Map<string, string>();
  for (const { entries } of perLocale) {
    for (const { slug, updatedAt } of entries) {
      if (updatedAt && (!updated.has(slug) || updatedAt > updated.get(slug)!)) updated.set(slug, updatedAt);
    }
  }
  const slugs = [...new Set(perLocale.flatMap(({ entries }) => entries.map((entry) => entry.slug)))];
  const paths = [...slugs.map((slug) => (slug === "home" ? "/" : `/${slug}`)), ...STATIC_PATHS];
  const alternates = (path: string) => ({
    languages: {
      ...Object.fromEntries(locales.map((locale) => [LOCALE_NAMES[locale].hreflang, absoluteUrl(localizedPath(path, locale))])),
      "x-default": absoluteUrl(localizedPath(path, defaultLocale)),
    },
  });
  return paths.flatMap((path) => {
    const lastModified = updated.get(path === "/" ? "home" : path.slice(1));
    return locales.map((locale) => ({
      url: absoluteUrl(localizedPath(path, locale)),
      ...(lastModified ? { lastModified } : {}),
      alternates: alternates(path),
    }));
  });
}
