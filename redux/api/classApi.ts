/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface ClassType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
  durationMinutes: number;
  isActive: boolean;
}

export interface ClassSession {
  id: string;
  classTypeId: string;
  classType: ClassType;
  trainerId: string;
  trainer: {
    id: string;
    name: string;
    email: string;
    photoUrl?: string | null;
  };
  startsAt: string;
  endsAt: string;
  capacity: number;
  bookedCount: number;
  room?: string | null;
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED";
}

export interface ClassTypesResponse {
  success: boolean;
  message?: string;
  data: ClassType[];
}

export interface ClassSessionsResponse {
  success: boolean;
  message?: string;
  data: ClassSession[];
}

export const classApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getClassTypes: builder.query({
      query: () => ({
        url: "/classes/types",
        method: "GET",
      }),
      providesTags: ["Classes"],
    }),
    getClassSessions: builder.query({
      query: (params?: { from?: string; to?: string; classTypeId?: string; trainerId?: string }) => ({
        url: "/classes/sessions",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Classes"],
    }),
    getClassSessionById: builder.query({
      query: (id: string) => ({
        url: `/classes/sessions/${id}`,
        method: "GET",
      }),
      providesTags: (_result: any, _err: any, id: string) => [{ type: "Classes", id }],
    }),
  }),
});

export const {
  useGetClassTypesQuery,
  useGetClassSessionsQuery,
  useGetClassSessionByIdQuery,
} = classApi;
