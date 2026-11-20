import { defineArrayMember, defineField, defineType } from "sanity";
import { PAGE_RULES } from "../../lib/rules";
import { textRules } from "./text-rules";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => textRules(rule, PAGE_RULES.title) }),
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
      validation: (rule) => textRules(rule, PAGE_RULES.description),
    }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({ type: "hero" }),
        defineArrayMember({ type: "featureGrid" }),
        defineArrayMember({ type: "steps" }),
        defineArrayMember({ type: "codeSample" }),
        defineArrayMember({ type: "appBlock" }),
        defineArrayMember({ type: "callToAction" }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title, subtitle: slug === "home" ? "/" : `/${slug ?? ""}` }),
  },
});
