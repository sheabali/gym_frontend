"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO, REVIEWS_DATA } from "@/data/gymData";
import { ArrowUpRight, Star } from "lucide-react";
import MagneticButton from "@/components/Motion/MagneticButton";

export default function ReviewsSection() {
  const { language, t } = useLanguage();

  return (
    <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0c0c0f]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#22c55e] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>Member Perspectives</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "সদস্যদের প্রত্যক্ষ মতামত" : "Verified Member Reviews"}
            </h2>
          </div>

          {/* Google Audit Box */}
          <div className="border border-white/[0.08] p-4 bg-[#0e0e12] flex items-center gap-6 shrink-0 rounded-2xl shadow-md">
            <div>
              <div className="text-xs text-zinc-400 font-medium">
                Google Verified Rating
              </div>
              <div className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.4 / 5.0</span>
                <span className="text-xs text-zinc-400 font-normal">
                  (173 Reviews)
                </span>
              </div>
            </div>

            <MagneticButton
              onClick={() => window.open(BUSINESS_INFO.googleMapsDirectionsUrl, "_blank")}
              className="px-4 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] !text-black font-bold text-xs rounded-sm transition-all flex items-center gap-1.5 shadow-md shadow-[#22c55e]/20"
            >
              <span className="!text-black">{language === "bn" ? "গুগলে দেখুন" : "View on Google"}</span>
              <ArrowUpRight className="w-3.5 h-3.5 !text-black stroke-[2.5]" />
            </MagneticButton>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS_DATA.map((review, idx) => {
            const author = language === "bn" ? review.authorBn : review.authorEn;
            const membership =
              language === "bn" ? review.membershipBn : review.membershipEn;
            const comment =
              language === "bn" ? review.commentBn : review.commentEn;
            const date = language === "bn" ? review.dateBn : review.dateEn;
            const shift = language === "bn" ? review.shiftBn : review.shiftEn;

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="h-full"
              >
                <div className="p-7 rounded-2xl bg-[#0e0e12] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 flex flex-col justify-between h-full shadow-lg hover:-translate-y-0.5">
                  <div>
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06] text-xs text-zinc-400">
                      <span className="text-white font-medium">{shift}</span>
                      <span>{date}</span>
                    </div>

                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 font-normal">
                      &ldquo;{comment}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs mt-auto">
                    <div>
                      <h4 className="font-bold text-white">
                        {author}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {membership}
                      </p>
                    </div>

                    {/* Amber rating stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(review.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-zinc-700 text-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
