export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}
export interface KnowledgeArticle {
  _id: string;
  articleId: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  readTime: number;
  imageUrl?: string;
  audioUrl?: string;
  lang: string;
  source?: "islamhouse" | "manual";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface KnowledgeBook {
  isContentAvailable?: boolean;
  _id: string;
  bookId: string;
  title: string;
  author?: string;
  content: string;
  lang: string;
}
export interface KnowledgeFatwa {
  _id: string;
  fatwaId: string;
  question: string;
  answer: string;
  scholar?: string;
  lang: string;
}
export type ContentModule =
  "hadith" | "dua" | "knowledge" | "quran" | "tafsir" | "book" | "fatwa";
export interface ActivityDay {
  date: string;
  activeUsers: number | null;
  updatedUsers: number;
  newUsers: number;
}
export interface ReportSummary {
  totalAppUsers: number;
  totalVerseViews: number;
  totalBookmarksCreated: number;
  totalHighlightsCreated: number;
  avgDailyActiveUsers: number | null;
}
export type ReportRange = "7d" | "30d" | "month";
export interface Reports {
  activeUsers: number | null;
  totalDownloads: number | null;
  newUsers7d: number;
  avgSessionTime: string | null;
  userActivityLast7Days: ActivityDay[];
  featureUsageStats: { label: string; count: number }[];
  downloadsByPlatform: { android: number; ios: number } | null;
  reportSummary: ReportSummary;
  range: { start: string; end: string; label: string };
}
export interface Analytics {
  totalUsers: number;
  activeUsers7d: number | null;
  dailyActiveUsers: number | null;
  appDownloads: number | null;
  monthlyActiveUsersChart: { month: string; activeUsers: number }[];
  mostViewedTranslations: { label: string; value: number }[];
  mostSearchedVerses: { label: string; count: number }[];
  mostBookmarkedVerses: { label: string; count: number }[];
  engagementSummary: {
    totalBookmarks: number;
    totalHighlights: number;
    totalVerseViews: number;
  };
  totalHadiths: number;
  totalDuas: number;
  totalOfflinePacks: number;
  activeBatchJobs: number;
}
export interface NotificationRecord {
  _id: string;
  title: string;
  message: string;
  userId?: string;
  createdAt: string;
}
export interface NotificationManagement {
  sentNotifications: number;
  scheduledNotifications: number;
  draftNotifications: number;
  notifications: NotificationRecord[];
}
export interface SubscriptionAnalytics {
  activeSubscriptions: number;
  [key: string]: number;
}
