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
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xs border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Classes & Schedule Management
            </h2>
            <p className="text-xs text-gray-500">
              Configure class offerings, schedule daily sessions, or bulk-generate weekly calendars.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setTypeModalOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 cursor-pointer"
          >
            <Dumbbell size={14} />
            <span>New Class Type</span>
          </Button>

          <Button
            onClick={() => setRecurringModalOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 border-emerald-300 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 cursor-pointer"
          >
            <Repeat size={14} />
            <span>Bulk Weekly Generator</span>
          </Button>

          <Button
            onClick={() => setSessionModalOpen(true)}
            size="sm"
            className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            <Plus size={14} />
            <span>Schedule Session</span>
          </Button>
        </div>
      </div>

      {/* Sub-tab Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveSubTab("sessions")}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === "sessions"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Scheduled Sessions ({sessions.length})
        </button>
        <button
          onClick={() => setActiveSubTab("types")}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === "types"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Class Types Catalog ({classTypes.length})
        </button>
      </div>

      {/* Sessions View */}
      {activeSubTab === "sessions" ? (
        sessionsLoading ? (
          <div className="flex h-48 items-center justify-center bg-white rounded-xs border border-gray-200">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xs border border-gray-200 shadow-xs">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">No sessions currently scheduled</p>
            <p className="text-xs text-gray-500 mt-1">Use &quot;Schedule Session&quot; or the &quot;Bulk Weekly Generator&quot; to populate your timetable.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xs border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Class & Room</th>
                    <th className="py-3 px-4">Instructor</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Bookings / Capacity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sessions.map((session) => {
                    const starts = new Date(session.startsAt);
                    const ends = new Date(session.endsAt);
                    const isCancelled = session.status === "CANCELLED";

                    return (
                      <tr key={session.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">
                            {session.classType?.name || "Class"}
                          </div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span>{session.room || "Studio 1"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-800">
                            {session.trainer?.name || "Assigned Coach"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900">
                            {starts.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-[11px] text-gray-500 font-mono">
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
                          <span className="font-bold text-gray-900">
                            {session.bookedCount || 0}
                          </span>
                          <span className="text-gray-400"> / {session.capacity} spots</span>
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
                            className="text-[10px]"
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
                              className="h-7 px-2 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-gray-200 cursor-pointer"
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
              className="bg-white p-5 rounded-xs border border-gray-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {type.difficulty}
                  </Badge>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {type.durationMinutes} min
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900">{type.name}</h3>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                  {type.description || "No description provided."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Slug: /{type.slug}</span>
                <span className="text-emerald-700 font-semibold font-mono">ACTIVE</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: New Class Type */}
      <Dialog open={typeModalOpen} onOpenChange={setTypeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900">
              Create New Class Type
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Define a reusable workout format (e.g. HIIT, CrossFit, Yoga).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClassType} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Class Type Name *
              </label>
              <Input
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="e.g. Functional Strength & Hypertrophy"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={typeDifficulty}
                  onChange={(e) => setTypeDifficulty(e.target.value as any)}
                  className="w-full h-9 border border-gray-200 rounded-xs px-2 text-xs bg-white"
                >
                  <option value="ALL_LEVELS">All Levels</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Duration (Minutes)
                </label>
                <Input
                  type="number"
                  value={typeDuration}
                  onChange={(e) => setTypeDuration(e.target.value)}
                  placeholder="60"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={typeDescription}
                onChange={(e) => setTypeDescription(e.target.value)}
                placeholder="Workout objectives, equipment used, and prerequisites..."
                rows={3}
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTypeModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingType}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900">
              Schedule Class Session
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Add a single session to the gym timetable.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSession} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Select Class Type *
              </label>
              <select
                value={selectedClassTypeId}
                onChange={(e) => setSelectedClassTypeId(e.target.value)}
                className="w-full h-9 border border-gray-200 rounded-xs px-2 text-xs bg-white"
                required
              >
                <option value="">-- Choose Class Type --</option>
                {classTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Assign Instructor *
              </label>
              <select
                value={selectedTrainerId}
                onChange={(e) => setSelectedTrainerId(e.target.value)}
                className="w-full h-9 border border-gray-200 rounded-xs px-2 text-xs bg-white"
                required
              >
                <option value="">-- Choose Coach --</option>
                {trainers.map((t) => (
                  <option key={t.userId} value={t.userId}>
                    {t.user?.name || "Trainer"} ({t.user?.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Start Date & Time *
                </label>
                <Input
                  type="datetime-local"
                  value={sessionStart}
                  onChange={(e) => setSessionStart(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  End Date & Time *
                </label>
                <Input
                  type="datetime-local"
                  value={sessionEnd}
                  onChange={(e) => setSessionEnd(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Capacity (Spots) *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={sessionCapacity}
                  onChange={(e) => setSessionCapacity(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Studio / Room
                </label>
                <Input
                  value={sessionRoom}
                  onChange={(e) => setSessionRoom(e.target.value)}
                  placeholder="Studio 1"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSessionModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingSession}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-600" />
              <span>Bulk Recurring Weekly Generator</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Generate recurring weekly sessions automatically for up to 12 weeks ahead.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRecurring} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Select Class Type *
              </label>
              <select
                value={selectedClassTypeId}
                onChange={(e) => setSelectedClassTypeId(e.target.value)}
                className="w-full h-9 border border-gray-200 rounded-xs px-2 text-xs bg-white"
                required
              >
                <option value="">-- Choose Class Type --</option>
                {classTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Assign Instructor *
              </label>
              <select
                value={selectedTrainerId}
                onChange={(e) => setSelectedTrainerId(e.target.value)}
                className="w-full h-9 border border-gray-200 rounded-xs px-2 text-xs bg-white"
                required
              >
                <option value="">-- Choose Coach --</option>
                {trainers.map((t) => (
                  <option key={t.userId} value={t.userId}>
                    {t.user?.name || "Trainer"} ({t.user?.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Day of Week *
                </label>
                <select
                  value={recDayOfWeek}
                  onChange={(e) => setRecDayOfWeek(e.target.value)}
                  className="w-full h-9 border border-gray-200 rounded-xs px-2 text-xs bg-white"
                >
                  <option value="0">Sunday</option>
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Start Time (HH:mm) *
                </label>
                <Input
                  type="time"
                  value={recStartTime}
                  onChange={(e) => setRecStartTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Duration (min)
                </label>
                <Input
                  type="number"
                  value={recDuration}
                  onChange={(e) => setRecDuration(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Capacity
                </label>
                <Input
                  type="number"
                  value={sessionCapacity}
                  onChange={(e) => setSessionCapacity(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Weeks Ahead
                </label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={recWeeks}
                  onChange={(e) => setRecWeeks(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Studio / Room
              </label>
              <Input
                value={sessionRoom}
                onChange={(e) => setSessionRoom(e.target.value)}
                placeholder="Studio 1"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRecurringModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingRecurring}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
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
