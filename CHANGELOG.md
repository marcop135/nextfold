# Changelog

- **Format:** Based on [Keep a Changelog](https://keepachangelog.com).
- **Voice:** Use the imperative, like a commit message. Write add, fix, increase, force, not added, fixed, increased, forced.
- **Length:** Keep each bullet on one line, max 120 characters (link URLs do not count toward the cap, only the visible text does).

## [Unreleased]

## [0.9.0] - 2026-11-22

### Added

- Repo: Add agent skills for Claude Code, Cursor, and Codex that route to the how-to docs ([#115](https://github.com/marcop135/nextfold/pull/115)) ([#114](https://github.com/marcop135/nextfold/issues/114)).
- Docs: Add a Features list to the README ([#115](https://github.com/marcop135/nextfold/pull/115)) ([#114](https://github.com/marcop135/nextfold/issues/114)).

### Changed

- Brand: Set the README header stack line to Next.js + Sanity CMS Demo, and lighten the wordmark ([#115](https://github.com/marcop135/nextfold/pull/115)) ([#114](https://github.com/marcop135/nextfold/issues/114)).

## [0.8.0] - 2026-11-21

### Added

- Pages: Add a page anatomy widget to Inside a page: each section's fields against their Studio limits ([#106](https://github.com/marcop135/nextfold/pull/106)) ([#100](https://github.com/marcop135/nextfold/issues/100)).
- Site: Fade content in on scroll, except on For agents and Privacy, and never with reduced motion ([#106](https://github.com/marcop135/nextfold/pull/106)) ([#100](https://github.com/marcop135/nextfold/issues/100)).
- Site: Add a web manifest and icons for saved shortcuts, with no install prompt ([#107](https://github.com/marcop135/nextfold/pull/107)) ([#101](https://github.com/marcop135/nextfold/issues/101)).
- Site: Match the browser theme color to the header in light mode ([#106](https://github.com/marcop135/nextfold/pull/106)) ([#100](https://github.com/marcop135/nextfold/issues/100)).
- Repo: Add a contributing guide, code of conduct, issue forms, a pull request template, and code owners ([#108](https://github.com/marcop135/nextfold/pull/108)) ([#102](https://github.com/marcop135/nextfold/issues/102)).
- CI: Test every page and the three widgets in Chrome with Playwright and axe, in English and German ([#110](https://github.com/marcop135/nextfold/pull/110)) ([#104](https://github.com/marcop135/nextfold/issues/104)).
- Docs: Add a how-to for new section types, and index the docs by reader need ([#108](https://github.com/marcop135/nextfold/pull/108)) ([#102](https://github.com/marcop135/nextfold/issues/102)).

### Changed

- Pages: Redraw the cache inspector as stat tiles, a page list, and per-page timing bars ([#106](https://github.com/marcop135/nextfold/pull/106)) ([#100](https://github.com/marcop135/nextfold/issues/100)).
- Pages: Make whole feature cards clickable, with a hover lift, and set their links in regular weight ([#106](https://github.com/marcop135/nextfold/pull/106)) ([#100](https://github.com/marcop135/nextfold/issues/100)).
- Pages: Simplify the home hero visual and shorten the home intro to a one-line Sanity CMS demo pitch ([#106](https://github.com/marcop135/nextfold/pull/106)) ([#100](https://github.com/marcop135/nextfold/issues/100)).
- Privacy: Open with site, controller, and contact; give each purpose a heading; date it last ([#106](https://github.com/marcop135/nextfold/pull/106)) ([#100](https://github.com/marcop135/nextfold/issues/100)).
- Site: Link Documentation to the docs index on GitHub ([#106](https://github.com/marcop135/nextfold/pull/106)) ([#100](https://github.com/marcop135/nextfold/issues/100)).
- Brand: Simplify the README header for small screens and darken the Open Graph tagline ([#109](https://github.com/marcop135/nextfold/pull/109)) ([#103](https://github.com/marcop135/nextfold/issues/103)).

### Fixed

- Site: Stop the hero intro from replaying, and content from flickering, on every client-side page change ([#106](https://github.com/marcop135/nextfold/pull/106)) ([#100](https://github.com/marcop135/nextfold/issues/100)).
- A11y: Move focus to the first invalid field when Publish is blocked in the guardrails playground ([#106](https://github.com/marcop135/nextfold/pull/106)) ([#100](https://github.com/marcop135/nextfold/issues/100)).

### Security

- Deps: Patch minimatch under the Sanity CLI, and update Sanity and next-sanity within their majors ([#111](https://github.com/marcop135/nextfold/pull/111)) ([#105](https://github.com/marcop135/nextfold/issues/105)).

## [0.7.2] - 2026-11-20

### Security

- Deps: Patch js-yaml 3.15.2 and smol-toml 1.9.1 under the Sanity CLI ([#96](https://github.com/marcop135/nextfold/pull/96)) ([#95](https://github.com/marcop135/nextfold/issues/95)).

## [0.7.1] - 2026-11-20

### Changed

- Brand: Redraw the README header around the demo pages ([#90](https://github.com/marcop135/nextfold/pull/90)) ([#89](https://github.com/marcop135/nextfold/issues/89)).
- Brand: Add CMS to the Open Graph line and sharpen its red heading ([#90](https://github.com/marcop135/nextfold/pull/90)) ([#89](https://github.com/marcop135/nextfold/issues/89)).

## [0.7.0] - 2026-11-20

### Added

- Pages: Add How it's run, a page on hosting, DNS, security headers, analytics, CI, and the release flow ([#76](https://github.com/marcop135/nextfold/pull/76)) ([#65](https://github.com/marcop135/nextfold/issues/65)).
- Pages: Add Caching, with a live inspector for a page's cache result, headers, and timing ([#78](https://github.com/marcop135/nextfold/pull/78)) ([#67](https://github.com/marcop135/nextfold/issues/67)).
- Pages: Add a Guardrails playground that checks a hero's fields with the Studio's own rules and messages ([#77](https://github.com/marcop135/nextfold/pull/77)) ([#66](https://github.com/marcop135/nextfold/issues/66)).
- Site: Add German under /de, with a language switch, hreflang, Markdown twins, and Open Graph cards ([#79](https://github.com/marcop135/nextfold/pull/79)) ([#68](https://github.com/marcop135/nextfold/issues/68)).
- Site: Reorder the home hero's Studio rows as a draft, then publish to update the page beside them ([#77](https://github.com/marcop135/nextfold/pull/77)) ([#66](https://github.com/marcop135/nextfold/issues/66)).
- Studio: Give pages and site settings a language, with a per-language desk list and a migration ([#79](https://github.com/marcop135/nextfold/pull/79)) ([#68](https://github.com/marcop135/nextfold/issues/68)).
- Studio: Add an app block section for interactive widgets, and optional links on feature cards ([#77](https://github.com/marcop135/nextfold/pull/77)) ([#66](https://github.com/marcop135/nextfold/issues/66)).
- Security: Add `security.txt`, a security policy, COOP, X-Frame-Options, and Permissions-Policy ([#81](https://github.com/marcop135/nextfold/pull/81)) ([#70](https://github.com/marcop135/nextfold/issues/70)).
- Docs: Add pages on caching, languages, translation, security, operations, Vercel, and Cloudflare ([#85](https://github.com/marcop135/nextfold/pull/85)) ([#74](https://github.com/marcop135/nextfold/issues/74)).
- CI: Run CodeQL, OpenSSF Scorecard, and changelog and seed content checks; smoke-test production weekly ([#82](https://github.com/marcop135/nextfold/pull/82)) ([#71](https://github.com/marcop135/nextfold/issues/71)).

### Changed

- Pages: Rewrite the home page around three ways in, things to try, and a closing link to Inside a page ([#76](https://github.com/marcop135/nextfold/pull/76)) ([#65](https://github.com/marcop135/nextfold/issues/65)).
- Pages: End Guardrails on a link to How it's run instead of a source file on GitHub ([#76](https://github.com/marcop135/nextfold/pull/76)) ([#65](https://github.com/marcop135/nextfold/issues/65)).
- Site: Cache pages, Markdown, `llms.txt`, and the sitemap with Cache Components until a publish expires them ([#78](https://github.com/marcop135/nextfold/pull/78)) ([#67](https://github.com/marcop135/nextfold/issues/67)).
- Site: Set headings smaller and tighter, and link the footer version to its release notes ([#85](https://github.com/marcop135/nextfold/pull/85)) ([#74](https://github.com/marcop135/nextfold/issues/74)).
- Studio: Read every text limit and its message from one rules file shared with the site ([#77](https://github.com/marcop135/nextfold/pull/77)) ([#66](https://github.com/marcop135/nextfold/issues/66)).
- Brand: Replace the README header and Open Graph image with the Next Fold mark, name, and one line ([#80](https://github.com/marcop135/nextfold/pull/80)) ([#69](https://github.com/marcop135/nextfold/issues/69)).
- Hosting: Run server functions in Frankfurt (`fra1`), next to the EU audience and analytics ([#81](https://github.com/marcop135/nextfold/pull/81)) ([#70](https://github.com/marcop135/nextfold/issues/70)).
- Privacy: Shorten the privacy notice and state that the browser connects to Sanity for live updates ([#85](https://github.com/marcop135/nextfold/pull/85)) ([#74](https://github.com/marcop135/nextfold/issues/74)).

### Fixed

- Site: Wrap long section headings in the home hero visual instead of cutting them off ([#76](https://github.com/marcop135/nextfold/pull/76)) ([#65](https://github.com/marcop135/nextfold/issues/65)).
- A11y: Keep keyboard focus in the hero visual, playground, and cache inspector when buttons change ([#86](https://github.com/marcop135/nextfold/pull/86)) ([#75](https://github.com/marcop135/nextfold/issues/75)).
- Site: Keep query strings and anchors on links that switch language ([#86](https://github.com/marcop135/nextfold/pull/86)) ([#75](https://github.com/marcop135/nextfold/issues/75)).
- SEO: Use one form of the home URL across canonical, sitemap, Markdown links, and JSON-LD ([#86](https://github.com/marcop135/nextfold/pull/86)) ([#75](https://github.com/marcop135/nextfold/issues/75)).

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
