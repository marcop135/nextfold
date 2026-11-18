import type { DocumentActionComponent, NewDocumentOptionsResolver } from "sanity";
import type { StructureResolver } from "sanity/structure";

export const SETTINGS_ID = "siteSettings";

/** Desk: the settings singleton first, then every page. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id(SETTINGS_ID)
        .child(S.document().schemaType("siteSettings").documentId(SETTINGS_ID).title("Site settings")),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
    ]);

/** The singleton is opened from the desk only, never created from the New document menu. */
export const newDocumentOptions: NewDocumentOptionsResolver = (prev) =>
  prev.filter((item) => item.templateId !== "siteSettings");

const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

/** No delete, duplicate, or unpublish on the singleton, so the site never loses its chrome. */
export function documentActions(prev: DocumentActionComponent[], schemaType: string) {
  return schemaType === "siteSettings"
    ? prev.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
    : prev;
}
