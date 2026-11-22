---
name: nextfold-copy
description: >-
  Edits Next Fold copy in English and German together: seed pages, the fixed For agents and Privacy pages, and UI strings, within the Studio text limits and the German glossary. Also adds a language. Use when asked to change text, wording, headings, or translations, or to add a language.
---

# Edit copy and translations

## When to use

Changing text, wording, headings, or translations, or adding a language.

## Follow

- Seed pages: [`src/content/seed/en.ts`](../../../src/content/seed/en.ts), [`de.ts`](../../../src/content/seed/de.ts)
- Fixed pages: [`src/content/static-pages.ts`](../../../src/content/static-pages.ts)
- UI strings: [`src/lib/messages.ts`](../../../src/lib/messages.ts)
- German: [Address and typography](../../../docs/translation-glossary.md#address-and-typography)
- New language: [Add a language: Steps](../../../docs/i18n.md#steps)

## Traps

- Editing English only.
- Breaking a limit in [`rules.ts`](../../../src/lib/rules.ts).
- German: `Sie`, „…“ quotes, no dashes as punctuation, glossary terms.
- A seed edit does not show on a page that is published in Sanity (Sanity wins, the seed is the fallback).
- `content:check` checks the seed only.

## Done when

```bash
npm run content:check
npm run typecheck
npm run test:e2e
```

For a new language also `npm run typegen` (the `language` options change) and `npm run build`.
