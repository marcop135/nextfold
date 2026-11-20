import type { Metadata } from "next";
import { LOCALE_NAMES, defaultLocale, hreflangAlternates, localizedPath, locales, type Locale } from "./i18n";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://nextfold.marcopontili.com").replace(/\/$/, "");
export const SITE_NAME = "Next Fold";
export const SITE_DESCRIPTIONS: Record<Locale, string> = {
  en: "A Next.js and Sanity site run end to end in public: typed sections, Studio, caching, security, analytics, and releases.",
  de: "Eine Next.js- und Sanity-Website, öffentlich und von Anfang bis Ende betrieben: typisierte Abschnitte, Studio, Caching, Sicherheit, Analytics und Releases.",
};
export const SITE_DESCRIPTION = SITE_DESCRIPTIONS.en;
export const AUTHOR = { name: "Marco Pontili", url: "https://marcopontili.com" } as const;
export const REPO_URL = "https://github.com/marcop135/nextfold";
export const OG_IMAGE = { url: "/og.jpg", width: 1200, height: 630, alt: "Next Fold: Next.js + Sanity, run end to end" };

/** Preview deployments stay out of search; production and local builds are indexable. */
export const IS_INDEXABLE = process.env.VERCEL_ENV !== "preview";

export const ROBOTS: Metadata["robots"] = IS_INDEXABLE
  ? { index: true, follow: true, googleBot: { "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } }
  : { index: false, follow: false };

/** Markdown twin of an HTML path: / → /index.md, /privacy → /privacy.md, /de → /de/index.md. */
export function markdownPath(pathname: string): string {
  const path = pathname.replace(/\/$/, "");
  if (path === "") return "/index.md";
  if ((locales as readonly string[]).includes(path.slice(1))) return `${path}/index.md`;
  return `${path}.md`;
}

/** Site-wide Link header: discovery files for crawlers and agents. */
export const DISCOVERY_LINK = '</sitemap.xml>; rel="sitemap", </llms.txt>; rel="describedby"; type="text/plain"';

/** Generated Open Graph card for a locale-neutral path, served by src/app/og: /og/home, /og/de/guardrails. */
export function ogImagePath(path: string, locale: Locale = defaultLocale): string {
  const slug = path === "/" ? "home" : path.slice(1);
  return locale === defaultLocale ? `/og/${slug}` : `/og/${locale}/${slug}`;
}

/** `path` is locale-neutral (/guardrails); the URLs in the result carry the locale. */
export function pageMetadata({
  path,
  title,
  description,
  locale = defaultLocale,
}: {
  path: string;
  title: string;
  description: string;
  locale?: Locale;
}): Metadata {
  const url = localizedPath(path, locale);
  const image = { url: ogImagePath(path, locale), width: OG_IMAGE.width, height: OG_IMAGE.height, alt: title };
  return {
    title: { absolute: title },
    description,
    robots: ROBOTS,
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
      types: { "text/markdown": markdownPath(url) },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: LOCALE_NAMES[locale].og,
      alternateLocale: locales.filter((other) => other !== locale).map((other) => LOCALE_NAMES[other].og),
      title,
      description,
      url,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

type Crumb = { name: string; path: string };

/** `path` and crumb paths are locale-neutral. Site and person keep one @id across languages. */
export function pageJsonLd({
  path,
  title,
  description,
  crumbs = [],
  locale = defaultLocale,
  homeName = "Home",
}: {
  path: string;
  title: string;
  description: string;
  crumbs?: Crumb[];
  locale?: Locale;
  homeName?: string;
}) {
  const url = `${SITE_URL}${localizedPath(path, locale)}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTIONS.en,
      inLanguage: locales.map((item) => LOCALE_NAMES[item].hreflang),
      publisher: { "@id": `${SITE_URL}/#author` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#author`,
      name: AUTHOR.name,
      url: AUTHOR.url,
      knowsAbout: ["Next.js", "Sanity", "Headless CMS", "Technical SEO"],
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: LOCALE_NAMES[locale].hreflang,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      author: { "@id": `${SITE_URL}/#author` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}${ogImagePath(path, locale)}`,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
      },
      ...(crumbs.length ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    },
  ];
  if (crumbs.length) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [{ name: homeName, path: "/" }, ...crumbs].map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${localizedPath(item.path, locale)}`,
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
