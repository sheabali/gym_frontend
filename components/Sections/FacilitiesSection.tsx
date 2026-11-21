"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { FACILITIES_DATA } from "@/data/gymData";
import { ArrowUpRight } from "lucide-react";

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

  return (
    <section id="facilities" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0c0c0f]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-zinc-400 mb-2">
              [ 02 // SPACES & EQUIPMENT ]
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
        </div>

        {/* Master Architectural Index & Live Visual Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Interactive Specification Rows (8 Items) */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-white/[0.08]">
            {FACILITIES_DATA.map((facility, idx) => {
              const isHovered = activeHoverId === facility.id;
              const title = language === "bn" ? facility.titleBn : facility.titleEn;
              const description =
                language === "bn" ? facility.descriptionBn : facility.descriptionEn;
              const badge = language === "bn" ? facility.badgeBn : facility.badgeEn;

              return (
                <div
                  key={facility.id}
                  onMouseEnter={() => setActiveHoverId(facility.id)}
                  className={`py-6 transition-all duration-300 cursor-pointer group ${isHovered ? "pl-3 bg-white/[0.02]" : "hover:pl-2"
                    }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-baseline gap-4">
                      <span className="mono-label text-[11px] text-zinc-500 font-bold">
                        0{idx + 1}
                      </span>
                      <h3
                        className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${isHovered ? "text-white" : "text-zinc-300 group-hover:text-white"
                          }`}
                      >
                        {title}
                      </h3>
                    </div>

                    {badge && (
                      <span className="text-[10px] mono-label text-zinc-400 px-2 py-0.5 border border-white/[0.08] shrink-0">
                        {badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-8 max-w-xl">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Sticky Architectural Photo Inspection Window */}
          <div className="lg:col-span-5 sticky top-28 hidden lg:block">
            <div className="border border-white/[0.08] p-2 bg-[#121216]">
              <div className="aspect-[4/3] relative w-full overflow-hidden bg-zinc-900">
                <Image
                  src={
                    facilityImages[activeHoverId] ||
                    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt="Facility Preview"
                  fill
                  className="object-cover transition-all duration-700 contrast-105"
                  sizes="500px"
                />
              </div>

              <div className="pt-3 pb-1 px-2 flex items-center justify-between text-[11px] mono-label text-zinc-400">
                <span>INSPECTION FRAME // LIVE</span>
                <span className="text-[#22c55e] font-mono">SELECTED: {activeHoverId.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
