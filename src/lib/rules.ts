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

export const MESSAGES: Messages & { count: (label: string, min: number, max: number) => string } = {
  required: (label: string) => `${label} is required.`,
  tooLong: (label: string, max: number) => `${label} stops at ${max} characters.`,
  tooShort: (label: string, min: number) => `${label} needs at least ${min} characters.`,
  count: (label: string, min: number, max: number) => `${label}: between ${min} and ${max}.`,
  href: "Start with / or https://",
};

export type Messages = {
  required: (label: string) => string;
  tooLong: (label: string, max: number) => string;
  tooShort: (label: string, min: number) => string;
  href: string;
};

/** The message for a text field, or null when it passes. The Studio uses the English MESSAGES and labels. */
export function checkText(
  value: string | null | undefined,
  rule: TextRule,
  messages: Messages = MESSAGES,
  label: string = rule.label,
): string | null {
  const text = value ?? "";
  if (rule.required && text.trim() === "") return messages.required(label);
  if (text && rule.min !== undefined && text.length < rule.min) return messages.tooShort(label, rule.min);
  if (text.length > rule.max) return messages.tooLong(label, rule.max);
  return null;
}

export function checkCount(items: unknown[] | null | undefined, rule: CountRule): string | null {
  const count = items?.length ?? 0;
  return count < rule.min || count > rule.max ? MESSAGES.count(rule.label, rule.min, rule.max) : null;
}

/** A link target is a path on this site or an https:// address. */
export function checkHref(value: string | null | undefined, messages: Messages = MESSAGES): string | null {
  if (!value) return null;
  if (/[\\\r\n\t]/.test(value)) return messages.href;
  if (value.startsWith("/") && !value.startsWith("//")) return null;
  if (!value.startsWith("https://") || value[8] === "/") return messages.href;
  try {
    return new URL(value).hostname ? null : messages.href;
  } catch {
    return messages.href;
  }
}

/** The link target as the Studio checks it: required, then the format. */
export function checkLinkUrl(
  value: string | null | undefined,
  messages: Messages = MESSAGES,
  label: string = LINK_URL_LABEL,
): string | null {
  return (value ?? "").trim() === "" ? messages.required(label) : checkHref(value, messages);
}
