import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required().max(40) }),
    defineField({
      name: "href",
      title: "URL or path",
      type: "string",
      description: "A path such as /contact or a full https:// URL.",
      validation: (rule) =>
        rule.required().custom((value) =>
          !value || value.startsWith("/") || value.startsWith("https://")
            ? true
            : "Start with / or https://",
        ),
    }),
  ],
});
