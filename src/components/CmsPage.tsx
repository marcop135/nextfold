import { notFound } from "next/navigation";
import { getPage } from "@/sanity/lib/fetch-page";
import { getFetchOptions } from "@/sanity/lib/live";
import { PageView } from "./PageView";

/** A CMS page: the cached published version, or drafts with stega when draft mode is on. */
export async function CmsPage({ slug, path }: { slug: string; path: string }) {
  const loaded = await getPage(slug, await getFetchOptions());
  if (!loaded) notFound();
  return <PageView loaded={loaded} path={path} />;
}
