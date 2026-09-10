import { baseApi } from "../baseApi";

export interface IOfflinePack {
  _id: string;
  module: "hadith" | "dua" | "knowledge";
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
  module: "hadith" | "dua" | "knowledge";
  targetLang: string;
  status: "in_progress" | "validating" | "finalizing" | "cancelling" | "cancelled" | "completed" | "failed" | "processed";
  recordCount: number;
  processedCount: number;
  outputFileId?: string;
  errorFileId?: string;
  createdAt: string;
  updatedAt: string;
}

export const offlinePackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPacks: builder.query<{ success: boolean; data: IOfflinePack[] }, void>({
      query: () => "/offline-pack/list",
      providesTags: ["OfflinePack"],
    }),
    generatePack: builder.mutation<
      { success: boolean; data: any; message: string },
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
      { success: boolean; data: { jobId: string; fileId: string; recordCount: number; estimatedMinutes: number } },
      { module: string; targetLang: string }
    >({
      query: (body) => ({
        url: "/offline-pack/batch-translate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BatchTranslation"],
    }),
    getBatchStatus: builder.query<{ success: boolean; data: any }, string>({
      query: (jobId) => `/offline-pack/batch-status/${jobId}`,
      providesTags: ["BatchTranslation"],
    }),
    cancelBatchJob: builder.mutation<
      { success: boolean; data: any; message: string },
      string
    >({
      query: (jobId) => ({
        url: `/offline-pack/batch-cancel/${jobId}`,
        method: "POST",
      }),
      invalidatesTags: ["BatchTranslation"],
    }),
    processBatchResult: builder.mutation<
      { success: boolean; data: { savedCount: number; errorCount: number }; message: string },
      string
    >({
      query: (jobId) => ({
        url: `/offline-pack/batch-process/${jobId}`,
        method: "POST",
      }),
      invalidatesTags: ["BatchTranslation", "OfflinePack", "Hadith", "Dua"],
    }),
    getCoverage: builder.query<{
      success: boolean;
      data: Record<string, {
        hadithCount: number;
        duaCount: number;
        knowledgeCount: number;
        hadithPack?: any;
        duaPack?: any;
        knowledgePack?: any;
        activeJobs?: Record<string, any>;
      }>;
    }, void>({
      query: () => "/offline-pack/coverage",
      providesTags: ["BatchTranslation", "OfflinePack"],
    }),
  }),
});

export const {
  useGetPacksQuery,
  useGeneratePackMutation,
  useGetBatchJobsQuery,
  useStartBatchTranslationMutation,
  useGetBatchStatusQuery,
  useProcessBatchResultMutation,
  useCancelBatchJobMutation,
  useGetCoverageQuery,
} = offlinePackApi;
