---
name: nextfold-schema-change
description: >-
  Changes the Next Fold Sanity schema without losing published content: renaming, removing, or retyping a field, with a query fallback, typegen, and a dry-run migration. Use when asked to rename, remove, or change a field or document type.
---

# Change a Sanity schema field

## When to use

Renaming, removing, or retyping a Sanity field or document type without losing published content.

## Follow

- [Rename a field](../../../docs/sanity-setup.md#rename-a-field)

## Traps

- Stored documents keep the old field name until a migration moves the data.
- Never run `--no-dry-run` before reading the dry run.
- Drop the query fallback only after the apply.

## Done when

```bash
npm run typegen
npm run typecheck
npm run content:check
```

Run `npm run typegen` after the rename, and again after dropping the fallback.
