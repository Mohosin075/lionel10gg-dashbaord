# Quran International Dashboard

Requires Node.js 22+ and the Quran International backend on port 5005.

## Local development

1. Run npm ci.
2. Copy .env.example to .env.local and set NEXT_PUBLIC_BASEURL to the backend origin (without /api/v1).
3. Run npm run dev and sign in with a backend admin account.

The browser connects directly to the configured backend. For another device on the same LAN, use the backend computer's LAN IP and allow the dashboard origin in backend CORS. NEXT_PUBLIC_BASEURL is included at build time; rebuild when it changes.

## Checks

- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm run test:e2e (install Chromium with npx playwright install chromium, or set PLAYWRIGHT_CHANNEL=msedge to use installed Edge).

Browser tests start the production app on port 3105 and mock API responses. They do not send real notifications, alter client data, or start paid translation jobs.

## Data and security

Article HTML is sanitized before preview. Login redirects allow local paths only. Expired access tokens share one refresh request; rejected refreshes clear the session and API cache.

Content lists use pagination, server search, and exact language filters. Book previews/editors retrieve the complete book before displaying it. The legacy /premium-benefits URL uses the maintained subscription-benefits page.

Reports support 7 days, 30 days, and the current month in UTC. Registrations/profile updates are shown separately from session activity. Installs, platform breakdowns, and session durations show unavailable until genuine telemetry is collected. Bookmarks, highlights, saved reading positions, and published content counts are cumulative.

Restart/rebuild the backend too: this repair changes report responses and adds strictLang/searchTerm/source filters to Knowledge Library lists. Mobile language fallback behavior is retained for requests without strictLang=true.

The small local shadcn stylesheet retains its MIT license in licenses/shadcn-LICENSE.md; the CLI and its runtime dependency tree are not needed to run this dashboard.
