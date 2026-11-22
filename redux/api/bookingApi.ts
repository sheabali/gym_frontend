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

export interface RosterAttendee {
  id: string;
  sessionId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    photoUrl?: string | null;
  };
  status: "BOOKED" | "CANCELLED" | "ATTENDED" | "NO_SHOW";
  bookedAt: string;
  cancelledAt?: string | null;
}

export interface SessionRosterResponse {
  success: boolean;
  message?: string;
  data: RosterAttendee[];
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
    getSessionRoster: builder.query({
      query: (sessionId: string) => ({
        url: `/bookings/sessions/${sessionId}`,
        method: "GET",
      }),
      providesTags: ["Bookings"],
    }),
    markAttendance: builder.mutation({
      query: ({
        bookingId,
        status,
      }: {
        bookingId: string;
        status: "ATTENDED" | "NO_SHOW";
      }) => ({
        url: `/bookings/${bookingId}/attendance`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Bookings", "Classes"],
    }),
  }),
});

export const {
  useGetMyBookingsQuery,
  useBookSessionMutation,
  useCancelBookingMutation,
  useGetSessionRosterQuery,
  useMarkAttendanceMutation,
} = bookingApi;
