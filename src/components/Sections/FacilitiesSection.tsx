"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { FACILITIES_DATA } from "@/data/gymData";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import MagneticButton from "@/components/Motion/MagneticButton";

export default function FacilitiesSection() {
  const { language, t } = useLanguage();
  const [activeHoverId, setActiveHoverId] = useState<string>("ac");

  const facilityImages: Record<string, string> = {
    ac: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    equipment: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    trainers: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
    slots: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    "free-weights": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    cardio: "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80",
    lockers: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    nutrition: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
  };

  const handleScheduleTour = () => {
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

  const activeFacility = FACILITIES_DATA.find((f) => f.id === activeHoverId);

  return (
    <section id="facilities" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0c0c0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#22c55e] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>Facilities & Equipment</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "সুযোগ-সুবিধা ও ক্যাপাসিটি" : "World-Class Facilities"}
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "প্রতিটি মেশিনারি ও জোন আন্তর্জাতিক বায়োমেকানিক্যাল মান অনুযায়ী সাজানো, যাতে ভিড় ও বিরক্তিহীন ওয়ার্কআউট নিশ্চিত হয়।"
              : "Calibrated infrastructure engineered to eliminate friction, waiting, and environmental discomfort for every member."}
          </p>
        </div>

        {/* Master Index & Visual Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Interactive Specification Rows */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-white/[0.08] relative">
            {FACILITIES_DATA.map((facility, idx) => {
              const isHovered = activeHoverId === facility.id;
              const title = language === "bn" ? facility.titleBn : facility.titleEn;
              const description =
                language === "bn" ? facility.descriptionBn : facility.descriptionEn;
              const badge = language === "bn" ? facility.badgeBn : facility.badgeEn;

              return (
                <div
                  key={facility.id}
                  onClick={() => setActiveHoverId(facility.id)}
                  onMouseEnter={() => setActiveHoverId(facility.id)}
                  className={`py-5 transition-all duration-200 cursor-pointer group relative rounded-xl px-4 ${
                    isHovered ? "bg-white/[0.03]" : "hover:bg-white/[0.015]"
                  }`}
                >
                  {isHovered && (
                    <motion.div
                      layoutId="activeFacilityIndicator"
                      className="absolute inset-0 bg-white/[0.03] border-l-2 border-[#22c55e] rounded-xl z-0 pointer-events-none"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-1.5 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold ${isHovered ? "text-[#22c55e]" : "text-zinc-500"}`}>
                        0{idx + 1}
                      </span>
                      <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
                        isHovered ? "text-white" : "text-zinc-300 group-hover:text-white"
                      }`}>
                        {title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-colors ${
                        isHovered
                          ? "bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30"
                          : "bg-white/[0.03] text-zinc-400 border border-white/[0.06]"
                      }`}>
                        {badge}
                      </span>
                      <ArrowUpRight className={`w-3.5 h-3.5 transition-all hidden sm:block ${
                        isHovered ? "text-[#22c55e] opacity-100" : "text-zinc-600 opacity-0 group-hover:opacity-100"
                      }`} />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-7 max-w-xl relative z-10">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Sticky Photo Inspection Window */}
          <div className="lg:col-span-5 sticky top-28 hidden lg:block">
            <div className="relative border border-white/[0.08] p-3 bg-[#0e0e12] rounded-2xl shadow-2xl overflow-hidden">
              <div className="aspect-[4/3] relative w-full overflow-hidden bg-zinc-900 rounded-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeHoverId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={
                        facilityImages[activeHoverId] ||
                        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt="Facility Preview"
                      fill
                      className="object-cover contrast-105"
                      sizes="500px"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Status Caption */}
              <div className="pt-3 pb-1 px-1 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                  <span className="font-medium text-white">
                    {activeFacility ? (language === "bn" ? activeFacility.titleBn : activeFacility.titleEn) : "Facility Preview"}
                  </span>
                </div>
                <span className="text-[#22c55e] font-medium text-[11px]">
                  Verified Standard
                </span>
              </div>

              {/* Action CTA */}
              <div className="mt-3 pt-3 border-t border-white/[0.08]">
                <MagneticButton
                  onClick={handleScheduleTour}
                  className="w-full py-2.5 px-4 bg-white/[0.04] hover:bg-[#22c55e] text-zinc-200 hover:!text-black text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Schedule Facility Tour</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
