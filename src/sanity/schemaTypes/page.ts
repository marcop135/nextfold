import { defineArrayMember, defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required().max(60) }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Use home for the front page.",
      options: { source: "title", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().min(70).max(160),
    }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({ type: "hero" }),
        defineArrayMember({ type: "featureGrid" }),
        defineArrayMember({ type: "steps" }),
        defineArrayMember({ type: "codeSample" }),
        defineArrayMember({ type: "callToAction" }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title, subtitle: slug === "home" ? "/" : `/${slug ?? ""}` }),
  },
});
