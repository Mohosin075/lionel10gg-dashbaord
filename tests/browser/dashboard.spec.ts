import { test, expect, type Page, type Route } from "@playwright/test";
import fs from "node:fs";
const config = {
  banners: [],
  maintenanceMode: {
    isEnabled: false,
    message: "Loaded configuration",
    minAppVersion: "1.0.0",
  },
  dailyReminder: { isEnabled: true, message: "Read today", time: "09:00" },
  featureFlags: {
    premiumEnabled: true,
    audioStreamingEnabled: true,
    aiChatEnabled: false,
  },
};
const reports = {
  activeUsers: null,
  totalDownloads: null,
  newUsers7d: 2,
  avgSessionTime: null,
  userActivityLast7Days: [
    { date: "Oct 29", activeUsers: null, updatedUsers: 3, newUsers: 2 },
  ],
  featureUsageStats: [{ label: "Bookmarks", count: 7 }],
  downloadsByPlatform: null,
  reportSummary: {
    totalAppUsers: 42,
    totalVerseViews: 5,
    totalBookmarksCreated: 7,
    totalHighlightsCreated: 2,
    avgDailyActiveUsers: null,
  },
  range: { start: "2026-10-23", end: "2026-10-30", label: "Last 7 days (UTC)" },
};
const article = {
  _id: "a1",
  articleId: "art-1",
  slug: "test",
  title: "HTML article",
  content:
    '<p><strong>Readable content</strong></p><img src="/missing.png" onerror="window.injected=1"><a href="javascript:window.injected=2">Danger link</a>',
  category: "Belief",
  readTime: 5,
  lang: "de",
  source: "manual",
};
async function reply(
  route: Route,
  data: unknown,
  status = 200,
  meta?: unknown,
) {
  await route.fulfill({
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    json: { success: status < 400, data, meta },
  });
}
async function setup(
  page: Page,
  override?: (route: Route, url: URL) => Promise<boolean>,
  session = true,
) {
  if (session) {
    await page
      .context()
      .addCookies([
        { name: "token", value: "test-access", url: "http://127.0.0.1:3105" },
      ]);
    await page.addInitScript(() => {
      localStorage.setItem(
        "persist:root",
        JSON.stringify({
          user: JSON.stringify({
            user: {
              accessToken: "test-access",
              refreshToken: "test-refresh",
              role: "ADMIN",
            },
          }),
          _persist: JSON.stringify({ version: -1, rehydrated: true }),
        }),
      );
    });
  }
  await page.route("**/api/v1/**", async (route) => {
    const url = new URL(route.request().url());
    if (override && (await override(route, url))) return;
    const p = url.pathname.replace("/api/v1", "");
    if (p === "/app-config") return reply(route, config);
    if (p === "/user/profile")
      return reply(route, {
        _id: "admin",
        name: "Test Admin",
        email: "admin@example.test",
        role: "ADMIN",
      });
    if (p === "/auth/admin-login")
      return reply(route, {
        accessToken: "test-access",
        refreshToken: "test-refresh",
        role: "ADMIN",
      });
    if (p === "/subscription/admin/analytics")
      return reply(route, { activeSubscriptions: 2 });
    if (p === "/dashboard/analytics")
      return reply(route, {
        totalUsers: 42,
        activeUsers7d: null,
        dailyActiveUsers: null,
        appDownloads: null,
        monthlyActiveUsersChart: [],
        mostViewedTranslations: [],
        mostSearchedVerses: [],
        mostBookmarkedVerses: [],
        engagementSummary: {
          totalBookmarks: 7,
          totalHighlights: 2,
          totalVerseViews: 5,
        },
      });
    if (p === "/dashboard/reports") return reply(route, reports);
    if (p === "/dashboard/user-management")
      return reply(route, {
        totalUsers: 51,
        activeUsers: 50,
        restrictedUsers: 1,
        bannedUsers: 0,
      });
    if (p === "/knowledge-library")
      return reply(route, [article], 200, { page: 1, limit: 20, total: 1 });
    if (p === "/knowledge-library/books")
      return reply(
        route,
        [
          {
            _id: "b1",
            bookId: "book-1",
            title: "A complete book",
            author: "Author",
            lang: "de",
          },
        ],
        200,
        { page: 1, limit: 20, total: 1 },
      );
    if (p === "/knowledge-library/books/b1")
      return reply(route, {
        _id: "b1",
        bookId: "book-1",
        title: "A complete book",
        author: "Author",
        lang: "de",
        content: "Complete book content fetched by ID",
      });
    if (p === "/offline-pack/coverage") return reply(route, {});
    return reply(route, [], 200, {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
    });
  });
}

test("login rejects a script redirect", async ({ page }) => {
  await setup(page, undefined, false);
  await page.goto(
    "/login?redirect=" + encodeURIComponent("javascript:window.injected=1"),
  );
  await page.getByPlaceholder("Enter your email").fill("admin@example.test");
  await page.getByPlaceholder("Enter your password").fill("test-password");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3105/");
  expect(
    await page.evaluate(() => Reflect.get(window, "injected")),
  ).toBeUndefined();
});

test("article preview sanitizes HTML in the browser", async ({ page }) => {
  await setup(page);
  await page.goto("/articles");
  await page.getByText("HTML article", { exact: true }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByText("Readable content", { exact: true }),
  ).toBeVisible();
  await expect(dialog.locator("img")).not.toHaveAttribute("onerror");
  await expect(
    dialog.getByText("Danger link", { exact: true }),
  ).not.toHaveAttribute("href");
  expect(
    await page.evaluate(() => Reflect.get(window, "injected")),
  ).toBeUndefined();
});

