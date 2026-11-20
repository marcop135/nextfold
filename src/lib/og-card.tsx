import { ImageResponse } from "next/og";
import { stegaClean } from "next-sanity";
import { staticPagesFor } from "@/content/static-pages";
import { defaultLocale, type Locale } from "@/lib/i18n";
import { getPage } from "@/sanity/lib/fetch-page";
import { SITE_NAME, SITE_URL } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#101112";
const MUTED = "#4f5562";
const ACCENT = "#f03e2f";

/** Open Graph card for one page: its eyebrow, title, and description on the site's light ground. */
export function ogCard({ eyebrow, title, description }: { eyebrow?: string | null; title: string; description?: string | null }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f3f3f5",
          backgroundImage: "radial-gradient(#dddee3 1.6px, transparent 1.8px)",
          backgroundSize: "28px 28px",
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, letterSpacing: "-0.03em" }}>
          <svg width="44" height="44" viewBox="0 0 32 32">
            <path fill={INK} d="M6.5 2H20l8 8v17.5a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 4 27.5v-23A2.5 2.5 0 0 1 6.5 2z" />
            <path fill="#8a8f9a" d="M20 2v5.5a2.5 2.5 0 0 0 2.5 2.5H28z" />
            <rect x="8" y="17" width="16" height="5" fill={ACCENT} />
          </svg>
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1000 }}>
          {eyebrow ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              <div style={{ width: 16, height: 16, background: ACCENT }} />
              {eyebrow}
            </div>
          ) : null}
          <div style={{ fontSize: title.length > 48 ? 64 : 76, lineHeight: 1.05, letterSpacing: "-0.04em" }}>{title}</div>
          {description ? <div style={{ fontSize: 30, lineHeight: 1.35, color: MUTED }}>{description}</div> : null}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: MUTED }}>
          <span>{SITE_URL.replace("https://", "")}</span>
          <span style={{ width: 160, height: 8, background: ACCENT, alignSelf: "center" }} />
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      // The default is one year, immutable; cards follow CMS copy, so match the route's revalidate window.
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400" },
    },
  );
}

/** A CMS page's card: the opening hero's eyebrow and heading, then the meta description. */
export async function cmsPageOgCard(slug: string, locale: Locale = defaultLocale) {
  const loaded = await getPage(slug, locale);
  if (!loaded) return null;
  const { page } = loaded;
  const hero = page.sections?.[0]?._type === "hero" ? page.sections[0] : null;
  return ogCard({
    eyebrow: stegaClean(hero?.eyebrow),
    title: stegaClean(hero?.heading ?? page.title),
    description: stegaClean(page.description),
  });
}

/** The card for /og/<slug> or /og/de/<slug>: a fixed page, a CMS page, or 404. */
export async function ogResponse(slug: string, locale: Locale) {
  const fixed = staticPagesFor(locale).find((page) => page.path === `/${slug}`);
  if (fixed) return ogCard({ title: fixed.heading, description: fixed.description });
  const card = await cmsPageOgCard(slug, locale);
  return card ?? new Response("Not found.\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
