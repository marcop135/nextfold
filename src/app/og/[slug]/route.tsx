import { staticPages } from "@/content/static-pages";
import { cmsPageOgCard, ogCard } from "@/lib/og-card";

export const revalidate = 3600;

/** Open Graph card per page at /og/<slug>: home, a CMS page, or a fixed page. Linked from pageMetadata. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fixed = staticPages.find((page) => page.path === `/${slug}`);
  if (fixed) return ogCard({ title: fixed.heading, description: fixed.description });
  const card = await cmsPageOgCard(slug);
  return card ?? new Response("Not found.\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
