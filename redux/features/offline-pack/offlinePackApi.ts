import type { ModuleCoverage } from "@/lib/content-coverage";
import { baseApi } from "../baseApi";

export interface IOfflinePack {
  _id: string;
  module:
    "hadith" | "dua" | "knowledge" | "quran" | "tafsir" | "book" | "fatwa";
  lang: string;
  version: number;
  sha256: string;
  packSizeMb: number;
  s3Key: string;
  recordCount: number;
  generatedAt: string;
  downloadUrl?: string;
}

export interface IBatchJob {
  _id: string;
  batchId: string;
  fileId: string;
  module:
    "hadith" | "dua" | "knowledge" | "quran" | "tafsir" | "book" | "fatwa";
  targetLang: string;
  status:
    | "in_progress"
    | "validating"
    | "finalizing"
    | "cancelling"
    | "cancelled"
    | "completed"
    | "failed"
    | "processed";
  recordCount: number;
  processedCount: number;
  outputFileId?: string;
  errorFileId?: string;
  createdAt: string;
  updatedAt: string;
}

export const offlinePackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableContentLanguages: builder.query<{ success: boolean; data: { availableCodes: string[] } }, void>({
      query: () => '/offline-pack/available-languages',
      providesTags: ['OfflinePack', 'BatchTranslation'],
    }),
    getPacks: builder.query<{ success: boolean; data: IOfflinePack[] }, void>({
      query: () => "/offline-pack/list",
      providesTags: ["OfflinePack"],
    }),
    generatePack: builder.mutation<
      { success: boolean; data: unknown; message: string },
      { module: string; lang: string }
    >({
      query: (body) => ({
        url: "/offline-pack/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OfflinePack"],
    }),
    getBatchJobs: builder.query<{ success: boolean; data: IBatchJob[] }, void>({
      query: () => "/offline-pack/batch-jobs",
      providesTags: ["BatchTranslation"],
    }),
    startBatchTranslation: builder.mutation<
      {
        success: boolean;
        data: {
          jobId: string;
          fileId: string;
          recordCount: number;
          estimatedMinutes: number;
        };
      },
      { module: string; targetLang: string }
    >({
      query: (body) => ({
        url: "/offline-pack/batch-translate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BatchTranslation"],
    }),
    getBatchStatus: builder.query<{ success: boolean; data: unknown }, string>({
      query: (jobId) => `/offline-pack/batch-status/${jobId}`,
      providesTags: ["BatchTranslation"],
    }),
    cancelBatchJob: builder.mutation<
      { success: boolean; data: unknown; message: string },
      string
    >({
      query: (jobId) => ({
        url: `/offline-pack/batch-cancel/${jobId}`,
        method: "POST",
      }),
      invalidatesTags: ["BatchTranslation"],
    }),
    processBatchResult: builder.mutation<
      {
        success: boolean;
        data: { savedCount: number; errorCount: number };
        message: string;
      },
      string
    >({
      query: (jobId) => ({
        url: `/offline-pack/batch-process/${jobId}`,
        method: "POST",
      }),
      invalidatesTags: [
        "BatchTranslation",
        "OfflinePack",
        "Hadith",
        "Dua",
        "Knowledge",
        "Dashboard",
      ],
    }),
    getCoverage: builder.query<
      {
        success: boolean;
        data: Record<
          string,
          ModuleCoverage & {
            hadithCount: number;
            duaCount: number;
            knowledgeCount: number;
            activeJobs?: Record<string, IBatchJob>;
          }
        >;
      },
      void
    >({
      query: () => "/offline-pack/coverage",
      providesTags: ["BatchTranslation", "OfflinePack"],
    }),
  }),
});

export const {
  useGetPacksQuery,
  useGetAvailableContentLanguagesQuery,
  useGeneratePackMutation,
  useGetBatchJobsQuery,
  useStartBatchTranslationMutation,
  useGetBatchStatusQuery,
  useProcessBatchResultMutation,
  useCancelBatchJobMutation,
  useGetCoverageQuery,
} = offlinePackApi;