test("users paginate past the first 50 records", async ({ page }) => {
  const pages: string[] = [];
  await setup(page, async (route, url) => {
    if (url.pathname === "/api/v1/user") {
      const current = url.searchParams.get("page") || "1";
      pages.push(current);
      await reply(
        route,
        [
          {
            _id: current,
            name: current === "2" ? "Last user" : "First user",
            email: "user@example.test",
            status: "active",
          },
        ],
        200,
        { total: 51, page: Number(current), limit: 50 },
      );
      return true;
    }
    return false;
  });
  await page.goto("/users");
  await expect(page.getByText("First user", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Last user", { exact: true })).toBeVisible();
  expect(pages).toContain("2");
});

test("article language and page selection reach the API without fallback", async ({
  page,
}) => {
  const requests: {
    lang: string | null;
    strict: string | null;
    page: string | null;
  }[] = [];
  await setup(page, async (route, url) => {
    if (url.pathname === "/api/v1/knowledge-library") {
      const lang = url.searchParams.get("lang"),
        current = url.searchParams.get("page");
      requests.push({
        lang,
        strict: url.searchParams.get("strictLang"),
        page: current,
      });
      await reply(
        route,
        [{ ...article, title: "Article " + lang + " page " + current, lang }],
        200,
        { total: 21, page: Number(current), limit: 20 },
      );
      return true;
    }
    return false;
  });
  await page.goto("/articles");
  await page.getByLabel("Content language").selectOption("bn");
  await expect(
    page.getByText("Article bn page 1", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(
    page.getByText("Article bn page 2", { exact: true }),
  ).toBeVisible();
  expect(
    requests.some(
      (r) => r.lang === "bn" && r.strict === "true" && r.page === "2",
    ),
  ).toBe(true);
});

test("book previews fetch the complete body before rendering", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/knowledge-library");
  await page.getByRole("button", { name: /Books \(/ }).click();
  await page.getByRole("button", { name: "View Content", exact: true }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByText("Complete book content fetched by ID", { exact: true }),
  ).toBeVisible();
});

test("failed app-config loads expose retry and cannot save default settings", async ({
  page,
}) => {
  let fail = true;
  await setup(page, async (route, url) => {
    if (url.pathname === "/api/v1/app-config" && fail) {
      await reply(route, null, 500);
      return true;
    }
    return false;
  });
  await page.goto("/app-config");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("button", { name: /Save Changes/ })).toHaveCount(
    0,
  );
  fail = false;
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(
    page.getByPlaceholder(
      "We are currently performing scheduled maintenance...",
    ),
  ).toHaveValue("Loaded configuration");
});

test("reports change date range and export populated CSV rows", async ({
  page,
}) => {
  const ranges: (string | null)[] = [];
  await setup(page, async (route, url) => {
    if (url.pathname === "/api/v1/dashboard/reports") {
      ranges.push(url.searchParams.get("range"));
      await reply(route, reports);
      return true;
    }
    return false;
  });
  await page.goto("/reports");
  await expect(
    page.getByText("Last 7 days (UTC). Content totals below are cumulative."),
  ).toBeVisible();
  await page.getByRole("combobox").nth(1).click();
  await page.getByRole("option", { name: "Last 30 days", exact: true }).click();
  await expect.poll(() => ranges.includes("30d")).toBe(true);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "CSV", exact: true }).click();
  const download = await downloadPromise;
  const file = await download.path();
  expect(file).not.toBeNull();
  expect(fs.readFileSync(file!, "utf8")).toContain('"Oct 29","3","2"');
});

test("Hadith create sends a string number and required category", async ({
  page,
}) => {
  let body: Record<string, unknown> | undefined;
  await setup(page, async (route, url) => {
    if (
      url.pathname === "/api/v1/hadith" &&
      route.request().method() === "POST"
    ) {
      body = route.request().postDataJSON() as Record<string, unknown>;
      await reply(route, body);
      return true;
    }
    return false;
  });
  await page.goto("/hadith");
  await page.getByRole("button", { name: /Add Hadith/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.locator("input").first().fill("12a");
  await dialog.locator("textarea").nth(0).fill("Arabic content");
  await dialog.locator("textarea").nth(1).fill("Translated content");
  await dialog.getByRole("button", { name: /Save/ }).click();
  await expect.poll(() => body?.hadithNo).toBe("12a");
  expect(body?.category).toBe("General");
});

test("Quran retranslation checks Quran coverage and requires confirmation", async ({
  page,
}) => {
  let paidRequests = 0;
  await setup(page, async (route, url) => {
    if (url.pathname === "/api/v1/offline-pack/coverage") {
      await reply(route, {
        bn: { quranCount: 7, hadithCount: 0, duaCount: 0, knowledgeCount: 0 },
      });
      return true;
    }
    if (url.pathname === "/api/v1/offline-pack/batch-translate") {
      paidRequests++;
      await reply(route, { jobId: "mock-job", recordCount: 7 });
      return true;
    }
    return false;
  });
  await page.goto("/translations");
  const row = page
    .getByRole("row")
    .filter({ has: page.getByRole("cell", { name: "Bengali", exact: true }) });
  await row.getByRole("button", { name: "Translate", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("combobox").nth(1).click();
  await page.getByRole("option", { name: /Quran \(114/ }).click();
  const launch = dialog.getByRole("button", {
    name: "Re-translate & Overwrite",
    exact: true,
  });
  await expect(launch).toBeDisabled();
  expect(paidRequests).toBe(0);
  await dialog.getByRole("checkbox").check();
  await expect(launch).toBeEnabled();
  await launch.click();
  await expect.poll(() => paidRequests).toBe(1);
});
