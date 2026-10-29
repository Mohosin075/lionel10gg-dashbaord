import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3105",
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    headless: true,
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm.cmd run start -- --port 3105",
    url: "http://127.0.0.1:3105/login",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
