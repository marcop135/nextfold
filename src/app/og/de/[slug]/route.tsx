import { ogResponse } from "@/lib/og-card";

/** German Open Graph card per page at /og/de/<slug>. Linked from pageMetadata. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogResponse(slug, "de");
}
