# Security

What the site exposes, how it is protected, and how to report a problem. To report a vulnerability, follow [SECURITY.md](../.github/SECURITY.md).

## What is public

| Surface | Access |
| --- | --- |
| Pages, Markdown twins, `llms.txt`, sitemap, Open Graph cards | Anyone; published content only |
| `/studio` | Anyone can load it; reading drafts or editing needs a Sanity login with project access. Marked `noindex` and blocked in `robots.txt` |
| `/api/revalidate` | Accepts only requests signed with `SANITY_REVALIDATE_SECRET`; answers 501 when the secret is not set |
| `/api/draft-mode/enable` | Accepts only a preview secret that the viewer token validates; answers 501 without `SANITY_API_READ_TOKEN` |

The viewer token never reaches the browser: `defineLive` in [`live.ts`](../src/sanity/lib/live.ts) sets `browserToken: false`, and the token has no `NEXT_PUBLIC_` prefix.

## Response headers

Set in [`next.config.ts`](../next.config.ts).

| Header | Value | Applies to |
| --- | --- | --- |
| `Content-Security-Policy` | Same-origin scripts and styles, Matomo and the Sanity Live API as the only other origins, `frame-ancestors 'self'`, `object-src 'none'` | Site |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | All |
| `X-Content-Type-Options` | `nosniff` | All |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | All |
| `Permissions-Policy` | Camera, microphone, geolocation, payment, USB, serial, HID, Bluetooth, MIDI, and Topics off | All |
| `Cross-Origin-Opener-Policy` | `same-origin` | Site |
| `X-Frame-Options` | `SAMEORIGIN` | All |

`script-src` keeps `'unsafe-inline'`: the App Router streams inline payload scripts, and a nonce would make every page dynamic, which the [caching](caching.md) design avoids. The Studio gets no CSP because it calls the Sanity APIs from the browser.

## Edge and DNS

- **Vercel firewall.** Bot Protection and a rule that denies anything but `POST` on `/api/revalidate`, with AI crawlers allowed. [Vercel: set up the firewall](vercel.md#set-up-the-firewall) has the steps.
- **Cloudflare.** The `nextfold` CNAME is DNS only, with DNSSEC and CAA on the zone. [Cloudflare](cloudflare.md) explains why it is not proxied and how both are set up.

## Repository

| Control | Where |
| --- | --- |
| CodeQL on every pull request and weekly | [`codeql.yml`](../.github/workflows/codeql.yml) |
| OpenSSF Scorecard on `main` and weekly | [`scorecard.yml`](../.github/workflows/scorecard.yml) |
| Weekly production check of headers and routes | [`prod-smoke.yml`](../.github/workflows/prod-smoke.yml), running [`smoke.mjs`](../scripts/smoke.mjs) |
| Dependency updates, monthly | [`dependabot.yml`](../.github/dependabot.yml) |
| Actions pinned to commit SHAs | Every workflow under `.github/workflows` |

`/.well-known/security.txt` names the contact and points to the policy.
