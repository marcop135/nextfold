import { defineField, defineType } from "sanity";
import { SEO_RULES } from "../../lib/rules";
import { textRules } from "./text-rules";

export const seo = defineType({
  name: "seo",
  title: "Search and sharing",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description: "Overrides the page title in search results and link previews. Empty uses the page title.",
      validation: (rule) => textRules(rule, SEO_RULES.title),
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "Adds noindex. The page stays reachable by its URL.",
      initialValue: false,
    }),
  ],
  options: { collapsible: true, collapsed: true },
});
