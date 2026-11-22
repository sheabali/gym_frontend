/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface PaymentRecord {
  id: string;
  tranId: string;
  userId: string;
  subscriptionId?: string | null;
  amount: number; // in paisa
  currency: string;
  method: "ONLINE" | "CASH";
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  valId?: string | null;
  bankTranId?: string | null;
  cardType?: string | null;
  cardBrand?: string | null;
  paidAt?: string | null;
  createdAt: string;
  subscription?: {
    id: string;
    planName: string;
    startDate?: string | null;
    endDate?: string | null;
    status: string;
  } | null;
}

export interface PaymentStatusResponse {
  success: boolean;
  message?: string;
  data: PaymentRecord;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getPaymentStatus: builder.query({
      query: (tranId: string) => ({
        url: `/payments/${tranId}/status`,
        method: "GET",
      }),
      providesTags: ["Payments"],
    }),
    reconcilePayments: builder.mutation({
      query: () => ({
        url: "/payments/reconcile",
        method: "POST",
      }),
      invalidatesTags: ["Payments", "Subscriptions"],
    }),
  }),
});

export const {
  useGetPaymentStatusQuery,
  useReconcilePaymentsMutation,
} = paymentApi;
