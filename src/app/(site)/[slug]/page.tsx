import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsPage } from "@/components/CmsPage";
import { pageMetadata } from "@/lib/site";
import { getPage, getSitemapEntries } from "@/sanity/lib/fetch-page";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const entries = await getSitemapEntries();
  return entries.filter((entry) => entry.slug !== "home").map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loaded = slug === "home" ? null : await getPage(slug);
  return loaded ? pageMetadata({ path: `/${slug}`, title: loaded.page.title, description: loaded.page.description }) : {};
}

/** Params are awaited outside Suspense, so slugs missing from generateStaticParams still render and cache on first visit. */
export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "home") notFound();
  return <CmsPage slug={slug} path={`/${slug}`} />;
}
