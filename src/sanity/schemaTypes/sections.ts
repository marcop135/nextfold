import { defineArrayMember, defineField, defineType } from "sanity";
import { SECTION_SPACINGS, SECTION_THEMES } from "../../lib/design-tokens";

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
    defineField({ name: "eyebrow", type: "string", validation: (rule) => rule.max(40) }),
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "body", type: "text", rows: 3, validation: (rule) => rule.max(240) }),
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
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({
      name: "items",
      type: "array",
      validation: (rule) => rule.min(2).max(6),
      of: [
        defineArrayMember({
          name: "feature",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (rule) => rule.required().max(60) }),
            defineField({ name: "body", type: "text", rows: 2, validation: (rule) => rule.max(200) }),
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
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "body", type: "text", rows: 2, validation: (rule) => rule.max(200) }),
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
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({
      name: "items",
      type: "array",
      validation: (rule) => rule.min(2).max(8),
      of: [
        defineArrayMember({
          name: "step",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (rule) => rule.required().max(60) }),
            defineField({ name: "body", type: "text", rows: 2, validation: (rule) => rule.max(240) }),
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
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "body", type: "text", rows: 2, validation: (rule) => rule.max(240) }),
    defineField({
      name: "filename",
      title: "File name or label",
      type: "string",
      validation: (rule) => rule.required().max(80),
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
