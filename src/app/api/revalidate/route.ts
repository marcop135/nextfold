import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { TAGS } from "@/sanity/lib/fetch-page";

type WebhookBody = { _type?: string; slug?: string | null };

const text = (body: string, status: number) =>
  new Response(`${body}\n`, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

/**
 * Sanity publish webhook: expires the cached page, page list, or settings right away, so pages,
 * Markdown twins, llms.txt, and the sitemap update even when no browser has the site open.
 * Set up in docs/sanity-setup.md; the projection must send `_type` and `"slug": slug.current`.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return text("Webhook revalidation needs SANITY_REVALIDATE_SECRET.", 501);

  let parsed: Awaited<ReturnType<typeof parseBody<WebhookBody>>>;
  try {
    parsed = await parseBody<WebhookBody>(request, secret, true);
  } catch {
    return text("Malformed webhook body.", 400);
  }
  const { isValidSignature, body } = parsed;
  if (!isValidSignature) return text("Invalid signature.", 401);
  if (!body?._type) return text("Missing _type in the webhook body.", 400);

  const tags =
    body._type === "siteSettings"
      ? [TAGS.settings]
      : body._type === "page"
        ? [TAGS.pageList, ...(body.slug ? [TAGS.page(body.slug)] : [])]
        : [];
  if (!tags.length) return text(`Nothing cached for ${body._type}.`, 200);

  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tags });
}
