"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { TRAINERS_DATA } from "@/data/gymData";
import { ArrowUpRight } from "lucide-react";

export default function TrainersSection() {
  const { language, t } = useLanguage();

  const handleInquire = () => {
    const el = document.getElementById("contact");
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
    <section id="trainers" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0c0c0f]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-zinc-400 mb-2">
              [ 04 // COACHING FACULTY ]
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "সার্টিফাইড প্রশিক্ষকবৃন্দ" : "Floor Supervision"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "সঠিক টেকনিক ও ফর্ম আঘাত থেকে রক্ষা করে। আমাদের প্রশিক্ষকরা প্রতিটি শিফটে ফ্লোরে উপস্থিত থাকেন।"
              : "Every set is observed. Our certified faculty enforces proper biomechanics, safe progression, and injury prevention."}
          </p>
        </div>

        {/* High-Fashion Editorial Roster Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRAINERS_DATA.map((trainer, idx) => {
            const name = language === "bn" ? trainer.nameBn : trainer.nameEn;
            const role = language === "bn" ? trainer.roleBn : trainer.roleEn;
            const experience =
              language === "bn" ? trainer.experienceBn : trainer.experienceEn;
            const shifts =
              language === "bn" ? trainer.shiftsBn : trainer.shiftsEn;
            const specialities =
              language === "bn" ? trainer.specialityBn : trainer.specialityEn;
            const isFemale = trainer.gender === "female";

            return (
              <div
                key={trainer.id}
                className="border border-white/[0.08] bg-[#0e0e12] p-2 flex flex-col justify-between group hover:border-white/20 transition-all duration-300"
              >
                <div>
                  {/* High-Contrast Photo Container */}
                  <div className="aspect-[3/4] relative w-full overflow-hidden bg-zinc-900 mb-4">
                    <Image
                      src={trainer.image}
                      alt={name}
                      fill
                      className="object-cover grayscale contrast-115 group-hover:scale-102 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[10px] mono-label text-white">
                      0{idx + 1} // {isFemale ? "FEMALE COACH" : "MALE COACH"}
                    </div>
                  </div>

                  {/* Typographic Identity */}
                  <div className="px-2">
                    <div className="mono-label text-[10px] text-zinc-400 mb-1">
                      {experience}
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight mb-1">
                      {name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium mb-4 leading-snug">
                      {role}
                    </p>

                    {/* Speciality tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {specialities.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] mono-label px-2 py-0.5 border border-white/[0.06] bg-white/[0.02] text-zinc-400"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="pt-3 px-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] mono-label text-zinc-400">
                  <span className="truncate max-w-[170px]">{shifts}</span>
                  <button
                    type="button"
                    onClick={handleInquire}
                    className="text-white hover:text-zinc-300 transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
