import { defineArrayMember, defineField, defineType } from "sanity";
import { PAGE_RULES } from "../../lib/rules";
import { isUniqueInLanguage, languageField } from "./language";
import { textRules } from "./text-rules";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    languageField,
    defineField({ name: "title", type: "string", validation: (rule) => textRules(rule, PAGE_RULES.title) }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Use home for the front page.",
      options: { source: "title", maxLength: 64, isUnique: isUniqueInLanguage },
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
    select: { title: "title", slug: "slug.current", language: "language" },
    prepare: ({ title, slug, language }) => {
      const prefix = language && language !== "en" ? `/${language}` : "";
      return { title, subtitle: slug === "home" ? prefix || "/" : `${prefix}/${slug ?? ""}` };
    },
  },
});
