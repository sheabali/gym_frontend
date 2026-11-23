"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { TRAINERS_DATA } from "@/src/data/gymData";
import { useGetTrainersQuery } from "@/redux/api/trainerApi";
import { ArrowUpRight } from "lucide-react";
import CardSpotlight from "@/components/Motion/CardSpotlight";

export default function TrainersSection() {
  const { language, t } = useLanguage();
  const { data: trainersResponse } = useGetTrainersQuery(undefined) as any;
  const apiTrainers = trainersResponse?.data || [];

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

  // Merge API trainers with static showcase data for rich display
  const displayTrainers = apiTrainers.length > 0
    ? apiTrainers.map((at: any, idx: number) => {
      const fallback = TRAINERS_DATA[idx % TRAINERS_DATA.length];
      return {
        id: at.id,
        name: at.user.name,
        role: at.bio || fallback.roleEn,
        experience: at.certifications.length > 0 ? at.certifications.join(" • ") : fallback.experienceEn,
        shifts: "Daily Floor Shifts",
        specialities: at.specialties.length > 0 ? at.specialties : fallback.specialityEn,
        image: at.photoUrl || at.user.photoUrl || fallback.image,
        gender: fallback.gender,
      };
    })
    : TRAINERS_DATA.map((t: any) => ({
      id: t.id,
      name: language === "bn" ? t.nameBn : t.nameEn,
      role: language === "bn" ? t.roleBn : t.roleEn,
      experience: language === "bn" ? t.experienceBn : t.experienceEn,
      shifts: language === "bn" ? t.shiftsBn : t.shiftsEn,
      specialities: language === "bn" ? t.specialityBn : t.specialityEn,
      image: t.image,
      gender: t.gender,
    }));

  return (
    <section id="trainers" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0c0c0f]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-zinc-400 mb-2 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>04 • COACHING FACULTY</span>
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
          {displayTrainers.map((trainer: any, idx: number) => {
            const isFemale = trainer.gender === "female";

            return (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="h-full"
              >
                <CardSpotlight
                  enableTilt={true}
                  showReticles={true}
                  spotlightColor="rgba(34, 197, 94, 0.15)"
                  className="p-2 flex flex-col justify-between group hover:border-[#22c55e]/40 transition-all duration-300 rounded-xs shadow-xl h-full"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      {/* Photo Container */}
                      <div className="aspect-[4/5] sm:aspect-[3/4] relative w-full overflow-hidden bg-zinc-900 mb-4 rounded-xs">
                        <Image
                          src={trainer.image}
                          alt={trainer.name}
                          fill
                          className="object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-104 transition-all duration-700"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[10px] mono-label text-white border border-white/[0.1] rounded-xs font-mono">
                          0{idx + 1} • {isFemale ? "FEMALE COACH" : "MALE COACH"}
                        </div>
                      </div>

                      {/* Typographic Identity */}
                      <div className="px-2">
                        <div className="mono-label text-[10px] text-zinc-400 mb-1 truncate font-mono">
                          {trainer.experience}
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight mb-1 truncate">
                          {trainer.name}
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium mb-4 leading-snug line-clamp-2 font-sans">
                          {trainer.role}
                        </p>

                        {/* Speciality tags with interactive hover */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {trainer.specialities.map((spec: string, i: number) => (
                            <span
                              key={i}
                              title={spec}
                              className="text-[10px] mono-label px-2 py-0.5 border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-[#22c55e] hover:border-[#22c55e]/40 hover:bg-[#22c55e]/5 transition-colors rounded-xs truncate max-w-[120px] font-mono"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Strip */}
                    <div className="pt-3 px-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] mono-label text-zinc-400 mt-auto font-mono">
                      <span className="truncate max-w-[170px]">{trainer.shifts}</span>
                      <button
                        type="button"
                        onClick={handleInquire}
                        aria-label={`Inquire about coaching with ${trainer.name}`}
                        className="p-1 text-white hover:text-[#22c55e] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all cursor-pointer rounded-xs"
                      >
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </CardSpotlight>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
