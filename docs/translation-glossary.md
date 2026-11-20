# Translation glossary

Terms for the German copy in [`seed/de.ts`](../src/content/seed/de.ts), [`messages.ts`](../src/lib/messages.ts), and [`static-pages.ts`](../src/content/static-pages.ts). English is the source; German is written from it, not word for word.

## Address and typography

| Rule | Value |
| --- | --- |
| Address | `Sie`, capitalised; most sentences avoid addressing the reader at all |
| Quotation marks | „…“ |
| Dashes | None as punctuation; use a comma, colon, or new sentence |
| Compounds with product names | Hyphenated: `Next.js-Website`, `Sanity-Datensatz` |

## Terms kept in English

Sanity Studio (with article: „das Sanity Studio“, „im Studio“), Schema, Markdown, Cache, Caching, CDN, Hero, Call to Action, Release, Release Notes, Pull Request, Branch, Commit, Tag, Deploy, CI, Lint, Header, Analytics, Repository, Issue, `llms.txt`.

## German terms

| English | German |
| --- | --- |
| section | Abschnitt |
| editor, editors | die Redaktion |
| developers | das Entwicklungsteam |
| feature grid | Kachelraster |
| card | Kachel |
| eyebrow | Dachzeile |
| heading | Überschrift |
| body | Text |
| required | Pflichtfeld |
| guardrails | Leitplanken |
| How it's run | So läuft der Betrieb (nav: Betrieb) |
| Inside a page | Eine Seite von innen (nav: Seite von innen) |
| For agents | Für Agenten |
| consent banner | Cookie-Banner |

## Review

Each German change gets three passes before merge: written from the approved English, reviewed by someone who did not write it (back-translation, glossary, grammar, the length limits in [`rules.ts`](../src/lib/rules.ts)), then read on the rendered page at phone width.
