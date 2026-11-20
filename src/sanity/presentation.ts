import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";
import { LOCALE_NAMES, defaultLocale, localizedPath, locales, type Locale } from "../lib/i18n";

const pagePath = (slug: string | undefined, language: string | undefined) => {
  const locale = (locales as readonly string[]).includes(language ?? "") ? (language as Locale) : defaultLocale;
  return localizedPath(slug === "home" || !slug ? "/" : `/${slug}`, locale);
};

const inLanguage = (locale: Locale) => `coalesce(language, "${defaultLocale}") == "${locale}"`;

/** Which document a URL edits, and which URLs show a document. /de/... edits the German document. */
export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments(
    locales.flatMap((locale) => [
      { route: localizedPath("/", locale), filter: `_type == "page" && slug.current == "home" && ${inLanguage(locale)}` },
      {
        route: localizedPath("/:slug", locale),
        filter: `_type == "page" && slug.current == $slug && ${inLanguage(locale)}`,
      },
    ]),
  ),
  locations: {
    page: defineLocations({
      select: { title: "title", slug: "slug.current", language: "language" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || "Untitled", href: pagePath(doc?.slug, doc?.language) }],
      }),
    }),
    siteSettings: defineLocations({
      select: { language: "language" },
      resolve: (doc) => ({
        message: "The header and footer on every page in this language",
        tone: "positive",
        locations: [
          {
            title: `Home, ${LOCALE_NAMES[(doc?.language as Locale) ?? defaultLocale]?.name ?? "English"}`,
            href: pagePath("home", doc?.language),
          },
        ],
      }),
    }),
  },
};
