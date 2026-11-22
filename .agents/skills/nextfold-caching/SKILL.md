---
name: nextfold-caching
description: >-
  Keeps the Next Fold Cache Components setup correct: data reads inside 'use cache' with the right tags, drafts outside the cache, and tag expiry on publish. Use when adding a data read, page, or route, or when a page shows stale or draft content.
---

# Caching

## When to use

Adding a data read, page, or route, or when a page shows stale or draft content.

## Follow

- [Cache Components](../../../docs/caching.md#cache-components)
- [Draft mode stays outside the cache](../../../docs/caching.md#draft-mode-stays-outside-the-cache)
- [What expires a tag](../../../docs/caching.md#what-expires-a-tag)

## Traps

- Entries never expire on a timer, only through tags (`page:<slug>`, `page-list`, `settings`).
- A read without its tag stays stale in production.
- `draftMode()` and cookies are read outside the cache boundary and passed in.
- Route handlers call a cached helper.

## Done when

```bash
npm run build
npm start
npm run smoke -- http://localhost:3100
```

Without the URL, smoke checks production.
