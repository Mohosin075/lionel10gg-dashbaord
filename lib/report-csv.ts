import type { Reports } from "./api-types";
export type ReportType =
  "user-activity" | "content-usage" | "system-performance";
export function csvCell(value: string | number | null): string {
  let text = value === null ? "Not tracked" : String(value);
  if (typeof value === "string" && /^\s*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}
export function reportToCsv(data: Reports, type: ReportType): string {
  let rows: (string | number | null)[][];
  if (type === "user-activity")
    rows = [
      ["Date (UTC)", "Updated profiles", "New users"],
      ...data.userActivityLast7Days.map((row) => [
        row.date,
        row.updatedUsers,
        row.newUsers,
      ]),
    ];
  else if (type === "content-usage")
    rows = [
      ["Metric (all time)", "Count"],
      ...data.featureUsageStats.map((row) => [row.label, row.count]),
    ];
  else {
    const s = data.reportSummary;
    rows = [
      ["Metric (all time)", "Value"],
      ["Total registered users", s.totalAppUsers],
      ["Saved reading positions", s.totalVerseViews],
      ["Bookmarks", s.totalBookmarksCreated],
      ["Highlights", s.totalHighlightsCreated],
      ["Average daily active users", s.avgDailyActiveUsers],
    ];
  }
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}
