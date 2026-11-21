import { COUNT_RULES, HERO_RULES, LINK_RULES, SECTION_RULES, type TextRule } from "./rules";
import type { Section } from "@/sanity/types";

/** One field as the Studio stores it: its text (or item count) against the limit the schema sets. */
export type AnatomyField = {
  id: "eyebrow" | "heading" | "body" | "link" | "cards" | "steps";
  value: string | null;
  length: number;
  max: number;
  min?: number;
  required: boolean;
};

export type AnatomySection = { key: string; type: string; heading: string; fields: AnatomyField[] };

const text = (id: AnatomyField["id"], value: string | null | undefined, rule: TextRule): AnatomyField => ({
  id,
  value: value ?? null,
  length: value?.length ?? 0,
  max: rule.max,
  min: rule.min,
  required: rule.required,
});

const count = (id: "cards" | "steps", length: number): AnatomyField => ({
  id,
  value: null,
  length,
  max: COUNT_RULES[id].max,
  min: COUNT_RULES[id].min,
  required: true,
});

/**
 * The page's own sections reduced to what the Page anatomy widget shows: each field's value and length
 * beside the limit in rules.ts. Built on the server, so the widget gets plain data and no schema code.
 * App blocks are left out: their only field is the widget's name.
 */
export function anatomyOf(sections: Section[]): AnatomySection[] {
  return sections.flatMap((section): AnatomySection[] => {
    const base = { key: section._key, type: section._type };
    switch (section._type) {
      case "hero":
        return [
          {
            ...base,
            heading: section.heading,
            fields: [
              text("eyebrow", section.eyebrow, HERO_RULES.eyebrow),
              text("heading", section.heading, HERO_RULES.heading),
              text("body", section.body, HERO_RULES.body),
              ...(section.link ? [text("link", section.link.label, LINK_RULES.label)] : []),
            ],
          },
        ];
      case "featureGrid":
        return [
          {
            ...base,
            heading: section.heading,
            fields: [text("heading", section.heading, SECTION_RULES.heading), count("cards", section.items?.length ?? 0)],
          },
        ];
      case "steps":
        return [
          {
            ...base,
            heading: section.heading,
            fields: [text("heading", section.heading, SECTION_RULES.heading), count("steps", section.items?.length ?? 0)],
          },
        ];
      case "callToAction":
        return [
          {
            ...base,
            heading: section.heading,
            fields: [
              text("heading", section.heading, SECTION_RULES.heading),
              text("body", section.body, SECTION_RULES.shortBody),
              text("link", section.link.label, LINK_RULES.label),
            ],
          },
        ];
      default:
        return [];
    }
  });
}
