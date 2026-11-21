import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsPage } from "@/components/pages/CmsPage";
import { isLocale, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";
import { getPage, getSitemapEntries } from "@/sanity/lib/fetch-page";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    locales.map(async (locale) =>
      (await getSitemapEntries(locale)).filter((entry) => entry.slug !== "home").map((entry) => ({ locale, slug: entry.slug })),
    ),
  );
  return perLocale.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || slug === "home") return {};
  const loaded = await getPage(slug, locale);
  return loaded
    ? pageMetadata({ path: `/${slug}`, title: loaded.page.title, description: loaded.page.description, locale })
    : {};
}

/** Params are awaited outside Suspense, so slugs missing from generateStaticParams still render and cache on first visit. */
export default async function SlugPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || slug === "home") notFound();
  return <CmsPage slug={slug} path={`/${slug}`} locale={locale} />;
}
