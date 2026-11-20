# Operations

How a change reaches production, and where each service around the site is configured.

## Ship a change

1. Open a GitHub issue for the change.
2. Branch `feat/<topic>` off `develop`, commit, and add one line per user-visible change under `## [Unreleased]` in [`CHANGELOG.md`](../CHANGELOG.md).
3. Run the checks CI runs:

   ```bash
   npm run lint
   npm run typecheck
   npm run changelog:lint
   npm run content:check
   npm run build
   ```

4. Open a pull request into `develop` with `Fixes #<n>`. CI ([`ci.yml`](../.github/workflows/ci.yml)) and CodeQL must pass before it merges.

`<n>` is the issue number.

## Release

1. Branch `release/<x.y.z>` off `develop`, move the `[Unreleased]` bullets under `## [<x.y.z>] - <YYYY-MM-DD>`, set `version` in `package.json`, and merge it into `develop`.
2. Open a promotion pull request from `develop` into `main` and merge it. The repository deletes head branches on merge, so recreate `develop` from `main` and push it.
3. Deploy production from a clean `main` checkout. The Vercel project has no Git integration, so a push deploys nothing:

   ```bash
   vercel deploy --prod --yes --scope <team>
   ```

4. Tag the production commit `v<x.y.z>` (annotated) and publish a GitHub release titled like the changelog heading, with that version's sections as its body.
5. Run the production smoke test:

   ```bash
   npm run smoke
   ```

Additive features raise the minor version; fixes raise the patch version.

## Vercel

| Setting | Value | Where |
| --- | --- | --- |
| Framework | Next.js | [`vercel.json`](../vercel.json) |
| Function region | `fra1` (Frankfurt) | `vercel.json` |
| Production environment variables | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_MATOMO_SITE_ID`, `NEXT_PUBLIC_MATOMO_CONTAINER_ID`, `SANITY_REVALIDATE_SECRET`, `SANITY_API_READ_TOKEN` | Dashboard, **Settings > Environment Variables** |
| Firewall | Bot Protection on; custom rule: deny requests to `/api/revalidate` whose method is not `POST`; AI bots allowed | Dashboard, **Firewall** |

Check the region and firewall after a deploy:

```bash
vercel inspect <deployment url> --scope <team>
vercel firewall status --project nextfold --scope <team>
```

## Cloudflare

The `nextfold` record is a CNAME to Vercel, **DNS only**. [Security: edge and DNS](security.md#edge-and-dns) explains why it is not proxied. DNSSEC is on for the zone, and CAA records allow the certificate authorities Vercel uses.

## Matomo

Analytics run on a self-hosted Matomo with a Tag Manager container. The site loads it only when both Matomo variables are set; [Architecture: analytics and headers](architecture.md#analytics-and-headers) lists what is tracked.

## Brand images

[`art.mjs`](../.github/brand/art.mjs) writes `og.svg` and the README headers from one layout; [`round-readme-images.mjs`](../scripts/round-readme-images.mjs) adds the rounded variants:

```bash
node .github/brand/art.mjs
node scripts/round-readme-images.mjs
```

The PNG and JPG outputs (`public/og.jpg`, `.github/brand/social.png`) are rendered from those SVGs with a headless browser and committed.
