"use client";

import React, { useState } from "react";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetClassSessionsQuery, ClassSession } from "@/redux/api/classApi";
import {
  useGetSessionRosterQuery,
  useMarkAttendanceMutation,
  RosterAttendee,
} from "@/redux/api/bookingApi";
import { useUpdateMyProfileMutation } from "@/redux/api/trainerApi";
import { useAppSelector } from "@/redux/hooks";
import {
  Calendar,
  Clock,
  Dumbbell,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  MapPin,
  Sparkles,
  UserCheck,
  ShieldCheck,
  Edit3,
  Save,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function TrainerDashboardPage() {
  const token = useAppSelector((state) => state.auth.token);
  const [activeTab, setActiveTab] = useState<"classes" | "profile">("classes");
  const [filterState, setFilterState] = useState<"ALL" | "TODAY" | "UPCOMING">("ALL");

  // Selected session for roster attendance inspection
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);

  // Queries
  const { data: meResponse, isLoading: meLoading } = useGetMeQuery(undefined, {
    skip: !token,
  }) as any;
  const user = meResponse?.data || meResponse;

  const { data: sessionsResponse, isLoading: sessionsLoading } = useGetClassSessionsQuery(
    undefined,
    { skip: !token }
  ) as any;
  const allSessions: ClassSession[] = sessionsResponse?.data || [];

  // Filter sessions assigned to this trainer (or show all if admin)
  const mySessions = allSessions.filter((s) => {
    if (!user) return false;
    if (user.role === "ADMIN") return true;
    return s.trainerId === user.id;
  });

  // Filter logic: Today, Upcoming, All
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const filteredSessions = mySessions.filter((s) => {
    const sessionDate = new Date(s.startsAt).toISOString().split("T")[0];
    if (filterState === "TODAY") {
      return sessionDate === todayStr;
    }
    if (filterState === "UPCOMING") {
      return new Date(s.startsAt) >= now;
    }
    return true;
  });

  // Roster query for the selected session
  const {
    data: rosterResponse,
    isLoading: rosterLoading,
    refetch: refetchRoster,
  } = useGetSessionRosterQuery(selectedSession?.id || "", {
    skip: !selectedSession?.id || !rosterModalOpen,
  }) as any;
  const roster: RosterAttendee[] = rosterResponse?.data || [];

  // Attendance mutation
  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();

  // Profile update mutation
  const [updateMyProfile, { isLoading: isUpdatingProfile }] = useUpdateMyProfileMutation();
  const [bioInput, setBioInput] = useState<string>("");
  const [specialtiesInput, setSpecialtiesInput] = useState<string>("");
  const [certificationsInput, setCertificationsInput] = useState<string>("");
  const [profileInitialized, setProfileInitialized] = useState(false);

  // Populate profile form when user data loads
  React.useEffect(() => {
    if (user?.trainerProfile && !profileInitialized) {
      setBioInput(user.trainerProfile.bio || "");
      setSpecialtiesInput((user.trainerProfile.specialties || []).join(", "));
      setCertificationsInput((user.trainerProfile.certifications || []).join(", "));
      setProfileInitialized(true);
    }
  }, [user, profileInitialized]);

  const handleOpenRoster = (session: ClassSession) => {
    setSelectedSession(session);
    setRosterModalOpen(true);
  };

  const handleMarkStatus = async (
    bookingId: string,
    newStatus: "ATTENDED" | "NO_SHOW"
  ) => {
    try {
      await markAttendance({ bookingId, status: newStatus }).unwrap();
      toast.success(
        newStatus === "ATTENDED"
          ? "Attendance marked as ATTENDED"
          : "Attendance recorded as NO_SHOW"
      );
      refetchRoster();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update attendance");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const specialties = specialtiesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const certifications = certificationsInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      await updateMyProfile({
        bio: bioInput,
        specialties,
        certifications,
      }).unwrap();

      toast.success("Trainer profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (meLoading || sessionsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Calculate quick metrics
  const totalAssignedSessions = mySessions.length;
  const todaySessionsCount = mySessions.filter(
    (s) => new Date(s.startsAt).toISOString().split("T")[0] === todayStr
  ).length;
  const totalBookedAttendees = mySessions.reduce((acc, s) => acc + (s.bookedCount || 0), 0);

  return (
    <div className="space-y-6 container mx-auto py-2">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-xs border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Instructor Portal
            </span>
            <span className="text-xs text-gray-400">• Banasree Campus</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Coach {user?.name || "Trainer"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your daily class schedule, inspect confirmed member rosters, and mark real-time attendance.
          </p>
        </div>

        {/* Tab Switcher Controls */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xs border border-gray-200/80">
          <button
            onClick={() => setActiveTab("classes")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-all cursor-pointer ${
              activeTab === "classes"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            My Sessions & Attendance
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Trainer Profile
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xs border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Today&apos;s Sessions
            </span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {todaySessionsCount}
          </div>
          <p className="text-xs text-gray-400 mt-1">Scheduled for today</p>
        </div>

        <div className="bg-white p-5 rounded-xs border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Enrolled Members
            </span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {totalBookedAttendees}
          </div>
          <p className="text-xs text-gray-400 mt-1">Across all your active classes</p>
        </div>

        <div className="bg-white p-5 rounded-xs border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Sessions Taught
            </span>
            <Dumbbell className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {totalAssignedSessions}
          </div>
          <p className="text-xs text-gray-400 mt-1">Assigned roster history</p>
        </div>
      </div>

      {/* 3. Main Content Body */}
      {activeTab === "classes" ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xs border border-gray-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
              <span>Assigned Training Sessions</span>
            </div>

            <div className="inline-flex items-center p-0.5 bg-gray-100 rounded-xs border border-gray-200 text-xs font-medium">
              {(["ALL", "TODAY", "UPCOMING"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterState(filter)}
                  className={`px-3 py-1 rounded-xs transition-all cursor-pointer ${
                    filterState === filter
                      ? "bg-white text-gray-900 shadow-xs font-semibold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {filter === "ALL" ? "All Sessions" : filter === "TODAY" ? "Today" : "Upcoming"}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions Grid */}
          {filteredSessions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xs border border-gray-200/80 shadow-xs">
              <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">No sessions found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No classes match the selected filter. As an administrator schedules training sessions under your instructor profile, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session) => {
                const starts = new Date(session.startsAt);
                const ends = new Date(session.endsAt);
                const capacityPercentage = Math.round(
                  ((session.bookedCount || 0) / (session.capacity || 1)) * 100
                );
                const isFull = (session.bookedCount || 0) >= session.capacity;
                const isCancelled = session.status === "CANCELLED";

                return (
                  <div
                    key={session.id}
                    className="bg-white p-5 rounded-xs border border-gray-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {session.classType?.difficulty || "ALL LEVELS"}
                        </span>
                        <Badge
                          variant={
                            isCancelled
                              ? "destructive"
                              : session.status === "COMPLETED"
                              ? "secondary"
                              : "default"
                          }
                          className="text-[10px]"
                        >
                          {session.status}
                        </Badge>
                      </div>

                      <h3 className="text-base font-bold text-gray-900">
                        {session.classType?.name || "Fitness Class"}
                      </h3>

                      <div className="space-y-1.5 mt-3 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {starts.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {starts.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {ends.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{session.room || "Studio 1, Main Floor"}</span>
                        </div>
                      </div>

                      {/* Capacity Progress */}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Attendee Roster</span>
                          <span className="font-bold text-gray-900">
                            {session.bookedCount || 0} / {session.capacity} spots
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isFull ? "bg-rose-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, capacityPercentage)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOpenRoster(session)}
                      className="mt-5 w-full gap-2 text-xs font-semibold bg-gray-900 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Inspect Roster & Attendance</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Trainer Profile Management */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xs border border-gray-200/80 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-6">
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-gray-900">
                Edit Public Trainer Profile
              </h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Professional Bio
                </label>
                <Textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Share your coaching philosophy, athletic background, and experience..."
                  rows={4}
                  className="text-xs"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  This bio is featured on the public website coaches directory.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Specialties (Comma Separated)
                </label>
                <Input
                  value={specialtiesInput}
                  onChange={(e) => setSpecialtiesInput(e.target.value)}
                  placeholder="e.g. Strength & Conditioning, HIIT, Hypertrophy, Mobility"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Certifications (Comma Separated)
                </label>
                <Input
                  value={certificationsInput}
                  onChange={(e) => setCertificationsInput(e.target.value)}
                  placeholder="e.g. CSCS, ACE Certified Personal Trainer, CPR/AED"
                  className="text-xs"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  {isUpdatingProfile ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Profile Changes</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Profile Preview Card */}
          <div className="bg-white p-6 rounded-xs border border-gray-200/80 shadow-xs h-fit">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Directory Preview
            </h3>
            <div className="border border-emerald-100 bg-emerald-50/30 p-5 rounded-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                  Certified Instructor
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-900">{user?.name}</h4>
              <p className="text-xs text-gray-600 italic">
                {bioInput || "No bio published yet. Add your philosophy to help members connect."}
              </p>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Focus Disciplines
                </span>
                <div className="flex flex-wrap gap-1">
                  {specialtiesInput
                    ? specialtiesInput.split(",").map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono"
                        >
                          {s.trim()}
                        </span>
                      ))
                    : <span className="text-xs text-gray-400">None specified</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Session Roster & Attendance Modal */}
      <Dialog open={rosterModalOpen} onOpenChange={setRosterModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {selectedSession?.classType?.name}
              </span>
              <span className="text-xs text-gray-400">
                • {selectedSession?.room || "Studio 1"}
              </span>
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Class Session Attendee Roster
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {selectedSession &&
                new Date(selectedSession.startsAt).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
              • Total Booked: {roster.length} / {selectedSession?.capacity}
            </DialogDescription>
          </DialogHeader>

          {rosterLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : roster.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900">
                No members booked for this session yet
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Members will appear here once they reserve a spot through their portal.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-100 rounded-xs mt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Attendance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {roster.map((booking) => {
                    const isAttended = booking.status === "ATTENDED";
                    const isNoShow = booking.status === "NO_SHOW";
                    const isCancelled = booking.status === "CANCELLED";

                    return (
                      <tr key={booking.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-gray-900">
                            {booking.user?.name || "Member"}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            Booked:{" "}
                            {new Date(booking.bookedAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          <div>{booking.user?.email}</div>
                          <div className="text-[11px] text-gray-400">
                            {booking.user?.phone || "N/A"}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isAttended
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : isNoShow
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : isCancelled
                                ? "bg-gray-100 text-gray-600 border border-gray-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {isCancelled ? (
                            <span className="text-[11px] text-gray-400 italic">
                              Cancelled
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                disabled={isMarking || isAttended}
                                onClick={() => handleMarkStatus(booking.id, "ATTENDED")}
                                className={`h-7 px-2.5 text-[11px] font-semibold gap-1 rounded-xs cursor-pointer ${
                                  isAttended
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                }`}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{isAttended ? "Attended" : "Mark Present"}</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isMarking || isNoShow}
                                onClick={() => handleMarkStatus(booking.id, "NO_SHOW")}
                                className={`h-7 px-2.5 text-[11px] font-semibold gap-1 rounded-xs cursor-pointer ${
                                  isNoShow
                                    ? "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-50"
                                    : "border-gray-200 text-gray-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                                }`}
                              >
                                <XCircle className="w-3 h-3" />
                                <span>{isNoShow ? "No-Show" : "No-Show"}</span>
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
