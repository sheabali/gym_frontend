"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { TRAINERS_DATA } from "@/data/gymData";
import { useGetTrainersQuery } from "@/redux/api/trainerApi";
import { Award, ShieldCheck } from "lucide-react";

export default function TrainersSection() {
  const { language, t } = useLanguage();

  const { data: trainersResponse } = useGetTrainersQuery(undefined);

  const apiTrainers = (trainersResponse as any)?.data || [];

  // Merge API trainers with fallback data
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
    <section id="trainers" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-slate-50 dark:bg-[#0c0c0f]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#22c55e] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>Coaching Faculty</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "সার্টিফাইড প্রশিক্ষকবৃন্দ" : "Floor Supervision"}
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "সঠিক টেকনিক ও ফর্ম আঘাত থেকে রক্ষা করে। আমাদের প্রশিক্ষকরা প্রতিটি শিফটে ফ্লোরে উপস্থিত থেকে সঠিক দিকনির্দেশনা দেন।"
              : "Every workout is supervised. Our certified trainers guide proper biomechanics, safe progressions, and injury prevention on every shift."}
          </p>
        </div>

        {/* 4-Column Modern Trainer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTrainers.map((trainer: any, idx: number) => {
            const isFemale = trainer.gender === "female";

            return (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="rounded-2xl border border-white/[0.08] bg-[#0e0e12] overflow-hidden hover:border-white/[0.2] transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Container */}
                  <div className="aspect-[4/5] relative w-full overflow-hidden bg-zinc-900">
                    <Image
                      src={trainer.image}
                      alt={trainer.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Gender / Role Pill */}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/75 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/10">
                      {isFemale ? "Female Shift Coach" : "Floor Trainer"}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <div className="text-xs font-semibold text-[#22c55e] mb-1">
                      {trainer.role}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {trainer.name}
                    </h3>

                    {/* Certifications / Experience */}
                    <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
                      {trainer.experience}
                    </p>

                    {/* Specialty tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(trainer.specialities) ? (
                        trainer.specialities.map((spec: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-zinc-300"
                          >
                            {spec}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-zinc-300">
                          {trainer.specialities}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Shift Badge */}
                <div className="p-4 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-xs text-zinc-400">
                  <span className="truncate">{trainer.shifts}</span>
                  <span className="text-[#22c55e] font-semibold text-[11px]">Certified</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
