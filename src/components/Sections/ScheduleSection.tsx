"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { SHIFTS_DATA } from "@/data/gymData";
import { Clock, CheckCircle2, Shield, User, ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/Motion/MagneticButton";

export default function ScheduleSection() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "male" | "female" | "combined">("all");
  const [activeShiftId, setActiveShiftId] = useState<string>("");

  useEffect(() => {
    const updateActiveShift = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Shift definitions in minutes from midnight
      // 07:00 - 11:30 (420 - 690) -> male-morning
      // 12:00 - 16:30 (720 - 990) -> female-afternoon
      // 16:30 - 18:30 (990 - 1110) -> combined-evening
      // 18:30 - 22:30 (1110 - 1350) -> male-night
      if (currentMinutes >= 420 && currentMinutes < 690) {
        setActiveShiftId("male-morning");
      } else if (currentMinutes >= 720 && currentMinutes < 990) {
        setActiveShiftId("female-afternoon");
      } else if (currentMinutes >= 990 && currentMinutes < 1110) {
        setActiveShiftId("combined-evening");
      } else if (currentMinutes >= 1110 && currentMinutes < 1350) {
        setActiveShiftId("male-night");
      } else {
        setActiveShiftId("");
      }
    };

    updateActiveShift();
    const interval = setInterval(updateActiveShift, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredShifts =
    activeTab === "all"
      ? SHIFTS_DATA
      : SHIFTS_DATA.filter((s) => s.category === activeTab);

  const handleBookSlot = (shiftName: string) => {
    const el = document.getElementById("contact");
    if (el) {
      const topOffset = 75;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="schedule" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-white dark:bg-[#0b0b0d]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#22c55e] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>Timetable & Shifts</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "শিফট ও সময়সূচি" : "Shift Architecture"}
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "২টি পুরুষ শিফট এবং নারী প্রশিক্ষক পরিচালিত ১টি কঠোরভাবে ব্যক্তিগত নারী শিফটে বিভক্ত।"
              : "Structured time slots ensuring focused space, zero overcrowding, and dedicated privacy for every member."}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {[
            { key: "all", label: t.schedule.tabAll },
            { key: "male", label: t.schedule.tabMale },
            { key: "female", label: t.schedule.tabFemale },
            { key: "combined", label: t.schedule.tabCombined },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#22c55e] !text-black shadow-md shadow-[#22c55e]/20"
                    : "bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Shift Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredShifts.map((shift, idx) => {
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
              <motion.div
                key={shift.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isLive
                    ? "bg-white/[0.04] border-[#22c55e]/60 shadow-lg shadow-[#22c55e]/10"
                    : "bg-[#0e0e12] border-white/[0.08] hover:border-white/[0.18]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                      {badge}
                    </span>

                    {isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22c55e]/15 text-[#22c55e] text-xs font-semibold border border-[#22c55e]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                        <span>Active Now</span>
                      </span>
                    )}
                  </div>

                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                    {time}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {name}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                    {description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>Coach: <strong className="text-zinc-200">{trainer}</strong></span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                    isFemale
                      ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20"
                      : "text-zinc-400"
                  }`}>
                    {isFemale ? "Strict Privacy" : "General Access"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Schedule Summary Strip */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0e0e12] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#22c55e] shrink-0" />
            <span>Open 7 Days a week • Central AC runs continuously during all active shifts</span>
          </div>

          <a
            href="#contact"
            className="text-[#22c55e] font-semibold hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>Have scheduling questions? Inquire with front desk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
