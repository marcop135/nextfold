import type { ArrayRule, StringRule } from "sanity";
import { MESSAGES, type CountRule, type TextRule } from "../../lib/rules";

/** Validation from src/lib/rules.ts, with the same messages the Guardrails playground shows. */
export function textRules(rule: StringRule, text: TextRule) {
  const rules = [rule.max(text.max).error(MESSAGES.tooLong(text.label, text.max))];
  if (text.min !== undefined) rules.push(rule.min(text.min).error(MESSAGES.tooShort(text.label, text.min)));
  if (text.required) rules.unshift(rule.required().error(MESSAGES.required(text.label)));
  return rules;
}

export function countRules(rule: ArrayRule<unknown[]>, count: CountRule) {
  return rule.min(count.min).max(count.max).error(MESSAGES.count(count.label, count.min, count.max));
}
