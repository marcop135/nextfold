# Changelog

- **Format:** Based on [Keep a Changelog](https://keepachangelog.com).
- **Voice:** Use the imperative, like a commit message. Write add, fix, increase, force, not added, fixed, increased, forced.
- **Length:** Keep each bullet on one line, max 120 characters (link URLs do not count toward the cap, only the visible text does).

## [Unreleased]

### Added

- Pages: Add How it's run, a page on hosting, DNS, security headers, analytics, CI, and the release flow.
- Pages: Add Caching, with a live inspector that shows when the page was cached and the headers of a fresh request.
- Pages: Add a Guardrails playground that checks a hero's fields with the Studio's own rules and messages.
- Pages: Add a "Things to try" section and a closing link to Inside a page on the home page.
- Site: Add German under /de, with a language switch, hreflang links, German Markdown twins, and German Open Graph cards.
- Site: Reorder the home hero's sections as an unpublished preview and watch the page follow.
- Studio: Give pages and site settings a language, with one desk list and one settings document per language.
- Studio: Add an app block section that places an interactive widget on a page.
- Studio: Let a feature card link to a page or an https:// address.
- Studio: Add a migration that marks pages saved before the language field as English, dry run first.
- Security: Publish `/.well-known/security.txt` and a security policy with a private reporting route.
- Docs: Add pages on caching, languages, translation, security, operations, Vercel, and Cloudflare.
- CI: Run CodeQL on every pull request and an OpenSSF Scorecard on `main`.
- CI: Smoke-test production weekly for status, headers, hreflang, and Markdown twins; open an issue on failure.
- CI: Check the bundled seed content against the schema's rules on every pull request.
- CI: Lint the changelog format on every pull request.

### Changed

- Pages: Rewrite the home page around three ways in for leads, developers, and agents.
- Pages: End Guardrails on a link to How it's run instead of a source file on GitHub.
- Pages: Link How it's run to the Vercel and Cloudflare docs, and mark English-only links on German pages.
- Site: Cache pages, Markdown, `llms.txt`, and the sitemap with Next.js Cache Components until a publish expires them.
- Site: Set headings smaller with a tighter line height.
- Site: Move the version number next to the footer mark.
- Studio: Read every text limit and its message from one rules file shared with the site.
- Brand: Replace the README header and Open Graph image with a Studio pane folding back to show its page.
- Security: Add Cross-Origin-Opener-Policy, X-Frame-Options, and a wider Permissions-Policy to site pages.
- Hosting: Run server functions in Frankfurt (`fra1`), next to the EU audience and analytics.
- Docs: Show the npm commands in the README quick start instead of a collapsed block.

### Fixed

- Site: Wrap long section headings in the home hero visual instead of cutting them off.

## [0.6.0] - 2026-11-19

### Added

- Site: Refresh pages, Markdown, `llms.txt`, and the sitemap from a signed Sanity publish webhook ([#56](https://github.com/marcop135/nextfold/pull/56)) ([#48](https://github.com/marcop135/nextfold/issues/48)).
- SEO: Give every page its own Open Graph and X card image with its heading and description ([#57](https://github.com/marcop135/nextfold/pull/57)) ([#49](https://github.com/marcop135/nextfold/issues/49)).
- Privacy: Serve `/.well-known/gpc.json` ([#58](https://github.com/marcop135/nextfold/pull/58)) ([#50](https://github.com/marcop135/nextfold/issues/50)).

### Changed

- Studio: Rename the hero's `cta` field to `link`, with a migration script that dry-runs first ([#55](https://github.com/marcop135/nextfold/pull/55)) ([#47](https://github.com/marcop135/nextfold/issues/47)).
- Privacy: Count visits that send Do Not Track or Global Privacy Control, and say so on the privacy page ([#58](https://github.com/marcop135/nextfold/pull/58)) ([#50](https://github.com/marcop135/nextfold/issues/50)).
- Site: Show the home page's sections as Studio rows beside the blocks they render, instead of code ([#59](https://github.com/marcop135/nextfold/pull/59)) ([#51](https://github.com/marcop135/nextfold/issues/51)).
- Pages: Replace JSON and TypeScript samples with plain descriptions of each field and rule ([#60](https://github.com/marcop135/nextfold/pull/60)) ([#52](https://github.com/marcop135/nextfold/issues/52)).
- Site: Restyle buttons with clear hover, focus, and pressed states in light and dark ([#61](https://github.com/marcop135/nextfold/pull/61)) ([#53](https://github.com/marcop135/nextfold/issues/53)).
- Agents: List the source code repository in `llms.txt` ([#62](https://github.com/marcop135/nextfold/pull/62)) ([#54](https://github.com/marcop135/nextfold/issues/54)).

### Fixed

- Markdown: Send the canonical HTML page in the `Link` header of every `.md` page ([#62](https://github.com/marcop135/nextfold/pull/62)) ([#54](https://github.com/marcop135/nextfold/issues/54)).
- SEO: Keep `.md` pages on preview deployments out of search ([#62](https://github.com/marcop135/nextfold/pull/62)) ([#54](https://github.com/marcop135/nextfold/issues/54)).
- A11y: Keep button arrows and the menu icon visible in forced colors ([#62](https://github.com/marcop135/nextfold/pull/62)) ([#54](https://github.com/marcop135/nextfold/issues/54)).
- A11y: Name scrollable code blocks as regions ([#62](https://github.com/marcop135/nextfold/pull/62)) ([#54](https://github.com/marcop135/nextfold/issues/54)).
- A11y: Keep focused elements clear of the draft mode bar ([#62](https://github.com/marcop135/nextfold/pull/62)) ([#54](https://github.com/marcop135/nextfold/issues/54)).

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
