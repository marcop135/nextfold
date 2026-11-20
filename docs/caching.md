# Caching

Every public page is rendered once, stored, and served from storage until one of its cache tags expires, which happens when content it read changes. This page explains the three layers involved and what clears each one. The live [Caching page](https://nextfold.marcopontili.com/caching) shows the result for itself.

## The three layers

| Layer | What it stores | What clears it |
| --- | --- | --- |
| Sanity API CDN | Query results for published content | Sanity, on publish |
| Next.js cache (`'use cache'`) | Each page, query result, Markdown twin, `llms.txt`, and the sitemap, under tags | An expired tag |
| Vercel CDN | The finished HTML and route responses at the edge | Vercel, when a tag behind the response expires |

The client in [`client.ts`](../src/sanity/lib/client.ts) reads the `published` perspective with `useCdn: true`, so even a fresh render reads from Sanity's CDN.

## Cache Components

[`next.config.ts`](../next.config.ts) turns on `cacheComponents` and sets the default cache life to the `sanity` profile from `next-sanity/live/cache-life`: entries never expire on a timer, only through tags.

[`fetch-page.ts`](../src/sanity/lib/fetch-page.ts) holds the cache boundaries. `getPage`, `getSiteSettings`, and `getSitemapEntries` each start with `'use cache'`. Inside them, `sanityFetch` from [`live.ts`](../src/sanity/lib/live.ts) tags the entry with one sync tag per Sanity document the query read (Sanity returns these tags with each query result), and `cacheTag` adds the tags in `TAGS`:

| Tag | Set by | Covers |
| --- | --- | --- |
| `page:<slug>` | `getPage` | One page in every language, seed copy included |
| `page-list` | `getSitemapEntries` | The sitemap, `llms.txt`, and static params |
| `settings` | `getSiteSettings` | Header and footer in every language |

`getPage` also records `cachedAt`, the time the entry was written. Because the timestamp is taken inside the cache boundary, a cache hit returns the time of the original render. The cache inspector on the Caching page shows it.

Route handlers cannot carry `'use cache'` themselves, so [`llms.txt/route.ts`](../src/app/llms.txt/route.ts) calls a cached helper, and the Open Graph and Markdown routes call the cached `getPage`.

## Draft mode stays outside the cache

`defineLive` runs with `strict: true`, which makes every fetch state its perspective (`published` or `drafts`) and whether to add stega, the invisible markers Visual Editing uses to map text to fields. `getFetchOptions` in `live.ts` reads `draftMode()` and the perspective cookie at request time, outside any cache boundary, and passes the result into `getPage`. Published reads and draft reads therefore land in separate cache entries, and a visitor never receives a draft.

## What expires a tag

1. **Live Content API.** `<SanityLive />` in [the language layout](../src/app/[locale]/layout.tsx) listens for document changes while a browser has the site open and expires the matching sync tags.
2. **Publish webhook.** [`/api/revalidate`](../src/app/api/revalidate/route.ts) verifies Sanity's signature, then expires `page:<slug>` and `page-list` for a page, or `settings` for site settings. It covers publishes while no browser has the site open. Set it up with [Sanity setup](sanity-setup.md), step 10, which adds the webhook in Sanity's project settings.

The next request after an expiry renders a fresh copy and stores it. Pages that did not read the changed document keep their entry.

## Pages that are not in the build

`generateStaticParams` in [`[slug]/page.tsx`](../src/app/[locale]/(site)/[slug]/page.tsx) lists every known slug per language, so the build prerenders them. A slug published later renders on its first request and is cached from then on, because the page awaits `params` outside any `<Suspense>` boundary.
