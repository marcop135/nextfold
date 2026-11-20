import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticPageView } from "@/components/StaticPageView";
import { forAgents } from "@/content/static-pages";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? pageMetadata({ ...forAgents[locale], locale }) : {};
}

export default async function ForAgentsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <StaticPageView page={forAgents[locale]} locale={locale} />;
}
