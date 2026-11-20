import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Analytics } from "@/components/Analytics";
import { DraftModeBar } from "@/components/DraftModeBar";
import { SiteChrome } from "@/components/SiteChrome";
import { LOCALE_NAMES, isLocale, locales } from "@/lib/i18n";
import { OG_IMAGE, ROBOTS, SITE_DESCRIPTIONS, SITE_NAME, SITE_URL } from "@/lib/site";
import { isDraftMode as readDraftMode, live } from "@/sanity/lib/live";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : "en";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    description: SITE_DESCRIPTIONS[lang],
    applicationName: SITE_NAME,
    authors: [{ name: "Marco Pontili", url: "https://marcopontili.com" }],
    robots: ROBOTS,
    openGraph: { type: "website", siteName: SITE_NAME, locale: LOCALE_NAMES[lang].og, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f3f5" },
    { media: "(prefers-color-scheme: dark)", color: "#101112" },
  ],
};

/** Root layout of the public site, one per language: `<html lang>` follows the URL. The Studio has its own. */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isDraftMode = await readDraftMode();
  // Imported only in draft mode so the Visual Editing overlay stays out of the public bundle.
  const VisualEditing = isDraftMode ? (await import("next-sanity/visual-editing")).VisualEditing : null;
  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <SiteChrome locale={locale}>{children}</SiteChrome>
        {live ? <live.SanityLive includeDrafts={isDraftMode} /> : null}
        {isDraftMode ? (
          <>
            {VisualEditing ? <VisualEditing /> : null}
            <DraftModeBar locale={locale} />
          </>
        ) : null}
        <Analytics />
      </body>
    </html>
  );
}
