"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO, TRANSFORMATION_STATS } from "@/data/gymData";
import Hero3DCanvas from "@/components/3D/Hero3DCanvas";
import { ArrowUpRight, Phone, ShieldCheck, Star } from "lucide-react";

export default function HeroSection() {
  const { language, t } = useLanguage();

  const handleScrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const topOffset = 75;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center border-b border-white/[0.06] pt-10 pb-16 px-4 sm:px-6 lg:px-8 bg-[#0b0b0d]"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left: Asymmetric Monumental Typography */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Architectural Telemetry Tag */}
            <div className="flex items-center gap-3 mb-6">
              <span className="mono-label text-zinc-400">
                [ 00 // BANASREE, DHAKA 1219 ]
              </span>
              <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
              <span className="mono-label text-[#22c55e] font-bold">
                EST. 2015 • PREMIER ATHLETIC SANCTUARY
              </span>
            </div>

            {/* Monumental Architectural Headline */}
            <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black tracking-[-0.04em] text-white uppercase leading-[0.95] mb-6">
              <span>DISCIPLINE.</span>
              <br />
              <span className="text-zinc-500 hover:text-white transition-colors duration-500">
                PRECISION.
              </span>
              <br />
              <span className="text-white relative inline-block">
                PLATINUM.
                <span className="absolute -bottom-2 left-0 w-16 h-[3px] bg-[#22c55e]" />
              </span>
            </h1>

            {/* Bengali Brand Identity Subhead */}
            <div className="text-sm sm:text-base font-semibold text-zinc-300 mb-6 font-sans">
              {language === "bn"
                ? "প্লাটিনাম জিম • বনশ্রীর সর্বাধুনিক সেন্ট্রাল এয়ার-কন্ডিশন্ড ফিটনেস সেন্টার"
                : "Platinum Gym (প্লাটিনাম জিম) • House-16, Road-03, Block-D, Banasree"}
            </div>

            {/* Editorial Body */}
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed mb-8 font-normal">
              {language === "bn"
                ? "তীব্র গরমেও স্বস্তিদায়ক ঠান্ডা আবহাওয়া, সকল প্রকার আন্তর্জাতিক মানের ইকুইপমেন্ট, পুরুষ ও নারীদের জন্য আলাদা শিফট এবং অভিজ্ঞ সার্টিফাইড ট্রেইনারদের আন্তরিক তত্ত্বাবধান।"
                : "A purposeful training sanctuary in Block-D, Banasree. Uncompromising climate control, biomechanically engineered machinery, and strictly dedicated shifts for male and female athletes."}
            </p>

            {/* Refined Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-12">
              <button
                type="button"
                onClick={() => handleScrollTo("contact")}
                className="px-6 py-3.5 bg-[#22c55e] !text-black text-xs uppercase tracking-wider font-black hover:bg-[#16a34a] transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xs shadow-lg shadow-[#22c55e]/25"
              >
                <span className="!text-black font-black">{t.hero.bookTrial}</span>
                <ArrowUpRight className="w-4 h-4 !text-black stroke-[2.5]" />
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="px-6 py-3.5 bg-transparent border border-white/[0.15] hover:border-white text-white text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-2.5 rounded-xs"
              >
                <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>DIRECT: {BUSINESS_INFO.phone}</span>
              </a>
            </div>

            {/* Telemetry Indicator Strip */}
            <div className="w-full pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <div className="mono-label text-[10px]">RATING</div>
                <div className="text-lg font-black text-white mt-0.5 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#22c55e] text-[#22c55e]" />
                  <span>4.4 / 5.0</span>
                </div>
                <div className="text-[11px] text-zinc-500">173 Google Reviews</div>
              </div>

              <div>
                <div className="mono-label text-[10px]">CLIMATE</div>
                <div className="text-lg font-black text-white mt-0.5">100% AC</div>
                <div className="text-[11px] text-zinc-500">Central Cooling</div>
              </div>

              <div>
                <div className="mono-label text-[10px]">SHIFTS</div>
                <div className="text-lg font-black text-white mt-0.5">2 MALE + 1 FEMALE</div>
                <div className="text-[11px] text-zinc-500">Dedicated Hours</div>
              </div>

              <div>
                <div className="mono-label text-[10px]">SCHEDULE</div>
                <div className="text-lg font-black text-white mt-0.5">07:00 DAILY</div>
                <div className="text-[11px] text-zinc-500">Banasree Block-D</div>
              </div>
            </div>
          </div>

          {/* Right: Architectural 3D Interactive Rig (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Architectural Frame with Corner Crosshairs */}
            <div className="w-full relative border border-white/[0.08] bg-[#0f0f13]/60 p-4 rounded-xs">
              {/* Corner crosshairs */}
              <span className="absolute -top-1.5 -left-1.5 text-zinc-600 font-mono text-xs select-none">+</span>
              <span className="absolute -top-1.5 -right-1.5 text-zinc-600 font-mono text-xs select-none">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 text-zinc-600 font-mono text-xs select-none">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 text-zinc-600 font-mono text-xs select-none">+</span>

              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-[10px] mono-label">
                <span>RIG.01 // OLYMPIC CHROME</span>
                <span>QC6J+VP DHAKA</span>
              </div>

              {/* 3D Canvas Rig */}
              <Hero3DCanvas />

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-[10px] mono-label">
                <span>ROTATION INTERACTION: DRAG</span>
                <span className="text-[#22c55e]">● LIVE TELEMETRY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
