import { defineField, type SlugIsUniqueValidator } from "sanity";
import { LOCALE_NAMES, defaultLocale, locales } from "../../lib/i18n";
import { apiVersion } from "../env";

/**
 * Document-level translations: one document per language, linked by slug. The language is set by the
 * template the editor picks (Page, English or Deutsch) and cannot change afterwards. Documents saved
 * before this field existed count as English: the queries read `coalesce(language, "en")`.
 */
export const languageField = defineField({
  name: "language",
  type: "string",
  readOnly: true,
  initialValue: defaultLocale,
  options: { list: locales.map((value) => ({ value, title: LOCALE_NAMES[value].name })), layout: "radio" },
  validation: (rule) => rule.required(),
});

/** A slug is unique within its language, so /guardrails and /de/guardrails can share it. */
export const isUniqueInLanguage: SlugIsUniqueValidator = async (slug, context) => {
  const { document, getClient } = context;
  const id = document?._id.replace(/^drafts\./, "") ?? "";
  const language = (document?.language as string | undefined) ?? defaultLocale;
  const count = await getClient({ apiVersion }).fetch<number>(
    `count(*[_type == $type && slug.current == $slug && coalesce(language, $fallback) == $language && !(_id in [$id, "drafts." + $id])])`,
    { type: document?._type, slug, language, fallback: defaultLocale, id },
  );
  return count === 0;
};
