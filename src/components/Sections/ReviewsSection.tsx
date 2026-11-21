"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO, REVIEWS_DATA } from "@/data/gymData";
import { ArrowUpRight, Star } from "lucide-react";

export default function ReviewsSection() {
  const { language, t } = useLanguage();

  return (
    <section id="reviews" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0c0c0f]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-zinc-400 mb-2">
              [ 08 // COMMUNITY REVIEWS ]
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "সদস্যদের প্রত্যক্ষ মতামত" : "Member Perspectives"}
            </h2>
          </div>

          {/* Minimalist Google Audit Box */}
          <div className="border border-white/[0.08] p-3.5 bg-[#121217] flex items-center gap-6 shrink-0">
            <div>
              <div className="mono-label text-[10px] text-zinc-400">
                GOOGLE VERIFIED AUDIT
              </div>
              <div className="text-xl font-black text-white flex items-center gap-2 mt-0.5 font-mono">
                <span>4.4 / 5.0</span>
                <span className="text-xs text-zinc-400 font-sans font-normal">
                  (173 Reviews)
                </span>
              </div>
            </div>

            <a
              href={BUSINESS_INFO.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#22c55e] hover:bg-[#16a34a] !text-black font-black text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-[#22c55e]/20 rounded-xs cursor-pointer"
            >
              <span className="!text-black font-black">INSPECT</span>
              <ArrowUpRight className="w-3.5 h-3.5 !text-black stroke-[2.5]" />
            </a>
          </div>
        </div>

        {/* Editorial Testimonials Grid (2 Columns, Typographic Purity) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {REVIEWS_DATA.map((review) => {
            const author = language === "bn" ? review.authorBn : review.authorEn;
            const membership =
              language === "bn" ? review.membershipBn : review.membershipEn;
            const comment =
              language === "bn" ? review.commentBn : review.commentEn;
            const date = language === "bn" ? review.dateBn : review.dateEn;
            const shift = language === "bn" ? review.shiftBn : review.shiftEn;

            return (
              <div
                key={review.id}
                className="border border-white/[0.08] bg-[#0e0e12] p-8 flex flex-col justify-between hover:border-white/20 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06] text-xs mono-label text-zinc-400">
                    <span className="text-white font-bold">{shift}</span>
                    <span>{date}</span>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-8 font-normal">
                    &ldquo;{comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white tracking-tight">
                      {author}
                    </h4>
                    <p className="mono-label text-[10px] text-zinc-500 mt-0.5">
                      {membership}
                    </p>
                  </div>

                  <div className="flex items-center gap-0.5 text-zinc-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(review.rating)
                            ? "fill-white text-white"
                            : "fill-zinc-700 text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
