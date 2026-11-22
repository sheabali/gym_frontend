/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface AdminOverviewMetrics {
  activeMembers: number;
  monthlyRevenue: number; // in paisa
  todaySessionsCount: number;
  pendingPaymentsCount: number;
}

export interface AdminOverviewResponse {
  success: boolean;
  message?: string;
  data: AdminOverviewMetrics;
}

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "MEMBER" | "TRAINER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  photoUrl?: string | null;
  trialUsed: boolean;
  createdAt: string;
  updatedAt: string;
  subscriptions?: {
    id: string;
    planName: string;
    status: string;
    endDate: string | null;
  }[];
}

export interface AdminMembersResponse {
  success: boolean;
  message?: string;
  data: {
    members: AdminMember[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getAdminOverview: builder.query({
      query: () => ({
        url: "/admin/overview",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    getAdminMembers: builder.query({
      query: (params?: { search?: string; status?: string; role?: string; page?: number; limit?: number }) => ({
        url: "/admin/members",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Admin"],
    }),
    updateMemberStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: "ACTIVE" | "SUSPENDED" }) => ({
        url: `/admin/members/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useGetAdminMembersQuery,
  useUpdateMemberStatusMutation,
} = adminApi;
