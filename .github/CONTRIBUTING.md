# Contributing to Next Fold

Next Fold is a public demo, maintained by one person. Bug reports, fixes, and doc corrections are welcome. For a new feature or section type, open an issue first so the scope is agreed before code is written.

## Set up

Requires Node.js 22+.

```bash
npm ci
cp .env.example .env
npm run dev
```

Open http://localhost:3100. With no Sanity variables set, the bundled seed pages in `src/content/seed` render, so most changes need no Sanity project. To work against a dataset, follow [Sanity setup](../docs/sanity-setup.md).

## Branches

- Branch off `develop`: `feat/<topic>` for features, `fix/<topic>` for fixes.
- Open the pull request against `develop`. `main` holds released code only and takes release PRs.
- One topic per pull request.

## Before you open a pull request

CI runs these on every pull request; run them locally first:

```bash
npm run lint
npm run typecheck
npm run content:check
npm run changelog:lint
npm run build
npm run test:e2e   # Playwright and axe in your installed Chrome; reuses a running npm run dev
```

- After a schema or GROQ query change, run `npm run typegen` and commit `src/sanity/schema.json` and `src/sanity/sanity.types.ts`.
- A user-facing change adds one line under `## [Unreleased]` in [CHANGELOG.md](../CHANGELOG.md), in the format at the top of that file.
- A visual change includes screenshots at desktop and mobile width, in light and dark.
- Copy changes land in both `src/content/seed/en.ts` and `de.ts` and in `src/lib/messages.ts` for both languages. German follows the [translation glossary](../docs/translation-glossary.md).

## Code style

- ESLint with the Next.js config; TypeScript strict.
- Plain CSS in `src/styles/`, one file per concern, each inside its cascade layer (see `src/styles/globals.css`). No new color without a token in `tokens.css`.
- Server Components by default; a Client Component only where the browser is needed.
- Comments explain why, not what.

## Adding a section type

Follow [Add a section](../docs/add-a-section.md): schema, registration, types, renderer, Markdown, and content checks.

## Reporting

- Bugs and ideas: [open an issue](https://github.com/marcop135/nextfold/issues/new/choose).
- Security issues: never in a public issue. See [SECURITY.md](SECURITY.md).

By contributing you agree to the [Code of Conduct](CODE_OF_CONDUCT.md) and to license your work under the [MIT License](../LICENSE).
