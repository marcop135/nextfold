---
name: nextfold-add-section
description: >-
  Adds a section type editors can place on a Next Fold page: schema, registration, types, renderer, Markdown twin, seed check, and hero visual. Use when asked to add, create, or build a section, block, or widget type in this repo.
---

# Add a section type

## When to use

Adding a new section, block, or widget type editors can place on a page.

## Follow

- [Add a section type: Steps](../../../docs/add-a-section.md#steps)
- Widgets: [For an interactive widget](../../../docs/add-a-section.md#for-an-interactive-widget)

## Traps

- Stopping after the renderer: the `markdown.ts`, `content-check.mjs`, and `messages.ts` cases get skipped.
- Text limits come from [`src/lib/rules.ts`](../../../src/lib/rules.ts), never inline numbers.

## Done when

```bash
npm run typegen
npm run typecheck
npm run lint
npm run content:check
npm run build
```

Commit `src/sanity/schema.json` and `src/sanity/sanity.types.ts` (CI diffs them).
