/**
 * Copies the seed pages and settings in every language from src/content/seed into the Sanity dataset.
 * Run with `npm run seed:import` after `npx sanity login`. Documents that already exist are left alone,
 * so editors' changes are never overwritten.
 */
import { getCliClient } from "sanity/cli";
import { seedPages, seedSettings } from "../src/content/seed";
import { apiVersion } from "../src/sanity/env";
import { locales } from "../src/lib/i18n";
import { settingsId } from "../src/sanity/structure";

const client = getCliClient({ apiVersion });

/** English ids are the ones the first import used, so existing documents are kept; German ids end in -de. */
const documents: Array<{ _id: string; _type: string } & Record<string, unknown>> = locales.flatMap((locale) => [
  { _id: settingsId(locale), _type: "siteSettings", language: locale, ...seedSettings[locale] },
  ...seedPages[locale].map(({ slug, ...page }) => ({
    // A dot in an _id would make the document private, so pages use a dash.
    _id: locale === "en" ? `page-${slug}` : `page-${slug}-${locale}`,
    _type: "page",
    ...page,
    language: locale,
    slug: { _type: "slug", current: slug },
  })),
]);

const transaction = client.transaction();
for (const document of documents) transaction.createIfNotExists(document);
const result = await transaction.commit();

console.log(`Dataset ${client.config().dataset}: ${documents.map((d) => d._id).join(", ")}`);
console.log(`${result.results.filter((r) => r.operation === "create").length} created, the rest already existed.`);
