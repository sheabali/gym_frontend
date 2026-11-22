/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import { MembershipPlan } from "./planApi";

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: MembershipPlan;
  planName: string;
  pricePaid: number; // in paisa
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  payments?: {
    id: string;
    tranId: string;
    amount: number;
    status: string;
    method?: string | null;
    paidAt?: string | null;
  }[];
}

export interface CheckoutResponse {
  success: boolean;
  message?: string;
  data: {
    subscription: Subscription;
    payment: {
      id: string;
      tranId: string;
      amount: number;
      currency: string;
      status: string;
    };
    gatewayUrl?: string | null;
  };
}

export interface MySubscriptionsResponse {
  success: boolean;
  message?: string;
  data: Subscription[];
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getMySubscriptions: builder.query({
      query: () => ({
        url: "/subscriptions/my",
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),
    checkoutSubscription: builder.mutation({
      query: (body: { planId: string; paymentMethod?: "ONLINE" | "CASH" }) => ({
        url: "/subscriptions/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscriptions", "User"],
    }),
  }),
});

export const {
  useGetMySubscriptionsQuery,
  useCheckoutSubscriptionMutation,
} = subscriptionApi;
