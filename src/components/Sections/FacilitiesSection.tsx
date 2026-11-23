"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { FACILITIES_DATA } from "@/data/gymData";
import { ArrowUpRight } from "lucide-react";
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

  return (
    <section id="facilities" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0c0c0f] relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="pointer-events-none absolute top-1/4 right-0 w-96 h-96 bg-[#22c55e]/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with Staggered Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]"
        >
          <div>
            <div className="mono-label text-[#22c55e] mb-2 flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              <span>02 • SPACES & EQUIPMENT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "সুযোগ-সুবিধা ও ক্যাপাসিটি" : "Facility Specifications"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "প্রতিটি মেশিনারি ও জোন আন্তর্জাতিক বায়োমেকানিক্যাল মান অনুযায়ী সজ্জিত।"
              : "Calibrated infrastructure engineered to eliminate friction, waiting, and environmental discomfort."}
          </p>
        </motion.div>

        {/* Master Architectural Index & Live Visual Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Interactive Specification Rows (8 Items) */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-white/[0.08] relative">
            {FACILITIES_DATA.map((facility, idx) => {
              const isHovered = activeHoverId === facility.id;
              const title = language === "bn" ? facility.titleBn : facility.titleEn;
              const description =
                language === "bn" ? facility.descriptionBn : facility.descriptionEn;
              const badge = language === "bn" ? facility.badgeBn : facility.badgeEn;

              return (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  onClick={() => setActiveHoverId(facility.id)}
                  onMouseEnter={() => setActiveHoverId(facility.id)}
                  whileHover={{ x: 6 }}
                  className={`py-6 transition-all duration-300 cursor-pointer group relative rounded-xs px-3 ${
                    isHovered ? "text-white" : "hover:bg-white/[0.01]"
                  }`}
                >
                  {/* Floating active pill layoutId animation */}
                  {isHovered && (
                    <motion.div
                      layoutId="activeFacilityIndicator"
                      className="absolute inset-0 bg-white/[0.03] border-l-2 border-[#22c55e] rounded-xs z-0 pointer-events-none shadow-[inset_0_0_20px_rgba(34,197,94,0.03)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  <div className="relative z-10 flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-baseline gap-3">
                      {/* Interactive Pulse / Number Indicator */}
                      <div className="flex items-center gap-1.5 min-w-[36px]">
                        {isHovered ? (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
                          </span>
                        ) : null}
                        <span
                          className={`mono-label text-[11px] font-bold font-mono transition-colors ${
                            isHovered ? "text-[#22c55e]" : "text-zinc-500 group-hover:text-zinc-300"
                          }`}
                        >
                          0{idx + 1}
                        </span>
                      </div>

                      <h3
                        className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                          isHovered ? "text-white" : "text-zinc-300 group-hover:text-white"
                        }`}
                      >
                        {title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {badge && (
                        <span
                          className={`text-[10px] mono-label px-2 py-0.5 border rounded-xs font-mono transition-all duration-300 ${
                            isHovered
                              ? "border-[#22c55e]/50 bg-[#22c55e]/10 text-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.15)]"
                              : "border-white/[0.08] text-zinc-400 bg-transparent"
                          }`}
                        >
                          {badge}
                        </span>
                      )}

                      {/* Interactive subtle arrow cue */}
                      <motion.div
                        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -4 }}
                        transition={{ duration: 0.2 }}
                        className="hidden sm:block"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#22c55e]" />
                      </motion.div>
                    </div>
                  </div>

                  <p className="relative z-10 text-xs sm:text-sm text-zinc-400 leading-relaxed pl-10 max-w-xl transition-colors group-hover:text-zinc-300">
                    {description}
                  </p>

                  {/* Inline preview on mobile with fluid accordion transition */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden overflow-hidden mt-4 pl-10"
                      >
                        <div className="aspect-[16/9] relative w-full overflow-hidden rounded-xs border border-white/[0.12] bg-zinc-900 shadow-xl">
                          <Image
                            src={
                              facilityImages[facility.id] ||
                              "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                            }
                            alt={title}
                            fill
                            className="object-cover contrast-105"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[9px] font-mono text-[#22c55e] border border-[#22c55e]/30 rounded-xs">
                            LIVE FEED
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Sticky Architectural Photo Inspection Window (Desktop) */}
          <div className="lg:col-span-5 sticky top-28 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative border border-white/[0.1] p-2 bg-[#121216] rounded-xs shadow-2xl overflow-hidden group"
            >
              {/* Corner HUD Reticles */}
              <div className="pointer-events-none absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-[#22c55e] z-30 opacity-80" />
              <div className="pointer-events-none absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-[#22c55e] z-30 opacity-80" />
              <div className="pointer-events-none absolute bottom-16 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-[#22c55e] z-30 opacity-80" />
              <div className="pointer-events-none absolute bottom-16 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-[#22c55e] z-30 opacity-80" />

              <div className="aspect-[4/3] relative w-full overflow-hidden bg-zinc-900 rounded-xs">
                {/* Fluid AnimatePresence crossfade and scaling */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeHoverId}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={
                        facilityImages[activeHoverId] ||
                        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt="Facility Preview"
                      fill
                      className="object-cover contrast-105 group-hover:scale-102 transition-transform duration-700"
                      sizes="500px"
                    />

                    {/* Cybernetic Scanning Laser Beam on Switch */}
                    <motion.div
                      key={`scan-${activeHoverId}`}
                      initial={{ top: "-10%" }}
                      animate={{ top: "110%" }}
                      transition={{ duration: 1.1, ease: "easeInOut" }}
                      className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#22c55e]/20 to-transparent z-20"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Telemetry Status Strip with Animated Audio/Live Wave */}
              <div className="pt-3 pb-1 px-2 flex items-center justify-between text-[11px] mono-label text-zinc-400">
                <div className="flex items-center gap-2">
                  {/* 3 bouncing telemetry bars */}
                  <div className="flex items-center gap-0.5">
                    <span className="w-0.5 h-2.5 bg-[#22c55e] rounded-full animate-pulse" />
                    <span className="w-0.5 h-3.5 bg-[#22c55e] rounded-full animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-[#22c55e] rounded-full animate-pulse delay-150" />
                  </div>
                  <span className="font-mono">INSPECTION FRAME • LIVE</span>
                </div>
                <span className="text-[#22c55e] font-mono font-bold">
                  SELECTED: {activeHoverId.toUpperCase()}
                </span>
              </div>

              {/* Magnetic Action CTA */}
              <div className="mt-2 pt-2 border-t border-white/[0.08]">
                <MagneticButton
                  onClick={handleScheduleTour}
                  className="w-full py-2.5 px-4 bg-white/[0.03] hover:bg-[#22c55e] text-zinc-300 hover:text-black font-mono text-xs uppercase tracking-wider font-black border border-white/[0.1] hover:border-[#22c55e] rounded-xs transition-colors duration-300 shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span className="font-black">SCHEDULE FACILITY TOUR</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform stroke-[2.5]" />
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
