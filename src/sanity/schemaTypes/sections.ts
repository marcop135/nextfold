import { defineArrayMember, defineField, defineType } from "sanity";
import { SECTION_SPACINGS, SECTION_THEMES } from "../../lib/design-tokens";
import { APP_BLOCKS, APP_BLOCK_KINDS } from "../../lib/app-blocks";
import { COUNT_RULES, HERO_RULES, SECTION_RULES } from "../../lib/rules";
import { countRules, textRules } from "./text-rules";

const STYLE = { name: "style", title: "Style", options: { collapsible: true, collapsed: true } };

const theme = defineField({
  name: "theme",
  type: "string",
  description: "Background, from the design tokens. Empty keeps the page background.",
  fieldset: "style",
  options: { list: [...SECTION_THEMES], layout: "radio" },
});

const spacing = defineField({
  name: "spacing",
  type: "string",
  description: "Space above and below, from the design tokens. Empty keeps the default.",
  fieldset: "style",
  options: { list: [...SECTION_SPACINGS], layout: "radio" },
});

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fieldsets: [STYLE],
  fields: [
    defineField({ name: "eyebrow", type: "string", validation: (rule) => textRules(rule, HERO_RULES.eyebrow) }),
    defineField({ name: "heading", type: "string", validation: (rule) => textRules(rule, HERO_RULES.heading) }),
    defineField({ name: "body", type: "text", rows: 3, validation: (rule) => textRules(rule, HERO_RULES.body) }),
    defineField({ name: "link", title: "Call to action", type: "link" }),
    defineField({
      name: "image",
      type: "image",
      description: "Shown beside the text at 4:3. Set the hotspot on the subject; the crop follows it.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "What the image shows, for screen readers and Markdown.",
          validation: (rule) =>
            rule.max(160).custom((alt, context) => {
              const image = context.parent as { asset?: unknown } | undefined;
              return image?.asset && !alt ? "Describe the image" : true;
            }),
        }),
      ],
    }),
    theme,
    spacing,
  ],
  preview: {
    select: { title: "heading", media: "image" },
    prepare: ({ title, media }) => ({ title, subtitle: "Hero", media }),
  },
});

export const featureGrid = defineType({
  name: "featureGrid",
  title: "Feature grid",
  type: "object",
  fieldsets: [STYLE],
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => textRules(rule, SECTION_RULES.heading) }),
    defineField({
      name: "items",
      type: "array",
      validation: (rule) => countRules(rule, COUNT_RULES.cards),
      of: [
        defineArrayMember({
          name: "feature",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (rule) => textRules(rule, SECTION_RULES.cardTitle) }),
            defineField({ name: "body", type: "text", rows: 2, validation: (rule) => textRules(rule, SECTION_RULES.cardBody) }),
            defineField({ name: "link", type: "link", description: "Optional. Where the card leads." }),
          ],
        }),
      ],
    }),
    theme,
    spacing,
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title,
      subtitle: `Feature grid, ${Array.isArray(items) ? items.length : 0} items`,
    }),
  },
});

export const callToAction = defineType({
  name: "callToAction",
  title: "Call to action",
  type: "object",
  fieldsets: [STYLE],
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => textRules(rule, SECTION_RULES.heading) }),
    defineField({ name: "body", type: "text", rows: 2, validation: (rule) => textRules(rule, SECTION_RULES.shortBody) }),
    defineField({ name: "link", type: "link", validation: (rule) => rule.required() }),
    spacing,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title, subtitle: "Call to action" }),
  },
});

export const steps = defineType({
  name: "steps",
  title: "Steps",
  type: "object",
  fieldsets: [STYLE],
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => textRules(rule, SECTION_RULES.heading) }),
    defineField({
      name: "items",
      type: "array",
      validation: (rule) => countRules(rule, COUNT_RULES.steps),
      of: [
        defineArrayMember({
          name: "step",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (rule) => textRules(rule, SECTION_RULES.stepTitle) }),
            defineField({ name: "body", type: "text", rows: 2, validation: (rule) => textRules(rule, SECTION_RULES.stepBody) }),
          ],
        }),
      ],
    }),
    theme,
    spacing,
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title,
      subtitle: `Steps, ${Array.isArray(items) ? items.length : 0} items`,
    }),
  },
});

export const codeSample = defineType({
  name: "codeSample",
  title: "Code sample",
  type: "object",
  fieldsets: [STYLE],
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => textRules(rule, SECTION_RULES.heading) }),
    defineField({ name: "body", type: "text", rows: 2, validation: (rule) => textRules(rule, SECTION_RULES.longBody) }),
    defineField({
      name: "filename",
      title: "File name or label",
      type: "string",
      validation: (rule) => textRules(rule, SECTION_RULES.filename),
    }),
    defineField({
      name: "language",
      type: "string",
      options: { list: ["json", "ts", "groq", "bash"] },
      initialValue: "ts",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "code", type: "text", rows: 12, validation: (rule) => rule.required().max(4000) }),
    theme,
    spacing,
  ],
  preview: {
    select: { title: "heading", filename: "filename" },
    prepare: ({ title, filename }) => ({ title, subtitle: `Code sample, ${filename ?? ""}` }),
  },
});

export const appBlock = defineType({
  name: "appBlock",
  title: "App block",
  type: "object",
  description: "An interactive widget built in code. Pick which one; the developers own how it works.",
  fieldsets: [STYLE],
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => textRules(rule, SECTION_RULES.heading) }),
    defineField({ name: "body", type: "text", rows: 2, validation: (rule) => textRules(rule, SECTION_RULES.longBody) }),
    defineField({
      name: "kind",
      title: "Widget",
      type: "string",
      options: { list: APP_BLOCK_KINDS.map((value) => ({ value, title: APP_BLOCKS[value].title })), layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    theme,
    spacing,
  ],
  preview: {
    select: { title: "heading", kind: "kind" },
    prepare: ({ title, kind }) => ({
      title,
      subtitle: `App block, ${APP_BLOCKS[kind as keyof typeof APP_BLOCKS]?.title ?? "no widget"}`,
    }),
  },
});
