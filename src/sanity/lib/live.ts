import { cookies, draftMode } from "next/headers";
import { defineLive, resolvePerspectiveFromCookies, type LivePerspective } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "./token";

/**
 * Live Content API with Cache Components: `sanityFetch` tags each cached result with the documents it read,
 * and `<SanityLive />` expires those tags when a document changes. `strict` makes every fetch state its
 * perspective and stega, so draft values are resolved outside the cache boundary and passed in.
 * The viewer token stays on the server, so live drafts work inside Presentation only.
 */
export const live = client ? defineLive({ client, serverToken: readToken || false, browserToken: false, strict: true }) : null;

export type FetchOptions = { perspective: LivePerspective; stega: boolean };

/** Published content with plain strings: every cached page, Markdown twin, card, and feed. */
export const PUBLISHED: FetchOptions = { perspective: "published", stega: false };

/** Request-time options for draft mode. Call outside any 'use cache' function and pass the result in. */
export async function getDraftFetchOptions(): Promise<FetchOptions> {
  const jar = await cookies();
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar });
  return { perspective: perspective ?? "drafts", stega: true };
}

export async function isDraftMode(): Promise<boolean> {
  return (await draftMode()).isEnabled;
}

/** Published options normally; draft options when draft mode is on. Await outside 'use cache'. */
export async function getFetchOptions(): Promise<FetchOptions> {
  return (await isDraftMode()) ? getDraftFetchOptions() : PUBLISHED;
}
