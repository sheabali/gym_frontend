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
    createClassType: builder.mutation({
      query: (body: {
        name: string;
        description?: string;
        imageUrl?: string;
        difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
        durationMinutes: number;
      }) => ({
        url: "/classes/types",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Classes"],
    }),
    createSession: builder.mutation({
      query: (body: {
        classTypeId: string;
        trainerId: string;
        startsAt: string;
        endsAt: string;
        capacity: number;
        room?: string;
      }) => ({
        url: "/classes/sessions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Classes"],
    }),
    createRecurringSessions: builder.mutation({
      query: (body: {
        classTypeId: string;
        trainerId: string;
        dayOfWeek: number; // 0 = Sunday, 1 = Monday...
        startTime: string; // HH:mm
        durationMinutes: number;
        capacity: number;
        room?: string;
        numberOfWeeks: number;
      }) => ({
        url: "/classes/sessions/recurring",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Classes"],
    }),
    cancelSession: builder.mutation({
      query: (id: string) => ({
        url: `/classes/sessions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Classes"],
    }),
  }),
});

export const {
  useGetClassTypesQuery,
  useGetClassSessionsQuery,
  useGetClassSessionByIdQuery,
  useCreateClassTypeMutation,
  useCreateSessionMutation,
  useCreateRecurringSessionsMutation,
  useCancelSessionMutation,
} = classApi;
