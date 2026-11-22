"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO, SHIFTS_DATA } from "@/src/data/gymData";
import { useGetClassSessionsQuery } from "@/redux/api/classApi";
import { Clock, ArrowUpRight, Calendar, Users, MapPin } from "lucide-react";

export default function ScheduleSection() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "male" | "female" | "combined">("all");
  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);

  // Fetch live class sessions from backend
  const { data: sessionsResponse } = useGetClassSessionsQuery(undefined) as any;
  const liveSessions = sessionsResponse?.data || [];

  // Time-aware detection for current ongoing shift
  useEffect(() => {
    const evaluateShift = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();

      if (mins >= 420 && mins < 690) {
        setActiveShiftId("male-morning");
      } else if (mins >= 720 && mins < 990) {
        setActiveShiftId("female-shift");
      } else if (mins >= 990 && mins < 1110) {
        setActiveShiftId("combined-shift");
      } else if (mins >= 1110 && mins < 1350) {
        setActiveShiftId("male-evening");
      } else {
        setActiveShiftId(null);
      }
    };

    evaluateShift();
    const interval = setInterval(evaluateShift, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredShifts =
    activeTab === "all"
      ? SHIFTS_DATA
      : SHIFTS_DATA.filter((s) => s.category === activeTab);

  return (
    <section id="schedule" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0b0b0d]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-zinc-400 mb-2">
              [ 03 // TIMETABLE & SHIFTS ]
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "শিফট ও সময়সূচি" : "Shift Architecture"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "২টি পুরুষ শিফট এবং নারী ট্রেইনার পরিচালিত ১টি কঠোরভাবে ব্যক্তিগত নারী শিফটে বিভক্ত।"
              : "Structured segregation ensuring focus, space, and absolute privacy for all members."}
          </p>
        </div>

        {/* Minimalist Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/[0.06]">
          {[
            { key: "all", label: t.schedule.tabAll },
            { key: "male", label: t.schedule.tabMale },
            { key: "female", label: t.schedule.tabFemale },
            { key: "combined", label: t.schedule.tabCombined },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer rounded-xs ${activeTab === tab.key
                ? "bg-[#22c55e] !text-black font-black shadow-md shadow-[#22c55e]/20"
                : "text-zinc-400 hover:text-white border border-white/[0.08]"
                }`}
            >
              <span className={activeTab === tab.key ? "!text-black font-black" : ""}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Shift Timetable */}
        <div className="border border-white/[0.08] divide-y divide-white/[0.08] bg-[#0e0e12] mb-12">
          {filteredShifts.map((shift) => {
            const isFemale = shift.category === "female";
            const isLive = activeShiftId === shift.id;
            const name = language === "bn" ? shift.nameBn : shift.nameEn;
            const time = language === "bn" ? shift.timeBn : shift.timeEn;
            const badge = language === "bn" ? shift.badgeBn : shift.badgeEn;
            const description =
              language === "bn" ? shift.descriptionBn : shift.descriptionEn;
            const trainer =
              language === "bn" ? shift.trainerBn : shift.trainerEn;
            const days = language === "bn" ? shift.daysBn : shift.daysEn;

            return (
              <div
                key={shift.id}
                className={`p-6 sm:p-8 transition-colors ${isLive ? "bg-white/[0.03]" : "hover:bg-white/[0.015]"
                  }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-4 flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      {isLive && (
                        <span className="flex items-center gap-1.5 text-[10px] mono-label text-[#22c55e] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                          <span>NOW ACTIVE</span>
                        </span>
                      )}
                      <span className="text-[10px] mono-label text-zinc-400">
                        {badge}
                      </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {time}
                    </div>

                    <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{days}</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                      {name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg">
                      {description}
                    </p>
                  </div>

                  <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end text-left lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-white/[0.06]">
                    <div>
                      <div className="mono-label text-[10px] text-zinc-400">
                        COACH ON DUTY
                      </div>
                      <div className="text-xs font-semibold text-white mt-0.5">
                        {trainer}
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-[10px] mono-label px-2.5 py-1 border border-white/[0.08] text-zinc-400 inline-block">
                        {isFemale ? "100% PRIVATE • TINTED" : "STANDARD PROTOCOL"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Scheduled Group Sessions Feed (from API) */}
        {liveSessions.length > 0 && (
          <div className="p-6 bg-[#0e0e12] border border-white/[0.08] mb-12">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#22c55e]" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                  Live Scheduled Sessions & Booking Availability
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#22c55e] uppercase">
                {liveSessions.length} SESSIONS SCHEDULED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveSessions.slice(0, 6).map((session: any) => {
                const startsAt = new Date(session.startsAt);
                const timeStr = startsAt.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Dhaka",
                });
                const dateStr = startsAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  timeZone: "Asia/Dhaka",
                });
                const availableSeats = session.capacity - session.bookedCount;

                return (
                  <div
                    key={session.id}
                    className="p-4 rounded-xs bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                        <span>{dateStr} • {timeStr}</span>
                        <span className={`px-1.5 py-0.5 rounded-xs text-[10px] ${availableSeats > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                          }`}>
                          {availableSeats > 0 ? `${availableSeats} SEATS LEFT` : "FULL"}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">
                        {session.classType?.name || "Fitness Class"}
                      </h5>
                      <p className="text-xs text-zinc-400">
                        Instructor: {session.trainer?.name || "Floor Trainer"}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Room: {session.room || "Main Studio"}</span>
                      <a
                        href="/user"
                        className="text-[#22c55e] hover:underline flex items-center gap-0.5 font-semibold"
                      >
                        Book Session
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Schedule Disclaimers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-400 pt-4 border-t border-white/[0.06]">
          <span className="mono-label text-[11px]">
            {t.schedule.editableNotice}
          </span>
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="mono-label text-white hover:text-zinc-300 transition-colors flex items-center gap-1 shrink-0"
          >
            <span>CONFIRM DAILY TIMINGS: {BUSINESS_INFO.phone}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
