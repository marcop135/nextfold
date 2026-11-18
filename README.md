<p align="center">
  <a href="https://nextfold.marcopontili.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/brand/readme-dark-rounded.svg" />
      <img src=".github/brand/readme-light-rounded.svg" alt="Next Fold: a hero section type defined in code, overlapped by the hero section it renders" width="100%" />
    </picture>
  </a>
</p>

# Next Fold

[![Release](https://img.shields.io/github/v/release/marcop135/nextfold?label=Release)](https://github.com/marcop135/nextfold/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)
[![Node.js 22+](https://img.shields.io/badge/Node.js-22%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-087EA4?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Sanity](https://img.shields.io/badge/Sanity-Studio_6-F03E2F?logo=sanity&logoColor=white)](https://www.sanity.io/)

A [Next.js](https://nextjs.org/) App Router and [Sanity](https://www.sanity.io/) demo. Editors build marketing pages from typed sections in Sanity Studio, embedded in the app. Developers own the schema, the GROQ queries, and the React components.

## Explore the demo

Live demo: **[nextfold.marcopontili.com](https://nextfold.marcopontili.com)**

| Page | What it shows |
| --- | --- |
| [Home](https://nextfold.marcopontili.com/) | What editors and developers each own |
| [Anatomy of a page](https://nextfold.marcopontili.com/anatomy) | Each section next to the Sanity data it came from |
| [Guardrails](https://nextfold.marcopontili.com/guardrails) | The schema rules that keep pages on brand |
| [For agents](https://nextfold.marcopontili.com/for-agents) | Markdown versions, `llms.txt`, sitemap |

## How content flows

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/content-flow-dark.svg" />
  <img src="docs/content-flow-light.svg" alt="Five steps: define section types in code, edit a page in Studio, publish to the Sanity dataset, fetch it with GROQ through the CDN (or a bundled seed page), render one component per section as HTML and Markdown" width="560" />
</picture>

See [Architecture](docs/architecture.md) for the request path through the code.

[Sanity setup](docs/sanity-setup.md) · [Architecture](docs/architecture.md) · [Changelog](CHANGELOG.md)

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 App Router, React 19, TypeScript 5 |
| Content | Sanity Studio 6 at `/studio`, GROQ |
| Styling | Plain CSS with cascade layers and `light-dark()` |
| Analytics | Self-hosted Matomo, cookieless |
| Quality | ESLint, TypeScript |
| Hosting | Vercel |
| DNS | Cloudflare, `nextfold` CNAME, DNS only |

## Quick start

Requires Node.js 22.13+.

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3100. Without `NEXT_PUBLIC_SANITY_PROJECT_ID`, the bundled seed pages render.

<details>
<summary>Commands</summary>

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port 3100 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no output files |
| `npm run build` | Production build |
| `npm start` | Serve the production build on port 3100 |

</details>

## Sanity setup

Create a project and dataset, add the CORS origin, and publish a first page with [Sanity setup](docs/sanity-setup.md).

All variables are optional in local mode. Set them in `.env` to load content from Sanity:

| Variable | Used for | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity content and the Studio | Empty: sample content only |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity content and the Studio | `production` |
| `SANITY_API_READ_TOKEN` | Draft previews (planned) | Empty |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, JSON-LD | `https://nextfold.marcopontili.com` |
| `NEXT_PUBLIC_MATOMO_SITE_ID`, `NEXT_PUBLIC_MATOMO_CONTAINER_ID` | Cookieless analytics | Empty: no tracking |

## Related

[Next Story](https://github.com/marcop135/nextstory) is the Storyblok counterpart: localization, draft preview, webhook cache refresh, and read-only agent tools.

## Author

[Marco Pontili](https://marcopontili.com)

## License

[MIT](./LICENSE)
