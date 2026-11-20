import { at, defineMigration, setIfMissing } from "sanity/migrate";

/**
 * Writes `language: "en"` on pages and settings saved before documents had a language.
 * Dry run (the default): npx sanity migration run set-page-language
 * Apply: npx sanity migration run set-page-language --no-dry-run
 * Queries already read a missing language as English (coalesce), so the site works before and after the run.
 */
export default defineMigration({
  title: "Set page language",
  documentTypes: ["page", "siteSettings"],
  filter: "!defined(language)",
  migrate: {
    document() {
      return [at("language", setIfMissing("en"))];
    },
  },
});
