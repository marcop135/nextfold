import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/PageView";
import { pageMetadata } from "@/lib/site";
import { getPage, getSitemapEntries, type FetchMode } from "@/sanity/lib/fetch-page";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string, mode?: FetchMode) {
  return slug === "home" ? null : getPage(slug, mode);
}

export async function generateStaticParams() {
  const entries = await getSitemapEntries();
  return entries.filter((entry) => entry.slug !== "home").map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await load(slug, "clean");
  return loaded ? pageMetadata({ path: `/${slug}`, title: loaded.page.title, description: loaded.page.description }) : {};
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const loaded = await load(slug);
  if (!loaded) notFound();
  return <PageView loaded={loaded} path={`/${slug}`} />;
}
