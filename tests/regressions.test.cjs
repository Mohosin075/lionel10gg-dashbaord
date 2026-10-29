const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const { safeRedirect } = require("../lib/navigation.ts");
const {
  getModuleCount,
  hasModuleContent,
} = require("../lib/content-coverage.ts");
const { reportToCsv, csvCell } = require("../lib/report-csv.ts");

test("login redirects stay on local dashboard paths", () => {
  for (const value of [
    null,
    "javascript:alert(1)",
    "//evil.example",
    "/\\evil.example",
    "https://evil.example",
    "/login",
    "/users\n",
  ])
    assert.equal(safeRedirect(value), "/");
  assert.equal(safeRedirect("/users?page=2#row"), "/users?page=2#row");
});

test("HTML previews remove executable markup but preserve article formatting", async () => {
  const { JSDOM } = require("jsdom");
  const dom = new JSDOM("");
  global.window = dom.window;
  try {
    const { sanitizeRichHtml } = require("../lib/sanitize-html.ts");
    const html = sanitizeRichHtml(
      '<p><strong>Readable</strong></p><img src=x onerror="window.pwned=1"><a href="javascript:alert(1)">bad</a><svg onload="alert(1)"></svg><script>alert(1)</script>',
    );
    const output = new JSDOM(html).window.document;
    assert.equal(output.querySelector("strong").textContent, "Readable");
    assert.equal(output.querySelector("img").getAttribute("onerror"), null);
    assert.equal(output.querySelector("a").getAttribute("href"), null);
    assert.equal(output.querySelector("script"), null);
    assert.equal(output.querySelector("svg"), null);
  } finally {
    delete global.window;
    dom.window.close();
  }
});

test("all content modules use their own count and pack for retranslation decisions", () => {
  const coverage = { knowledgeCount: 99 };
  assert.equal(hasModuleContent(coverage, "quran"), false);
  for (const contentModule of [
    "hadith",
    "dua",
    "knowledge",
    "quran",
    "tafsir",
    "book",
    "fatwa",
  ]) {
    assert.equal(getModuleCount({ [contentModule + "Count"]: 3 }, contentModule), 3);
    assert.equal(
      hasModuleContent({ [contentModule + "Pack"]: { version: 2 } }, contentModule),
      true,
    );
  }
});

test("CSV exports use API rows/nested summary, escape fields and neutralize formulas", () => {
  const data = {
    userActivityLast7Days: [{ date: "Oct 29", updatedUsers: 3, newUsers: 2 }],
    featureUsageStats: [{ label: "Bookmarks", count: 7 }],
    reportSummary: {
      totalAppUsers: 42,
      totalVerseViews: 5,
      totalBookmarksCreated: 7,
      totalHighlightsCreated: 2,
      avgDailyActiveUsers: null,
    },
  };
  assert.match(reportToCsv(data, "user-activity"), /"Oct 29","3","2"/);
  assert.match(reportToCsv(data, "content-usage"), /"Bookmarks","7"/);
  assert.match(
    reportToCsv(data, "system-performance"),
    /"Total registered users","42"/,
  );
  assert.match(reportToCsv(data, "system-performance"), /"Not tracked"/);
  assert.equal(csvCell('a,"b"'), '"a,""b"""');
  assert.equal(
    csvCell("=1+1"),
    String.fromCharCode(34, 39) + "=1+1" + String.fromCharCode(34),
  );
});

const { configureStore } = require("@reduxjs/toolkit");
const { baseApi } = require("../redux/features/baseApi.ts");
const {
  default: userReducer,
  setUser,
  removeUser,
} = require("../redux/slice/userSlice.ts");
const probeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    authProbe: builder.query({ query: (id) => "/test/" + id }),
  }),
});
function makeStore() {
  const store = configureStore({
    reducer: { user: userReducer, api: baseApi.reducer },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });
  store.dispatch(
    setUser({
      data: { accessToken: "expired", refreshToken: "refresh", role: "ADMIN" },
    }),
  );
  return store;
}
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

test("concurrent expired-token requests share one refresh and retry successfully", async () => {
  const originalFetch = global.fetch;
  let refreshes = 0;
  global.fetch = async (request) => {
    if (request.url.endsWith("/auth/refresh-token")) {
      refreshes++;
      await new Promise((resolve) => setTimeout(resolve, 15));
      return json({ data: { accessToken: "renewed" } });
    }
    return request.headers.get("authorization") === "Bearer renewed"
      ? json({ data: "ok" })
      : json({ message: "expired" }, 401);
  };
  const store = makeStore();
  try {
    const responses = await Promise.all(
      ["a", "b", "c"].map((id) =>
        store.dispatch(probeApi.endpoints.authProbe.initiate(id)),
      ),
    );
    assert.equal(refreshes, 1);
    assert.ok(responses.every((result) => result.data?.data === "ok"));
    assert.equal(store.getState().user.user.accessToken, "renewed");
  } finally {
    store.dispatch(baseApi.util.resetApiState());
    global.fetch = originalFetch;
  }
});

test("temporary refresh failures preserve the session; rejected refreshes clear it", async () => {
  const originalFetch = global.fetch;
  for (const status of [503, 401]) {
    const store = makeStore();
    global.fetch = async (request) =>
      request.url.endsWith("/auth/refresh-token")
        ? json({ message: "failed" }, status)
        : json({}, 401);
    try {
      await store.dispatch(probeApi.endpoints.authProbe.initiate("failure"));
      assert.equal(store.getState().user.user === null, status === 401);
    } finally {
      store.dispatch(baseApi.util.resetApiState());
    }
  }
  global.fetch = originalFetch;
});

test("a refresh completing after logout cannot resurrect the session", async () => {
  const originalFetch = global.fetch;
  let completeRefresh;
  let markStarted;
  const started = new Promise((resolve) => {
    markStarted = resolve;
  });
  global.fetch = async (request) => {
    if (request.url.endsWith("/auth/refresh-token")) {
      markStarted();
      return new Promise((resolve) => {
        completeRefresh = resolve;
      });
    }
    return json({}, 401);
  };
  const store = makeStore();
  try {
    const pending = store.dispatch(
      probeApi.endpoints.authProbe.initiate("logout"),
    );
    await started;
    store.dispatch(removeUser());
    completeRefresh(json({ data: { accessToken: "too-late" } }));
    await pending;
    assert.equal(store.getState().user.user, null);
  } finally {
    store.dispatch(baseApi.util.resetApiState());
    global.fetch = originalFetch;
  }
});
