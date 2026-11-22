"use client";

import React, { useState } from "react";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetMySubscriptionsQuery } from "@/redux/api/subscriptionApi";
import {
  useGetMyBookingsQuery,
  useBookSessionMutation,
  useCancelBookingMutation,
} from "@/redux/api/bookingApi";
import { useGetClassSessionsQuery } from "@/redux/api/classApi";
import { useAppSelector } from "@/redux/hooks";
import {
  Calendar,
  Clock,
  CreditCard,
  Dumbbell,
  Loader2,
  MapPin,
  Plus,
  Shield,
  ShieldCheck,
  User,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

export default function UserDashboardPage() {
  const token = useAppSelector((state) => state.auth.token);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "schedule" | "billing">("overview");

  // API hooks
  const { data: meResponse, isLoading: meLoading } = useGetMeQuery(undefined, { skip: !token }) as any;
  const { data: subsResponse, isLoading: subsLoading } = useGetMySubscriptionsQuery(undefined, { skip: !token }) as any;
  const { data: bookingsResponse, isLoading: bookingsLoading } = useGetMyBookingsQuery(undefined, { skip: !token }) as any;
  const { data: sessionsResponse, isLoading: sessionsLoading } = useGetClassSessionsQuery(undefined) as any;

  const [bookSession, { isLoading: isBooking }] = useBookSessionMutation();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const user = meResponse?.data || meResponse;
  const subscriptions = subsResponse?.data || [];
  const bookings = bookingsResponse?.data || [];
  const availableSessions = sessionsResponse?.data || [];

  // Find currently active subscription
  const activeSubscription = subscriptions.find((s: any) => s.status === "ACTIVE");

  const handleBook = async (sessionId: string) => {
    try {
      await bookSession({ sessionId }).unwrap();
      toast.success("Spot booked successfully! See you in class.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Booking failed. Please ensure you have an active membership.");
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId).unwrap();
      toast.success("Booking cancelled successfully.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Cancellation failed. Cutoff is 2 hours before session start.");
    }
  };

  const calculateDaysRemaining = (endDateStr?: string | null) => {
    if (!endDateStr) return 0;
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (meLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const daysRemaining = activeSubscription ? calculateDaysRemaining(activeSubscription.endDate) : 0;

  return (
    <div className="space-y-6 container mx-auto py-2">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-xs border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Platinum Member
            </span>
            <span className="text-xs text-gray-400">• Banasree Campus</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user?.name || "Member"}!
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track your memberships, manage class bookings, and view verified payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/#pricing">
            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-xs border-gray-200 cursor-pointer"
            >
              Browse Plans
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => setActiveTab("schedule")}
            className="text-xs rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            <Plus size={14} className="mr-1" />
            Book a Class
          </Button>
        </div>
      </div>

      {/* 2. Membership Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Membership Status */}
        <div className="bg-white p-5 rounded-xs border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Membership Status
            </span>
            {activeSubscription ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 size={13} className="text-emerald-600" />
                ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertCircle size={13} className="text-amber-600" />
                NO ACTIVE PLAN
              </span>
            )}
          </div>

          <div className="my-2">
            <h3 className="text-xl font-bold text-gray-900">
              {activeSubscription ? activeSubscription.planName : "Inactive Member"}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {activeSubscription && activeSubscription.endDate
                ? `Expires on ${new Date(activeSubscription.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "Asia/Dhaka",
                })}`
                : "Choose a membership plan to unlock booking & gym floor access."}
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-mono">
              {activeSubscription ? `${daysRemaining} days remaining` : "0 days left"}
            </span>
            <Link href="/#pricing" className="text-emerald-600 font-semibold hover:underline flex items-center gap-0.5">
              {activeSubscription ? "Renew Plan" : "Enroll Now"}
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Bookings KPI */}
        <div className="bg-white p-5 rounded-xs border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class Bookings
            </span>
            <div className="p-1.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
              <Dumbbell size={16} />
            </div>
          </div>

          <div className="my-2">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              {bookings.filter((b: any) => b.status === "BOOKED").length} Active
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Total sessions scheduled on your calendar
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-mono">
              {bookings.length} historical bookings
            </span>
            <button
              onClick={() => setActiveTab("bookings")}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>

        {/* Profile & Security */}
        <div className="bg-white p-5 rounded-xs border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact & Profile
            </span>
            <div className="p-1.5 rounded bg-purple-50 text-purple-600 border border-purple-200">
              <ShieldCheck size={16} />
            </div>
          </div>

          <div className="my-2 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Phone:</span>
              <span className="font-semibold text-gray-800 font-mono">{user?.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="font-semibold text-gray-800">{user?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Free Trial:</span>
              <span className="font-semibold text-gray-800">{user?.trialUsed ? "Used" : "Available"}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} />
              Verified Account
            </span>
            <span className="text-gray-400">Member #{user?.id?.slice(-5) || "001"}</span>
          </div>
        </div>
      </div>

      {/* 3. Tabbed Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6 text-xs font-semibold">
          {[
            { key: "overview", label: "My Bookings" },
            { key: "schedule", label: "Book a Class Session" },
            { key: "billing", label: "Membership & Payment History" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === tab.key
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 4. Tab Content */}
      {/* Tab A: Bookings */}
      {activeTab === "overview" && (
        <div className="bg-white p-6 rounded-xs border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Your Scheduled Class Sessions</h2>
              <p className="text-xs text-gray-500">Upcoming workouts and floor coaching sessions</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveTab("schedule")}
              className="text-xs rounded-xs"
            >
              + Reserve Another Spot
            </Button>
          </div>

          {bookingsLoading ? (
            <div className="py-8 text-center text-xs text-gray-500">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-800">No sessions booked yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                You haven&apos;t reserved any class sessions. Browse the weekly schedule to book your spot.
              </p>
              <Button
                size="sm"
                onClick={() => setActiveTab("schedule")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              >
                Browse Available Sessions
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Trainer</th>
                    <th className="py-3 px-4">Room</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking: any) => {
                    const session = booking.session;
                    const startsAt = new Date(session.startsAt);
                    const timeStr = startsAt.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Dhaka",
                    });
                    const dateStr = startsAt.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      timeZone: "Asia/Dhaka",
                    });

                    return (
                      <tr key={booking.id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          {session.classType?.name || "Fitness Class"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 font-mono">
                          {dateStr} • {timeStr}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {session.trainer?.name || "Trainer"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">
                          {session.room || "Main Studio"}
                        </td>
                        <td className="py-3.5 px-4">
                          {booking.status === "BOOKED" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              BOOKED
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
                              {booking.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {booking.status === "BOOKED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancel(booking.id)}
                              disabled={isCancelling}
                              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 cursor-pointer"
                            >
                              <XCircle size={13} className="mr-1" />
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab B: Available Schedule */}
      {activeTab === "schedule" && (
        <div className="bg-white p-6 rounded-xs border border-gray-200/80 shadow-xs">
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-900">Weekly Scheduled Classes & Sessions</h2>
            <p className="text-xs text-gray-500">
              Select an upcoming session to reserve your training spot. Capacity is limited to ensure spacious workouts.
            </p>
          </div>

          {sessionsLoading ? (
            <div className="py-8 text-center text-xs text-gray-500">Loading scheduled sessions...</div>
          ) : availableSessions.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              No sessions currently scheduled. Please check back shortly or inquire at the front desk.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSessions.map((session: any) => {
                const startsAt = new Date(session.startsAt);
                const timeStr = startsAt.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Dhaka",
                });
                const dateStr = startsAt.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  timeZone: "Asia/Dhaka",
                });
                const availableSeats = session.capacity - session.bookedCount;
                const isAlreadyBooked = bookings.some(
                  (b: any) => b.sessionId === session.id && b.status === "BOOKED"
                );

                return (
                  <div
                    key={session.id}
                    className="p-4 rounded-xs border border-gray-200 bg-gray-50/50 flex flex-col justify-between hover:border-gray-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1 font-mono">
                        <span>{dateStr}</span>
                        <span className="font-bold text-gray-800">{timeStr}</span>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900 mb-1">
                        {session.classType?.name || "Fitness Class"}
                      </h3>

                      <p className="text-xs text-gray-600 mb-2">
                        Coach: {session.trainer?.name || "Floor Specialist"} • {session.room || "Studio 1"}
                      </p>

                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${availableSeats > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                          {availableSeats > 0 ? `${availableSeats} spots left` : "Session Full"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200/80">
                      {isAlreadyBooked ? (
                        <Button
                          disabled
                          size="sm"
                          className="w-full text-xs bg-emerald-100 text-emerald-800 font-semibold"
                        >
                          <CheckCircle2 size={13} className="mr-1" />
                          Reserved
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleBook(session.id)}
                          disabled={availableSeats <= 0 || isBooking}
                          className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                        >
                          {availableSeats <= 0 ? "Session Full" : "Book Spot"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab C: Billing & Invoices */}
      {activeTab === "billing" && (
        <div className="bg-white p-6 rounded-xs border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Subscription Invoices & Receipts</h2>
              <p className="text-xs text-gray-500">Record of all membership dues and verified payments</p>
            </div>
            <Link href="/#pricing">
              <Button size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                New Subscription
              </Button>
            </Link>
          </div>

          {subsLoading ? (
            <div className="py-8 text-center text-xs text-gray-500">Loading payment history...</div>
          ) : subscriptions.length === 0 ? (
            <div className="py-10 text-center">
              <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-gray-800">No past payments found</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                You have not purchased any subscriptions yet.
              </p>
              <Link href="/#pricing">
                <Button size="sm" className="bg-emerald-600 text-white text-xs">
                  View Official Rate Card
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Plan Name</th>
                    <th className="py-3 px-4">Amount Paid</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Start Date</th>
                    <th className="py-3 px-4">Expiration Date</th>
                    <th className="py-3 px-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscriptions.map((sub: any) => {
                    const priceBdt = sub.pricePaid / 100;
                    const createdDate = new Date(sub.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const startDate = sub.startDate
                      ? new Date(sub.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      : "Pending Payment";
                    const endDate = sub.endDate
                      ? new Date(sub.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      : "N/A";

                    return (
                      <tr key={sub.id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{sub.planName}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          ৳{priceBdt.toLocaleString("en-US")}
                        </td>
                        <td className="py-3.5 px-4">
                          {sub.status === "ACTIVE" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ACTIVE
                            </span>
                          ) : sub.status === "PENDING" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              PENDING
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
                              {sub.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 font-mono">{startDate}</td>
                        <td className="py-3.5 px-4 text-gray-600 font-mono">{endDate}</td>
                        <td className="py-3.5 px-4 text-gray-500 font-mono">{createdDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
