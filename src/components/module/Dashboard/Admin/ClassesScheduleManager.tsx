"use client";

import React, { useState } from "react";
import {
  useGetClassTypesQuery,
  useGetClassSessionsQuery,
  useCreateClassTypeMutation,
  useCreateSessionMutation,
  useCreateRecurringSessionsMutation,
  useCancelSessionMutation,
  ClassType,
  ClassSession,
} from "@/redux/api/classApi";
import { useGetTrainersQuery, TrainerProfile } from "@/redux/api/trainerApi";
import {
  Calendar,
  Clock,
  Dumbbell,
  Plus,
  Repeat,
  Trash2,
  Users,
  MapPin,
  CheckCircle2,
  Loader2,
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

export default function ClassesScheduleManager() {
  const [activeSubTab, setActiveSubTab] = useState<"sessions" | "types">("sessions");

  // Queries
  const { data: typesResponse, isLoading: typesLoading, refetch: refetchTypes } =
    useGetClassTypesQuery(undefined) as any;
  const classTypes: ClassType[] = typesResponse?.data || [];

  const { data: sessionsResponse, isLoading: sessionsLoading, refetch: refetchSessions } =
    useGetClassSessionsQuery(undefined) as any;
  const sessions: ClassSession[] = sessionsResponse?.data || [];

  const { data: trainersResponse } = useGetTrainersQuery(undefined) as any;
  const trainers: TrainerProfile[] = trainersResponse?.data || [];

  // Mutations
  const [createClassType, { isLoading: isCreatingType }] = useCreateClassTypeMutation();
  const [createSession, { isLoading: isCreatingSession }] = useCreateSessionMutation();
  const [createRecurring, { isLoading: isCreatingRecurring }] = useCreateRecurringSessionsMutation();
  const [cancelSession, { isLoading: isCancelling }] = useCancelSessionMutation();

  // Modals
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);

  // Form states: Class Type
  const [typeName, setTypeName] = useState("");
  const [typeDescription, setTypeDescription] = useState("");
  const [typeDifficulty, setTypeDifficulty] = useState<
    "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS"
  >("ALL_LEVELS");
  const [typeDuration, setTypeDuration] = useState("60");

  // Form states: Individual Session
  const [selectedClassTypeId, setSelectedClassTypeId] = useState("");
  const [selectedTrainerId, setSelectedTrainerId] = useState("");
  const [sessionStart, setSessionStart] = useState("");
  const [sessionEnd, setSessionEnd] = useState("");
  const [sessionCapacity, setSessionCapacity] = useState("15");
  const [sessionRoom, setSessionRoom] = useState("Studio 1");

  // Form states: Recurring Schedule
  const [recDayOfWeek, setRecDayOfWeek] = useState("1"); // 1 = Mon
  const [recStartTime, setRecStartTime] = useState("09:00");
  const [recDuration, setRecDuration] = useState("60");
  const [recWeeks, setRecWeeks] = useState("4");

  const handleCreateClassType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClassType({
        name: typeName,
        description: typeDescription,
        difficulty: typeDifficulty,
        durationMinutes: parseInt(typeDuration, 10),
      }).unwrap();
      toast.success(`Class type "${typeName}" created successfully`);
      setTypeModalOpen(false);
      setTypeName("");
      setTypeDescription("");
      refetchTypes();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create class type");
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassTypeId || !selectedTrainerId || !sessionStart || !sessionEnd) {
      toast.error("Please fill in all session fields");
      return;
    }
    try {
      await createSession({
        classTypeId: selectedClassTypeId,
        trainerId: selectedTrainerId,
        startsAt: new Date(sessionStart).toISOString(),
        endsAt: new Date(sessionEnd).toISOString(),
        capacity: parseInt(sessionCapacity, 10),
        room: sessionRoom,
      }).unwrap();
      toast.success("Class session scheduled successfully");
      setSessionModalOpen(false);
      refetchSessions();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to schedule session");
    }
  };

  const handleCreateRecurring = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassTypeId || !selectedTrainerId) {
      toast.error("Please select a class type and instructor");
      return;
    }
    try {
      const res = await createRecurring({
        classTypeId: selectedClassTypeId,
        trainerId: selectedTrainerId,
        dayOfWeek: parseInt(recDayOfWeek, 10),
        startTime: recStartTime,
        durationMinutes: parseInt(recDuration, 10),
        capacity: parseInt(sessionCapacity, 10),
        room: sessionRoom,
        numberOfWeeks: parseInt(recWeeks, 10),
      }).unwrap();
      toast.success(
        (res as any)?.message || `Successfully generated recurring sessions for ${recWeeks} weeks`
      );
      setRecurringModalOpen(false);
      refetchSessions();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to generate recurring schedule");
    }
  };

  const handleCancelSession = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this session? All member bookings will be cancelled.")) {
      return;
    }
    try {
      await cancelSession(id).unwrap();
      toast.success("Session cancelled and attendees notified");
      refetchSessions();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel session");
    }
  };

  return (
    <div className="space-y-4 text-white">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0e0e12] p-4 rounded-xs border border-white/[0.08] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#22c55e]/10 text-[#22c55e] rounded-xs border border-[#22c55e]/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tight">
              Classes & Schedule Management
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Configure class offerings, schedule daily sessions, or bulk-generate weekly calendars.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setTypeModalOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs font-mono uppercase tracking-wider rounded-sm border-white/[0.12] bg-white/[0.02] text-white hover:bg-white/[0.08] gap-1.5 cursor-pointer"
          >
            <Dumbbell size={14} />
            <span>New Class Type</span>
          </Button>

          <Button
            onClick={() => setRecurringModalOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs font-mono uppercase tracking-wider rounded-sm gap-1.5 border-[#22c55e]/30 text-[#22c55e] bg-[#22c55e]/5 hover:bg-[#22c55e]/15 cursor-pointer"
          >
            <Repeat size={14} />
            <span>Bulk Weekly Generator</span>
          </Button>

          <Button
            onClick={() => setSessionModalOpen(true)}
            size="sm"
            className="text-xs font-mono uppercase tracking-wider font-black gap-1.5 bg-[#22c55e] hover:bg-[#16a34a] !text-black cursor-pointer rounded-sm shadow-md shadow-[#22c55e]/20"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>Schedule Session</span>
          </Button>
        </div>
      </div>

      {/* Sub-tab Switcher */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveSubTab("sessions")}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all cursor-pointer font-mono uppercase tracking-wider ${
            activeSubTab === "sessions"
              ? "border-[#22c55e] text-[#22c55e]"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Scheduled Sessions ({sessions.length})
        </button>
        <button
          onClick={() => setActiveSubTab("types")}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all cursor-pointer font-mono uppercase tracking-wider ${
            activeSubTab === "types"
              ? "border-[#22c55e] text-[#22c55e]"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Class Types Catalog ({classTypes.length})
        </button>
      </div>

      {/* Sessions View */}
      {activeSubTab === "sessions" ? (
        sessionsLoading ? (
          <div className="flex h-48 items-center justify-center bg-[#0e0e12] rounded-xs border border-white/[0.08]">
            <Loader2 className="w-6 h-6 animate-spin text-[#22c55e]" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-[#0e0e12] p-12 text-center rounded-xs border border-white/[0.08] shadow-lg">
            <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No sessions currently scheduled</p>
            <p className="text-xs text-zinc-400 mt-1">Use &quot;Schedule Session&quot; or the &quot;Bulk Weekly Generator&quot; to populate your timetable.</p>
          </div>
        ) : (
          <div className="bg-[#0e0e12] rounded-xs border border-white/[0.08] shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Class & Room</th>
                    <th className="py-3 px-4">Instructor</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Bookings / Capacity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {sessions.map((session) => {
                    const starts = new Date(session.startsAt);
                    const ends = new Date(session.endsAt);
                    const isCancelled = session.status === "CANCELLED";

                    return (
                      <tr key={session.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">
                            {session.classType?.name || "Class"}
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#22c55e]" />
                            <span>{session.room || "Studio 1"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-zinc-200">
                            {session.trainer?.name || "Assigned Coach"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">
                            {starts.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            {starts.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {ends.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-white font-mono">
                            {session.bookedCount || 0}
                          </span>
                          <span className="text-zinc-500 font-mono"> / {session.capacity} spots</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              isCancelled
                                ? "destructive"
                                : session.status === "COMPLETED"
                                ? "secondary"
                                : "default"
                            }
                            className={`text-[10px] font-mono ${
                              !isCancelled && session.status !== "COMPLETED"
                                ? "bg-[#22c55e] text-black font-bold"
                                : session.status === "COMPLETED"
                                ? "bg-white/[0.08] text-zinc-400"
                                : ""
                            }`}
                          >
                            {session.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!isCancelled && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelSession(session.id)}
                              className="h-7 px-2 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30 cursor-pointer"
                            >
                              <Trash2 size={12} />
                              <span>Cancel</span>
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Class Types Catalog View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classTypes.map((type) => (
            <div
              key={type.id}
              className="bg-[#0e0e12] p-5 rounded-xs border border-white/[0.08] shadow-lg flex flex-col justify-between hover:border-[#22c55e]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-[10px] font-mono border-white/[0.12] text-zinc-300">
                    {type.difficulty}
                  </Badge>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock size={12} />
                    {type.durationMinutes} min
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{type.name}</h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-3">
                  {type.description || "No description provided."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-500">
                <span>Slug: /{type.slug}</span>
                <span className="text-[#22c55e] font-semibold font-mono">ACTIVE</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: New Class Type */}
      <Dialog open={typeModalOpen} onOpenChange={setTypeModalOpen}>
        <DialogContent className="max-w-md bg-[#0e0e12] border-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">
              Create New Class Type
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Define a reusable workout format (e.g. HIIT, CrossFit, Yoga).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClassType} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Class Type Name *
              </label>
              <Input
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="e.g. Functional Strength & Hypertrophy"
                required
                className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={typeDifficulty}
                  onChange={(e) => setTypeDifficulty(e.target.value as any)}
                  className="w-full h-9 border border-white/[0.12] rounded-xs px-2 text-xs bg-[#0b0b0d] text-white focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                >
                  <option value="ALL_LEVELS" className="bg-[#0e0e12] text-white">All Levels</option>
                  <option value="BEGINNER" className="bg-[#0e0e12] text-white">Beginner</option>
                  <option value="INTERMEDIATE" className="bg-[#0e0e12] text-white">Intermediate</option>
                  <option value="ADVANCED" className="bg-[#0e0e12] text-white">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Duration (Minutes)
                </label>
                <Input
                  type="number"
                  value={typeDuration}
                  onChange={(e) => setTypeDuration(e.target.value)}
                  placeholder="60"
                  required
                  className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Description
              </label>
              <Textarea
                value={typeDescription}
                onChange={(e) => setTypeDescription(e.target.value)}
                placeholder="Workout objectives, equipment used, and prerequisites..."
                rows={3}
                className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
              />
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTypeModalOpen(false)}
                className="text-xs border-white/[0.12] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingType}
                className="text-xs bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold font-mono uppercase"
              >
                {isCreatingType ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Create Class Type"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Schedule Individual Session */}
      <Dialog open={sessionModalOpen} onOpenChange={setSessionModalOpen}>
        <DialogContent className="max-w-md bg-[#0e0e12] border-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">
              Schedule Class Session
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Add a single session to the gym timetable.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSession} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Select Class Type *
              </label>
              <select
                value={selectedClassTypeId}
                onChange={(e) => setSelectedClassTypeId(e.target.value)}
                className="w-full h-9 border border-white/[0.12] rounded-xs px-2 text-xs bg-[#0b0b0d] text-white focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                required
              >
                <option value="" className="bg-[#0e0e12] text-white">-- Choose Class Type --</option>
                {classTypes.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#0e0e12] text-white">
                    {t.name} ({t.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Assign Instructor *
              </label>
              <select
                value={selectedTrainerId}
                onChange={(e) => setSelectedTrainerId(e.target.value)}
                className="w-full h-9 border border-white/[0.12] rounded-xs px-2 text-xs bg-[#0b0b0d] text-white focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                required
              >
                <option value="" className="bg-[#0e0e12] text-white">-- Choose Coach --</option>
                {trainers.map((t) => (
                  <option key={t.userId} value={t.userId} className="bg-[#0e0e12] text-white">
                    {t.user?.name || "Trainer"} ({t.user?.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Start Date & Time *
                </label>
                <Input
                  type="datetime-local"
                  value={sessionStart}
                  onChange={(e) => setSessionStart(e.target.value)}
                  required
                  className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  End Date & Time *
                </label>
                <Input
                  type="datetime-local"
                  value={sessionEnd}
                  onChange={(e) => setSessionEnd(e.target.value)}
                  required
                  className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Capacity (Spots) *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={sessionCapacity}
                  onChange={(e) => setSessionCapacity(e.target.value)}
                  required
                  className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Studio / Room
                </label>
                <Input
                  value={sessionRoom}
                  onChange={(e) => setSessionRoom(e.target.value)}
                  placeholder="Studio 1"
                  className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSessionModalOpen(false)}
                className="text-xs border-white/[0.12] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingSession}
                className="text-xs bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold font-mono uppercase"
              >
                {isCreatingSession ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Schedule Session"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Bulk Recurring Schedule Generator */}
      <Dialog open={recurringModalOpen} onOpenChange={setRecurringModalOpen}>
        <DialogContent className="max-w-md bg-[#0e0e12] border-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <Repeat className="w-4 h-4 text-[#22c55e]" />
              <span>Bulk Recurring Weekly Generator</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Generate recurring weekly sessions automatically for up to 12 weeks ahead.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRecurring} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Select Class Type *
              </label>
              <select
                value={selectedClassTypeId}
                onChange={(e) => setSelectedClassTypeId(e.target.value)}
                className="w-full h-9 border border-white/[0.12] rounded-xs px-2 text-xs bg-[#0b0b0d] text-white focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                required
              >
                <option value="" className="bg-[#0e0e12] text-white">-- Choose Class Type --</option>
                {classTypes.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#0e0e12] text-white">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Assign Instructor *
              </label>
              <select
                value={selectedTrainerId}
                onChange={(e) => setSelectedTrainerId(e.target.value)}
                className="w-full h-9 border border-white/[0.12] rounded-xs px-2 text-xs bg-[#0b0b0d] text-white focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                required
              >
                <option value="" className="bg-[#0e0e12] text-white">-- Choose Coach --</option>
                {trainers.map((t) => (
                  <option key={t.userId} value={t.userId} className="bg-[#0e0e12] text-white">
                    {t.user?.name || "Trainer"} ({t.user?.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Day of Week *
                </label>
                <select
                  value={recDayOfWeek}
                  onChange={(e) => setRecDayOfWeek(e.target.value)}
                  className="w-full h-9 border border-white/[0.12] rounded-xs px-2 text-xs bg-[#0b0b0d] text-white focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                >
                  <option value="0" className="bg-[#0e0e12] text-white">Sunday</option>
                  <option value="1" className="bg-[#0e0e12] text-white">Monday</option>
                  <option value="2" className="bg-[#0e0e12] text-white">Tuesday</option>
                  <option value="3" className="bg-[#0e0e12] text-white">Wednesday</option>
                  <option value="4" className="bg-[#0e0e12] text-white">Thursday</option>
                  <option value="5" className="bg-[#0e0e12] text-white">Friday</option>
                  <option value="6" className="bg-[#0e0e12] text-white">Saturday</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Start Time (HH:mm) *
                </label>
                <Input
                  type="time"
                  value={recStartTime}
                  onChange={(e) => setRecStartTime(e.target.value)}
                  required
                  className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Duration (min)
                </label>
                <Input
                  type="number"
                  value={recDuration}
                  onChange={(e) => setRecDuration(e.target.value)}
                  required
                  className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Capacity
                </label>
                <Input
                  type="number"
                  value={sessionCapacity}
                  onChange={(e) => setSessionCapacity(e.target.value)}
                  required
                  className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Weeks Ahead
                </label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={recWeeks}
                  onChange={(e) => setRecWeeks(e.target.value)}
                  required
                  className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Studio / Room
              </label>
              <Input
                value={sessionRoom}
                onChange={(e) => setSessionRoom(e.target.value)}
                placeholder="Studio 1"
                className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
              />
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRecurringModalOpen(false)}
                className="text-xs border-white/[0.12] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingRecurring}
                className="text-xs bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold font-mono uppercase"
              >
                {isCreatingRecurring ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Generate Sessions"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
