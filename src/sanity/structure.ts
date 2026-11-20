import type { DocumentActionComponent, NewDocumentOptionsResolver, Template } from "sanity";
import type { StructureResolver } from "sanity/structure";
import { LOCALE_NAMES, defaultLocale, locales, type Locale } from "../lib/i18n";

/** Settings document id per language: `siteSettings` for English (the id it always had), `siteSettings-de`. */
export function settingsId(locale: Locale): string {
  return locale === defaultLocale ? "siteSettings" : `siteSettings-${locale}`;
}
export const SETTINGS_IDS = locales.map(settingsId);
export const SETTINGS_ID = settingsId(defaultLocale);

/** "Page, English" and "Page, Deutsch": the template sets the language, which stays fixed afterwards. */
export const templates = (prev: Template[]): Template[] => [
  ...prev.filter((template) => template.schemaType !== "page" && template.schemaType !== "siteSettings"),
  ...locales.flatMap((locale) => [
    { id: `page-${locale}`, title: `Page, ${LOCALE_NAMES[locale].name}`, schemaType: "page", value: { language: locale } },
    {
      id: `siteSettings-${locale}`,
      title: `Site settings, ${LOCALE_NAMES[locale].name}`,
      schemaType: "siteSettings",
      value: { language: locale },
    },
  ]),
];

/** Desk: settings per language first, then pages per language. Old pages without a language list under English. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("settings")
        .child(
          S.list()
            .title("Site settings")
            .items(
              locales.map((locale) =>
                S.listItem()
                  .title(LOCALE_NAMES[locale].name)
                  .id(settingsId(locale))
                  .child(
                    S.document()
                      .schemaType("siteSettings")
                      .documentId(settingsId(locale))
                      .initialValueTemplate(`siteSettings-${locale}`)
                      .title(`Site settings, ${LOCALE_NAMES[locale].name}`),
                  ),
              ),
            ),
        ),
      S.divider(),
      ...locales.map((locale) =>
        S.listItem()
          .title(`Pages, ${LOCALE_NAMES[locale].name}`)
          .id(`pages-${locale}`)
          .child(
            S.documentList()
              .title(`Pages, ${LOCALE_NAMES[locale].name}`)
              .schemaType("page")
              .filter(`_type == "page" && coalesce(language, $fallback) == $language`)
              .params({ language: locale, fallback: defaultLocale })
              .initialValueTemplates([S.initialValueTemplateItem(`page-${locale}`)]),
          ),
      ),
    ]);

/** Settings are opened from the desk only, never created from the New document menu. */
export const newDocumentOptions: NewDocumentOptionsResolver = (prev) =>
  prev.filter((item) => !item.templateId.startsWith("siteSettings"));

const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

/** No delete, duplicate, or unpublish on settings, so the site never loses its chrome. */
export function documentActions(prev: DocumentActionComponent[], schemaType: string) {
  return schemaType === "siteSettings"
    ? prev.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
    : prev;
}
