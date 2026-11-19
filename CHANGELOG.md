# Changelog

- **Format:** Based on [Keep a Changelog](https://keepachangelog.com).
- **Voice:** Use the imperative, like a commit message. Write add, fix, increase, force, not added, fixed, increased, forced.
- **Length:** Keep each bullet on one line, max 120 characters (link URLs do not count toward the cap, only the visible text does).

## [Unreleased]

### Changed

- Studio: Rename the hero's `cta` field to `link`, with a migration script that dry-runs first ([#55](https://github.com/marcop135/nextfold/pull/55)) ([#47](https://github.com/marcop135/nextfold/issues/47)).

## [0.5.0] - 2026-11-19

### Added

- Studio: Preview drafts in Presentation with click-to-edit overlays ([#41](https://github.com/marcop135/nextfold/pull/41)) ([#36](https://github.com/marcop135/nextfold/issues/36)).
- Studio: Add a hero image with hotspot and crop, served at 4:3 from the Sanity image CDN ([#43](https://github.com/marcop135/nextfold/pull/43)) ([#37](https://github.com/marcop135/nextfold/issues/37)).
- Studio: Set a section's background and spacing from the design token names in the CSS ([#44](https://github.com/marcop135/nextfold/pull/44)) ([#38](https://github.com/marcop135/nextfold/issues/38)).

### Changed

- Site: Refresh published content through the Live Content API instead of every 60 seconds ([#41](https://github.com/marcop135/nextfold/pull/41)) ([#36](https://github.com/marcop135/nextfold/issues/36)).

## [0.4.1] - 2026-11-19

### Changed

- Site: Present the demo as typed sections, the schema, and Studio ([#35](https://github.com/marcop135/nextfold/pull/35)) ([#34](https://github.com/marcop135/nextfold/issues/34)).

## [0.4.0] - 2026-11-18

### Added

- CI: Run lint, typecheck, and build on every PR; add Dependabot ([#23](https://github.com/marcop135/nextfold/pull/23)) ([#16](https://github.com/marcop135/nextfold/issues/16)).
- Site: Add a mobile menu and animated hero intros ([#24](https://github.com/marcop135/nextfold/pull/24)) ([#17](https://github.com/marcop135/nextfold/issues/17)).
- Docs: Add an index of the docs pages ([#25](https://github.com/marcop135/nextfold/pull/25)) ([#22](https://github.com/marcop135/nextfold/issues/22)).
- CI: Fail a PR when committed Sanity types are stale ([#29](https://github.com/marcop135/nextfold/pull/29)) ([#20](https://github.com/marcop135/nextfold/issues/20)).
- Studio: Add a site settings document that drives the header and footer ([#30](https://github.com/marcop135/nextfold/pull/30)) ([#21](https://github.com/marcop135/nextfold/issues/21)).
- Content: Add `npm run seed:import` to copy the seed pages into a Sanity dataset ([#30](https://github.com/marcop135/nextfold/pull/30)) ([#21](https://github.com/marcop135/nextfold/issues/21)).

### Changed

- Site: Rename Anatomy to Inside a page at /inside-a-page, with redirects from /anatomy ([#27](https://github.com/marcop135/nextfold/pull/27)) ([#19](https://github.com/marcop135/nextfold/issues/19)).
- Types: Generate Sanity types with TypeGen ([#29](https://github.com/marcop135/nextfold/pull/29)) ([#20](https://github.com/marcop135/nextfold/issues/20)).

## [0.2.0] - 2026-11-18

### Added

- Pages: Add Anatomy and Guardrails pages, plus steps and code sample sections ([#11](https://github.com/marcop135/nextfold/pull/11)) ([#7](https://github.com/marcop135/nextfold/issues/7)).
- Favicon: Add a light and dark favicon ([#13](https://github.com/marcop135/nextfold/pull/13)) ([#8](https://github.com/marcop135/nextfold/issues/8)).

### Changed

- Brand: Replace the README and Open Graph images ([#9](https://github.com/marcop135/nextfold/pull/9)) ([#4](https://github.com/marcop135/nextfold/issues/4)).
- README: Add demo links and a numbered content flow ([#10](https://github.com/marcop135/nextfold/pull/10)) ([#5](https://github.com/marcop135/nextfold/issues/5)).
- Footer: Restructure the footer into link columns ([#12](https://github.com/marcop135/nextfold/pull/12)) ([#6](https://github.com/marcop135/nextfold/issues/6)).

## [0.1.0] - 2026-11-17

### Added

- Site: Add a Next.js site built from Sanity sections, with Studio at `/studio` ([#2](https://github.com/marcop135/nextfold/pull/2)) ([#1](https://github.com/marcop135/nextfold/issues/1)).
- SEO: Add Markdown pages, `llms.txt`, a sitemap, robots rules, JSON-LD, and an Open Graph image ([#2](https://github.com/marcop135/nextfold/pull/2)) ([#1](https://github.com/marcop135/nextfold/issues/1)).
- Pages: Add Privacy and For agents pages and cookieless Matomo analytics ([#2](https://github.com/marcop135/nextfold/pull/2)) ([#1](https://github.com/marcop135/nextfold/issues/1)).
- Docs: Document Sanity setup and the architecture ([#2](https://github.com/marcop135/nextfold/pull/2)) ([#1](https://github.com/marcop135/nextfold/issues/1)).
