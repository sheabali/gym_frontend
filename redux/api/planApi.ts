/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number; // in paisa (1 BDT = 100 paisa)
  durationDays: number;
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface PlansResponse {
  success: boolean;
  message?: string;
  data: MembershipPlan[];
}

export interface SinglePlanResponse {
  success: boolean;
  message?: string;
  data: MembershipPlan;
}

export interface CreatePlanInput {
  name: string;
  slug?: string;
  description?: string;
  price: number; // in paisa
  durationDays: number;
  features: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
}

export interface UpdatePlanInput {
  name?: string;
  description?: string;
  price?: number;
  durationDays?: number;
  features?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
}

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getPlans: builder.query({
      query: (params?: { includeInactive?: boolean }) => ({
        url: "/plans",
        method: "GET",
        params: params?.includeInactive ? { includeInactive: "true" } : {},
      }),
      providesTags: ["Plans"],
    }),
    getPlanBySlug: builder.query({
      query: (slug: string) => ({
        url: `/plans/${slug}`,
        method: "GET",
      }),
      providesTags: (_result: any, _err: any, slug: string) => [{ type: "Plans", id: slug }],
    }),
    createPlan: builder.mutation({
      query: (body: CreatePlanInput) => ({
        url: "/plans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Plans"],
    }),
    updatePlan: builder.mutation({
      query: ({ id, ...body }: { id: string } & UpdatePlanInput) => ({
        url: `/plans/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Plans"],
    }),
    deletePlan: builder.mutation({
      query: (id: string) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetPlanBySlugQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = planApi;
