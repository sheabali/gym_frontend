/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  isActive: boolean;
  publishedAt: string;
  expiresAt?: string | null;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string | null;
  category?: string | null;
  sortOrder: number;
}

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getFaqs: builder.query({
      query: () => ({
        url: "/content/faq",
        method: "GET",
      }),
      providesTags: ["Content"],
    }),
    getAnnouncements: builder.query({
      query: () => ({
        url: "/content/announcements",
        method: "GET",
      }),
      providesTags: ["Content"],
    }),
    getGallery: builder.query({
      query: () => ({
        url: "/content/gallery",
        method: "GET",
      }),
      providesTags: ["Content"],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useGetAnnouncementsQuery,
  useGetGalleryQuery,
} = contentApi;
