import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsPage } from "@/components/pages/CmsPage";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";
import { getPage } from "@/sanity/lib/fetch-page";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const loaded = await getPage("home", locale);
  if (!loaded) return {};
  const { page } = loaded;
  return pageMetadata({
    path: "/",
    title: page.seo?.title || page.title,
    description: page.description,
    locale,
    noIndex: page.seo?.noIndex,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CmsPage slug="home" path="/" locale={locale} />;
}
