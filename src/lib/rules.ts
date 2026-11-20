/**
 * Every text limit in the content model, with its message. The Sanity schema, the Guardrails
 * playground, and `npm run content:check` all read this file, so a limit changes in one place.
 * Plain data and functions: no Sanity import, so the browser bundle stays small.
 */
export type TextRule = { label: string; max: number; min?: number; required: boolean };
export type CountRule = { label: string; min: number; max: number };

const text = (label: string, max: number, required = false, min?: number): TextRule => ({ label, max, required, min });

export const PAGE_RULES = {
  title: text("Title", 60, true),
  description: text("Meta description", 160, true, 70),
};

export const HERO_RULES = {
  eyebrow: text("Eyebrow", 40),
  heading: text("Heading", 80, true),
  body: text("Body", 240),
};

export const LINK_RULES = {
  label: text("Link label", 40, true),
};

export const SECTION_RULES = {
  heading: text("Heading", 80, true),
  shortBody: text("Body", 200),
  longBody: text("Body", 240),
  cardTitle: text("Card title", 60, true),
  cardBody: text("Card body", 200),
  stepTitle: text("Step title", 60, true),
  stepBody: text("Step body", 240),
  filename: text("File name or label", 80, true),
};

export const COUNT_RULES = {
  cards: { label: "Cards", min: 2, max: 6 },
  steps: { label: "Steps", min: 2, max: 8 },
} satisfies Record<string, CountRule>;

export const LINK_URL_LABEL = "Link URL";

export const MESSAGES = {
  required: (label: string) => `${label} is required.`,
  tooLong: (label: string, max: number) => `${label} stops at ${max} characters.`,
  tooShort: (label: string, min: number) => `${label} needs at least ${min} characters.`,
  count: (label: string, min: number, max: number) => `${label}: between ${min} and ${max}.`,
  href: "Start with / or https://",
} as const;

/** The message the Studio shows for a text field, or null when it passes. */
export function checkText(value: string | null | undefined, rule: TextRule): string | null {
  const value_ = value ?? "";
  if (rule.required && value_.trim() === "") return MESSAGES.required(rule.label);
  if (value_ && rule.min !== undefined && value_.length < rule.min) return MESSAGES.tooShort(rule.label, rule.min);
  if (value_.length > rule.max) return MESSAGES.tooLong(rule.label, rule.max);
  return null;
}

export function checkCount(items: unknown[] | null | undefined, rule: CountRule): string | null {
  const count = items?.length ?? 0;
  return count < rule.min || count > rule.max ? MESSAGES.count(rule.label, rule.min, rule.max) : null;
}

/** A link target is a path on this site or an https:// address. */
export function checkHref(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.startsWith("/") || value.startsWith("https://") ? null : MESSAGES.href;
}

/** The link target as the Studio checks it: required, then the format. */
export function checkLinkUrl(value: string | null | undefined): string | null {
  return (value ?? "").trim() === "" ? MESSAGES.required(LINK_URL_LABEL) : checkHref(value);
}
