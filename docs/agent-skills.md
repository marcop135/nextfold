# Agent skills

Markdown skills for Claude Code, Cursor, and Codex ship in the repo. Each one routes an agent to a how-to, names the trap, and lists the checks CI runs.

## The skills

| Skill | Use it to |
| --- | --- |
| `nextfold-add-section` | Add a section, block, or widget type |
| `nextfold-schema-change` | Rename, remove, or retype a field without losing published content |
| `nextfold-copy` | Change English and German copy together, or add a language |
| `nextfold-caching` | Keep Cache Components tags, drafts, and expiry correct |

What each skill follows:

- **nextfold-add-section:** [Add a section type](add-a-section.md#steps). For a widget: [For an interactive widget](add-a-section.md#for-an-interactive-widget).
- **nextfold-schema-change:** [Rename a field](sanity-setup.md#rename-a-field).
- **nextfold-copy:** seed pages in [`en.ts`](../src/content/seed/en.ts) and [`de.ts`](../src/content/seed/de.ts); fixed pages in [`static-pages.ts`](../src/content/static-pages.ts); UI strings in [`messages.ts`](../src/lib/messages.ts); German in [Address and typography](translation-glossary.md#address-and-typography); a new language in [Add a language](i18n.md#steps).
- **nextfold-caching:** [Caching](caching.md#cache-components), [Draft mode stays outside the cache](caching.md#draft-mode-stays-outside-the-cache), and [What expires a tag](caching.md#what-expires-a-tag).

## Where they live

| Path | Role |
| --- | --- |
| [`.agents/skills/`](../.agents/skills/) | Source of each `SKILL.md` |
| [`.claude/skills/`](../.claude/skills/) | Symlinks to that source |

| Tool | Reads |
| --- | --- |
| Claude Code | `.claude/skills/` |
| Codex | `.agents/skills/` |
| Cursor | Both |

## Add a skill

1. Create `.agents/skills/<name>/SKILL.md` with `name` (lowercase, hyphens, equal to the folder name) and `description`. Put the description in a `>-` block (or quote it) so a colon in the text does not break YAML.
2. Link the how-to instead of copying its steps.
3. From Git Bash, add a native symlink under `.claude/skills/` with `MSYS=winsymlinks:nativestrict ln -s` (WSL `ln -s` on `/mnt/c` makes a link Windows cannot read).
4. Add a row to the table above and a Follows bullet.
