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

## Vercel and Cloudflare

[Vercel](vercel.md) covers the project settings, region, environment variables, and firewall. [Cloudflare](cloudflare.md) covers the DNS record, why it is not proxied, DNSSEC, and CAA.

## Matomo

Analytics run on a self-hosted Matomo with a Tag Manager container. The site loads it only when both Matomo variables are set; [Architecture: analytics and headers](architecture.md#analytics-and-headers) lists what is tracked.

## Brand images

[`art.mjs`](../.github/brand/art.mjs) writes the README headers and fits the light header proportionally into the 1200x630 `og.svg`; [`round-readme-images.mjs`](../scripts/round-readme-images.mjs) adds the rounded variants:

```bash
node .github/brand/art.mjs --render-og
node scripts/round-readme-images.mjs
```

The command renders `public/og.png` in system Chrome as a lossless PNG under 50 KB. The other committed PNG outputs (`.github/brand/social.png`, `.github/brand/readme-{light,dark}.png`) are rendered from their SVGs with a headless browser.
