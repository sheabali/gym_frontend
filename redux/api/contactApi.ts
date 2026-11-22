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
      query: () => ({
        url: "/contact",
        method: "GET",
      }),
      providesTags: ["Contact"],
    }),
  }),
});

export const { useSubmitContactMutation, useGetContactsQuery } = contactApi;
