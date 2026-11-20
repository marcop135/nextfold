import { defineField, defineType } from "sanity";
import { LINK_RULES, LINK_URL_LABEL, MESSAGES, checkHref } from "../../lib/rules";
import { textRules } from "./text-rules";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => textRules(rule, LINK_RULES.label) }),
    defineField({
      name: "href",
      title: "URL or path",
      type: "string",
      description: "A path such as /contact or a full https:// URL.",
      validation: (rule) => [
        rule.required().error(MESSAGES.required(LINK_URL_LABEL)),
        rule.custom((value: string | undefined) => checkHref(value) ?? true),
      ],
    }),
  ],
});
