# Add a section type

Add a new section editors can place on a page, with its rules, its HTML, and its Markdown version. The steps use a `quote` section as the example; replace `quote` and `Quote` with your type's name.

Read [Architecture: content model](architecture.md#content-model) first for how sections, rules, and components fit together.

## Steps

1. Define the schema in [`sections.ts`](../src/sanity/schemaTypes/sections.ts). Copy `steps`: keep `fieldsets: [STYLE]`, the shared `theme` and `spacing` fields, and a `preview`. Take every text limit from [`rules.ts`](../src/lib/rules.ts) through `textRules`, adding a rule there when none fits:

   ```ts
   export const quote = defineType({
     name: "quote",
     title: "Quote",
     type: "object",
     fieldsets: [STYLE],
     fields: [
       defineField({ name: "body", type: "text", rows: 3, validation: (rule) => textRules(rule, SECTION_RULES.shortBody) }),
       theme,
       spacing,
     ],
     preview: { select: { title: "body" }, prepare: ({ title }) => ({ title, subtitle: "Quote" }) },
   });
   ```

2. Register it: add `quote` to `schemaTypes` in [`schemaTypes/index.ts`](../src/sanity/schemaTypes/index.ts) and `defineArrayMember({ type: "quote" })` to `sections` in [`page.ts`](../src/sanity/schemaTypes/page.ts).
3. Regenerate the types, then add `export type QuoteSection = Keyed<Quote>;` to [`types.ts`](../src/sanity/types.ts):

   ```bash
   npm run typegen
   ```

4. Render it: add a `Quote` component and a `case "quote"` to the switch in [`SectionRenderer.tsx`](../src/components/sections/SectionRenderer.tsx). Styles go in [`src/styles/sections.css`](../src/styles/sections.css), inside its `components` layer, using the tokens in [`tokens.css`](../src/styles/tokens.css).
5. Give Markdown readers the same content: add a `case "quote"` in [`markdown.ts`](../src/lib/markdown.ts).
6. Check the seed copy against the rules: add a `case "quote"` in [`content-check.mjs`](../scripts/content-check.mjs). Without it, the check reports "Unknown section type." for any seed page that uses the section.
7. Name it in the home hero visual: add `quote` to `heroVisual.types` for every language in [`messages.ts`](../src/lib/messages.ts).
8. Run the checks CI runs:

   ```bash
   npm run typecheck
   npm run lint
   npm run content:check
   npm run build
   ```

Commit `schema.json` and `sanity.types.ts` with the change; CI fails when they differ from a fresh `npm run typegen`.

## For an interactive widget

A widget built in code, like the cache inspector, is an `appBlock` kind rather than a section type. Add it to [`app-blocks.ts`](../src/lib/app-blocks.ts) with the text Markdown readers get instead, put the component in [`components/app-blocks`](../src/components/app-blocks), and render it from `AppBlock` in [`SectionRenderer.tsx`](../src/components/sections/SectionRenderer.tsx).
