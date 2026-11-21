import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./a11y";

test.describe("cache inspector", () => {
  test("requests the selected page and keeps each page's runs", async ({ page }) => {
    await page.goto("/caching");
    const inspector = page.locator(".cache-inspector");
    const runs = inspector.locator(".cache-inspector__runs li:not([data-result='pending'])");

    // The page you are on is requested once on load.
    await expect(inspector.getByRole("button", { name: "/caching" })).toHaveAttribute("aria-pressed", "true");
    await expect(runs).toHaveCount(1);

    await inspector.getByRole("button", { name: "Request again" }).click();
    await expect(runs).toHaveCount(2);

    // Another page starts its own list; going back shows the first page's runs again.
    const guardrails = inspector.getByRole("button", { name: "/guardrails" });
    await guardrails.click();
    await expect(guardrails).toHaveAttribute("aria-pressed", "true");
    await expect(runs).toHaveCount(1);
    await inspector.getByRole("button", { name: "/caching" }).click();
    await expect(runs).toHaveCount(3);

    await expectNoAxeViolations(page, ".cache-inspector");
  });

  test("opens the response headers when there are any", async ({ page }) => {
    await page.goto("/caching");
    const headers = page.locator(".cache-inspector__headers");
    await expect(page.locator(".cache-inspector__runs li:not([data-result='pending'])")).toHaveCount(1);
    await headers.locator("summary").click();
    await expect(headers).toHaveAttribute("open", "");
    await expect(headers.getByRole("table")).toBeVisible();
    await expectNoAxeViolations(page, ".cache-inspector");
  });

  test("works from the keyboard", async ({ page }) => {
    await page.goto("/caching");
    const runs = page.locator(".cache-inspector__runs li:not([data-result='pending'])");
    await expect(runs).toHaveCount(1);
    const system = page.getByRole("button", { name: "/system" });
    await system.focus();
    await page.keyboard.press("Enter");
    await expect(system).toHaveAttribute("aria-pressed", "true");
    await expect(system).toBeFocused();
    await expect(runs).toHaveCount(1);
  });
});

test.describe("page anatomy", () => {
  test("shows the fields of the picked section", async ({ page }) => {
    await page.goto("/inside-a-page");
    const anatomy = page.locator(".anatomy");
    const sections = anatomy.locator(".anatomy__section");
    await expect(sections.first()).toHaveAttribute("aria-pressed", "true");
    await expect(anatomy.getByRole("status")).toContainText("Hero");

    await sections.last().click();
    await expect(sections.last()).toHaveAttribute("aria-pressed", "true");
    await expect(sections.first()).toHaveAttribute("aria-pressed", "false");
    await expect(anatomy.getByRole("status")).not.toContainText("Hero");
    await expect(anatomy.locator(".anatomy__field").first()).toBeVisible();

    await expectNoAxeViolations(page, ".anatomy");
  });

  test("switches sections from the keyboard", async ({ page }) => {
    await page.goto("/inside-a-page");
    const second = page.locator(".anatomy__section").nth(1);
    await second.focus();
    await page.keyboard.press("Space");
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(second).toBeFocused();
  });
});

test.describe("guardrails playground", () => {
  test("blocks a broken hero, focuses the first failing field, and resets", async ({ page }) => {
    await page.goto("/guardrails");
    const form = page.locator(".playground__form");
    const status = form.getByRole("status");
    await expect(status).toHaveText("Live and unchanged.");

    await expect(async () => {
      await form.getByRole("button", { name: "Break three rules" }).click();
      await expect(status).toHaveText("3 fields fail, so Publish stays off.", { timeout: 1_000 });
    }).toPass();
    await expect(form.locator("[aria-invalid='true']")).toHaveCount(3);
    await expectNoAxeViolations(page, ".playground");

    // Publish stays focusable but aria-disabled, so Playwright's enabled check has to be skipped to press it.
    await form.getByRole("button", { name: "Publish" }).click({ force: true });
    await expect(form.locator("[aria-invalid='true']").first()).toBeFocused();

    await form.getByRole("button", { name: "Reset" }).click();
    await expect(status).toHaveText("Live and unchanged.");
    await expect(form.locator("[aria-invalid='true']")).toHaveCount(0);
  });

  test("publishes a valid edit to the preview", async ({ page }) => {
    await page.goto("/guardrails");
    const heading = page.getByLabel(/^Heading/);
    // Typing before hydration is lost, so retry until React has picked up the input.
    await expect(async () => {
      await heading.fill("A heading that passes");
      await expect(page.locator(".playground__form").getByRole("status")).toHaveText(
        "Every field passes. Publish puts this version live.",
        { timeout: 1_000 },
      );
    }).toPass();
    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page.locator(".playground__heading")).toHaveText("A heading that passes");
  });
});
