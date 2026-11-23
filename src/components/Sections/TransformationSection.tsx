"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import TransformationSlider from "@/components/Interactive/TransformationSlider";
import BmiCalculator from "@/components/Interactive/BmiCalculator";

export default function TransformationSection() {
  const { language, t } = useLanguage();

  const metrics = [
    {
      value: "5,000+",
      labelEn: "ATHLETES TRAINED",
      labelBn: "সদস্যদের প্রশিক্ষণ",
      subEn: "Documented physical recomp",
      subBn: "মেদ হ্রাস ও পেশী বৃদ্ধি",
    },
    {
      value: "100%",
      labelEn: "INVERTER CLIMATE",
      labelBn: "সেন্ট্রাল এসি",
      subEn: "Continuous oxygen circulation",
      subBn: "উন্নত অক্সিজেন সার্কুলেশন",
    },
    {
      value: "50+",
      labelEn: "TRAINING STATIONS",
      labelBn: "কমার্শিয়াল মেশিনারি",
      subEn: "Imported biomechanical steel",
      subBn: "আন্তর্জাতিক মানের যন্ত্রপাতি",
    },
    {
      value: "4.4★",
      labelEn: "VERIFIED RATING",
      labelBn: "গুগল রেটিং",
      subEn: "173 local community audits",
      subBn: "১৭৩+ ভেরিফাইড রিভিউ",
    },
  ];

  return (
    <section id="transformation" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0c0c0f]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-zinc-400 mb-2 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>06 • PROVEN METRICS & AUDIT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "বাস্তব ফলাফল ও মেম্বার জার্নি" : "Measurable Results"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "ফলাফল কোনো দুর্ঘটনা নয়; এটি সঠিক টেকনিক, সেন্ট্রাল তাপমাত্রা এবং নিয়মিত অনুশীলনের ফল।"
              : "Progress is empirical. We track body composition, strength milestones, and cardiovascular endurance."}
          </p>
        </div>

        {/* 4 Architectural Telemetry Stats (Clean 1px Line Columns) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 border-b border-white/[0.08] pb-12">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="mono-label text-[10px] text-zinc-400 mb-1">
                {language === "bn" ? m.labelBn : m.labelEn}
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                {m.value}
              </div>
              <span className="text-xs text-zinc-400 mt-1">
                {language === "bn" ? m.subBn : m.subEn}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Case Study Slider */}
        <TransformationSlider />

        {/* Interactive Clinical BMI Tool */}
        <BmiCalculator />
      </div>
    </section>
  );
}
