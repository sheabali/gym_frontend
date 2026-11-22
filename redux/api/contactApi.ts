/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface ContactInquiry {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  message: string;
  status: "NEW" | "REPLIED" | "CLOSED";
  createdAt: string;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    submitContact: builder.mutation({
      query: (body: { name: string; phone?: string; email?: string; message: string }) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),
    getContacts: builder.query({
      query: (params?: { status?: string }) => ({
        url: "/contact",
        method: "GET",
        params: params?.status ? { status: params.status } : {},
      }),
      providesTags: ["Contact"],
    }),
    updateContactStatus: builder.mutation({
      query: ({
        id,
        status,
      }: {
        id: string;
        status: "NEW" | "REPLIED" | "CLOSED";
      }) => ({
        url: `/contact/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const {
  useSubmitContactMutation,
  useGetContactsQuery,
  useUpdateContactStatusMutation,
} = contactApi;
