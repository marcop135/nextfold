import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./a11y";

const SLUGS = ["", "inside-a-page", "guardrails", "caching", "system", "for-agents", "privacy"];
const PATHS = [...SLUGS.map((slug) => `/${slug}`), ...SLUGS.map((slug) => (slug ? `/de/${slug}` : "/de"))];

for (const path of PATHS) {
  test(`${path} has one h1, the right language, and no axe violations`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", path.startsWith("/de") ? "de" : "en");
    await expect(page.locator("h1")).toHaveCount(1);
    await expectNoAxeViolations(page);
  });
}
