import { defineArrayMember, defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string", validation: (rule) => rule.max(40) }),
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "body", type: "text", rows: 3, validation: (rule) => rule.max(240) }),
    defineField({ name: "cta", title: "Call to action", type: "link" }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title, subtitle: "Hero" }),
  },
});

export const featureGrid = defineType({
  name: "featureGrid",
  title: "Feature grid",
  type: "object",
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
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "body", type: "text", rows: 2, validation: (rule) => rule.max(200) }),
    defineField({ name: "link", type: "link", validation: (rule) => rule.required() }),
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
  ],
  preview: {
    select: { title: "heading", filename: "filename" },
    prepare: ({ title, filename }) => ({ title, subtitle: `Code sample, ${filename ?? ""}` }),
  },
});
