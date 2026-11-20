/**
 * Checks the bundled seed content against the same rules the Sanity Studio enforces (src/lib/rules.ts),
 * so copy that would fail in the Studio fails CI first. Run with `npm run content:check`.
 * Node strips the TypeScript types on import; the imported files have no runtime imports of their own.
 */
import { seedPages, seedSettings } from "../src/content/seed.ts";
import { APP_BLOCKS } from "../src/lib/app-blocks.ts";
import {
  COUNT_RULES,
  HERO_RULES,
  LINK_RULES,
  PAGE_RULES,
  SECTION_RULES,
  checkCount,
  checkLinkUrl,
  checkText,
} from "../src/lib/rules.ts";

const failures = [];
const report = (where, message) => message && failures.push(`${where}: ${message}`);

function checkLink(where, link, required = false) {
  if (!link) return report(where, required ? "Link is required." : null);
  report(`${where} label`, checkText(link.label, LINK_RULES.label));
  report(`${where} href`, checkLinkUrl(link.href));
}

for (const page of seedPages) {
  const at = `/${page.slug}`;
  report(`${at} title`, checkText(page.title, PAGE_RULES.title));
  report(`${at} description`, checkText(page.description, PAGE_RULES.description));
  for (const section of page.sections ?? []) {
    const where = `${at} ${section._type}[${section._key}]`;
    switch (section._type) {
      case "hero":
        report(`${where} eyebrow`, checkText(section.eyebrow, HERO_RULES.eyebrow));
        report(`${where} heading`, checkText(section.heading, HERO_RULES.heading));
        report(`${where} body`, checkText(section.body, HERO_RULES.body));
        checkLink(`${where} link`, section.link);
        break;
      case "featureGrid":
        report(`${where} heading`, checkText(section.heading, SECTION_RULES.heading));
        report(`${where} items`, checkCount(section.items, COUNT_RULES.cards));
        for (const item of section.items ?? []) {
          report(`${where} ${item._key} title`, checkText(item.title, SECTION_RULES.cardTitle));
          report(`${where} ${item._key} body`, checkText(item.body, SECTION_RULES.cardBody));
          checkLink(`${where} ${item._key} link`, item.link);
        }
        break;
      case "steps":
        report(`${where} heading`, checkText(section.heading, SECTION_RULES.heading));
        report(`${where} items`, checkCount(section.items, COUNT_RULES.steps));
        for (const item of section.items ?? []) {
          report(`${where} ${item._key} title`, checkText(item.title, SECTION_RULES.stepTitle));
          report(`${where} ${item._key} body`, checkText(item.body, SECTION_RULES.stepBody));
        }
        break;
      case "codeSample":
        report(`${where} heading`, checkText(section.heading, SECTION_RULES.heading));
        report(`${where} body`, checkText(section.body, SECTION_RULES.longBody));
        report(`${where} filename`, checkText(section.filename, SECTION_RULES.filename));
        break;
      case "appBlock":
        report(`${where} heading`, checkText(section.heading, SECTION_RULES.heading));
        report(`${where} body`, checkText(section.body, SECTION_RULES.longBody));
        report(`${where} kind`, section.kind in APP_BLOCKS ? null : `Unknown widget "${section.kind}".`);
        break;
      case "callToAction":
        report(`${where} heading`, checkText(section.heading, SECTION_RULES.heading));
        report(`${where} body`, checkText(section.body, SECTION_RULES.shortBody));
        checkLink(`${where} link`, section.link, true);
        break;
      default:
        report(where, "Unknown section type.");
    }
  }
}

for (const [group, links] of Object.entries({ nav: seedSettings.nav, projectLinks: seedSettings.projectLinks, siteInfoLinks: seedSettings.siteInfoLinks })) {
  for (const link of links ?? []) checkLink(`settings ${group} ${link._key}`, link, true);
}

if (failures.length) {
  console.error(`${failures.length} content rule failures:\n${failures.map((line) => `  ${line}`).join("\n")}`);
  process.exit(1);
}
console.log(`Seed content passes every rule: ${seedPages.length} pages.`);
