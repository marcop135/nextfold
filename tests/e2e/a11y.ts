import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Runs axe's WCAG 2.2 A and AA rules on the page as it is now, so a test can check each state it reaches. */
export async function expectNoAxeViolations(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);
  if (include) builder = builder.include(include);
  const { violations } = await builder.analyze();
  const summary = violations.map((item) => `${item.id}: ${item.nodes.map((node) => node.target.join(" ")).join(", ")}`);
  expect(summary).toEqual([]);
}
