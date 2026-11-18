/**
 * Copies the seed pages and settings from src/content/seed.ts into the Sanity dataset.
 * Run with `npm run seed:import` after `npx sanity login`. Documents that already exist are left alone,
 * so editors' changes are never overwritten.
 */
import { getCliClient } from "sanity/cli";
import { seedPages, seedSettings } from "../src/content/seed";
import { apiVersion } from "../src/sanity/env";
import { SETTINGS_ID } from "../src/sanity/structure";

const client = getCliClient({ apiVersion });

const documents: Array<{ _id: string; _type: string } & Record<string, unknown>> = [
  { _id: SETTINGS_ID, _type: "siteSettings", ...seedSettings },
  ...seedPages.map(({ slug, ...page }) => ({
    // A dot in an _id would make the document private, so pages use a dash.
    _id: `page-${slug}`,
    _type: "page",
    ...page,
    slug: { _type: "slug", current: slug },
  })),
];

const transaction = client.transaction();
for (const document of documents) transaction.createIfNotExists(document);
const result = await transaction.commit();

console.log(`Dataset ${client.config().dataset}: ${documents.map((d) => d._id).join(", ")}`);
console.log(`${result.results.filter((r) => r.operation === "create").length} created, the rest already existed.`);
