import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getPage } from "@/sanity/lib/fetch-page";
import { getFetchOptions } from "@/sanity/lib/live";
import { PageView } from "@/components/pages/PageView";

/** A CMS page in one language: the cached published version, or drafts with stega when draft mode is on. */
export async function CmsPage({ slug, path, locale }: { slug: string; path: string; locale: Locale }) {
  const loaded = await getPage(slug, locale, await getFetchOptions());
  if (!loaded) notFound();
  return <PageView loaded={loaded} path={path} locale={locale} />;
}
