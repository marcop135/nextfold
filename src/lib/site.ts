import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://nextfold.marcopontili.com").replace(/\/$/, "");
export const SITE_NAME = "Next Fold";
export const SITE_DESCRIPTION =
  "A Next.js and Sanity demo: typed sections, the schema that limits them, and Studio. Editors fill the fields. Developers own the types.";
export const AUTHOR = { name: "Marco Pontili", url: "https://marcopontili.com" } as const;
export const REPO_URL = "https://github.com/marcop135/nextfold";
export const OG_IMAGE = { url: "/og.jpg", width: 1200, height: 630, alt: "Next Fold: define a section once, editors compose pages from it" };

/** Preview deployments stay out of search; production and local builds are indexable. */
export const IS_INDEXABLE = process.env.VERCEL_ENV !== "preview";

export const ROBOTS: Metadata["robots"] = IS_INDEXABLE
  ? { index: true, follow: true, googleBot: { "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } }
  : { index: false, follow: false };

/** Markdown twin of an HTML path: / → /index.md, /privacy → /privacy.md. */
export function markdownPath(pathname: string): string {
  const path = pathname.replace(/\/$/, "");
  return path === "" ? "/index.md" : `${path}.md`;
}

/** Site-wide Link header: discovery files for crawlers and agents. */
export const DISCOVERY_LINK = '</sitemap.xml>; rel="sitemap", </llms.txt>; rel="describedby"; type="text/plain"';

/** Generated Open Graph card for a page path, served by src/app/og/[slug]/route.tsx. */
export function ogImagePath(path: string): string {
  return `/og/${path === "/" ? "home" : path.slice(1)}`;
}

export function pageMetadata({ path, title, description }: { path: string; title: string; description: string }): Metadata {
  const image = { url: ogImagePath(path), width: OG_IMAGE.width, height: OG_IMAGE.height, alt: title };
  return {
    title: { absolute: title },
    description,
    robots: ROBOTS,
    alternates: { canonical: path, types: { "text/markdown": markdownPath(path) } },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", title, description, url: path, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

type Crumb = { name: string; path: string };

export function pageJsonLd({
  path,
  title,
  description,
  crumbs = [],
}: {
  path: string;
  title: string;
  description: string;
  crumbs?: Crumb[];
}) {
  const url = `${SITE_URL}${path}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
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
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      author: { "@id": `${SITE_URL}/#author` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}${ogImagePath(path)}`,
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
      itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
