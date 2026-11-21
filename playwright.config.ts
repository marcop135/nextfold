import { defineConfig, devices } from "@playwright/test";

const port = 3100;

/**
 * End-to-end and accessibility tests in tests/e2e, run in the installed Chrome (no browser download).
 * Locally they reuse a running `npm run dev`; in CI they start `npm start` on the build from the step before.
 */
export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    channel: "chrome",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: process.env.CI ? "npm start" : "npm run dev",
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
