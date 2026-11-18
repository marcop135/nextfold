import { defineArrayMember, defineField, defineType } from "sanity";

/** One document, id `siteSettings`, opened from the Studio desk; never created from the New document menu. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({
      name: "nav",
      title: "Main navigation",
      description: "Header links, also listed under Explore in the footer after Home.",
      type: "array",
      group: "header",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: "footerNote",
      title: "Footer note",
      description: "One line next to the version number.",
      type: "string",
      group: "footer",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "projectLinks",
      title: "Project links",
      description: "Listed under Project, after View the source.",
      type: "array",
      group: "footer",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(5),
    }),
    defineField({
      name: "siteInfoLinks",
      title: "Site info links",
      description: "Listed under Site info, before llms.txt.",
      type: "array",
      group: "footer",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(5),
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
