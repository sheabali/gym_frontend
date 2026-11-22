/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import { ClassSession } from "./classApi";

export interface Booking {
  id: string;
  sessionId: string;
  session: ClassSession;
  userId: string;
  status: "BOOKED" | "CANCELLED" | "ATTENDED" | "NO_SHOW";
  bookedAt: string;
  cancelledAt?: string | null;
}

export interface MyBookingsResponse {
  success: boolean;
  message?: string;
  data: Booking[];
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  data: Booking;
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getMyBookings: builder.query({
      query: (params?: { status?: string }) => ({
        url: "/bookings/my",
        method: "GET",
        params: params?.status ? { status: params.status } : {},
      }),
      providesTags: ["Bookings"],
    }),
    bookSession: builder.mutation({
      query: (body: { sessionId: string }) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookings", "Classes"],
    }),
    cancelBooking: builder.mutation({
      query: (id: string) => ({
        url: `/bookings/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Bookings", "Classes"],
    }),
  }),
});

export const {
  useGetMyBookingsQuery,
  useBookSessionMutation,
  useCancelBookingMutation,
} = bookingApi;
