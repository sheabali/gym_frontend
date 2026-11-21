"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { PRICING_PLANS, BUSINESS_INFO } from "@/data/gymData";
import { ArrowUpRight, Check, MapPin, Globe, Facebook, Sparkles } from "lucide-react";

export default function PricingSection() {
  const { language, t } = useLanguage();

  const handleSelectPlan = (planId: string) => {
    const el = document.getElementById("contact");
    if (el) {
      const topOffset = 75;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.dispatchEvent(
        new CustomEvent("select-gym-plan", { detail: { planId } })
      );
    }
  };

  return (
    <section id="pricing" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0b0b0d]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-[#22c55e] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>[ 05 // OFFICIAL RATE CARD & MEMBERSHIP PACKAGES ]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "অফিশিয়াল মেম্বারশিপ প্যাকেজ" : "Official Packages & Pricing"}
            </h2>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-[#22c55e] uppercase tracking-wider font-bold">
              EST. 2015 • ALL-INCLUSIVE RATES
            </span>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
              {language === "bn"
                ? "কোনো গোপন চার্জ নেই। ভর্তি ফি, মেয়াদের ফি এবং এককালীন বিশেষ ডিসকাউন্টসহ স্বচ্ছ হিসাব।"
                : "Exact official rates from our front desk. Includes admission fee, duration dues, and instant cash discounts."}
            </p>
          </div>
        </div>

        {/* 4 Official Rate Card Package Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-14">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.popular;
            const name = language === "bn" ? plan.nameBn : plan.nameEn;
            const period = language === "bn" ? plan.periodBn : plan.periodEn;
            const badge = language === "bn" ? plan.badgeBn : plan.badgeEn;
            const features = language === "bn" ? plan.featuresBn : plan.featuresEn;

            return (
              <div
                key={plan.id}
                className={`border flex flex-col justify-between transition-all duration-300 relative overflow-hidden bg-[#0e0e12] ${isPopular
                  ? "border-[#22c55e] shadow-2xl shadow-[#22c55e]/10 scale-[1.02]"
                  : "border-white/[0.1] hover:border-white/30"
                  }`}
              >
                <div>
                  {/* Rate Card Green Header Bar (Matching the physical card) */}
                  <div className="bg-[#22c55e] px-4 py-2.5 flex items-center justify-between">
                    <span className="text-black font-black text-xs sm:text-sm tracking-wider uppercase">
                      {name}
                    </span>
                    {plan.badgeEn && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-black text-[#22c55e] uppercase">
                        {badge}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Itemized Rate Table (Exact match to the official rate card) */}
                    <div className="space-y-2.5 pb-5 mb-5 border-b border-white/[0.08] font-mono text-xs">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>{language === "bn" ? "ভর্তি ফি" : "ADMISSION FEE"}</span>
                        <span className="text-white font-bold">
                          {plan.admissionFee.toLocaleString("en-US")} TK.
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-zinc-400">
                        <span>{language === "bn" ? "প্যাকেজ ফি" : "PACKAGE FEE"}</span>
                        <span className="text-white font-bold">
                          {plan.durationFee.toLocaleString("en-US")} TK.
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-white/[0.04]">
                        <span>{language === "bn" ? "সাব টোটাল" : "SUB TOTAL"}</span>
                        <span className="text-white font-bold">
                          {plan.subTotal.toLocaleString("en-US")} TK.
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#22c55e] font-bold">
                        <span>{language === "bn" ? "ডিসকাউন্ট" : "DISCOUNT"}</span>
                        <span>-{plan.discount.toLocaleString("en-US")} TK.</span>
                      </div>
                    </div>

                    {/* Grand Total Price Block */}
                    <div className="mb-6 p-4 rounded-lg bg-black/40 border border-white/[0.06]">
                      <span className="text-[10px] mono-label text-zinc-400 block mb-1">
                        {language === "bn" ? "সর্বমোট প্রদেয়" : "GRAND TOTAL"}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-[#22c55e] tracking-tight font-mono">
                          ৳{plan.price.toLocaleString("en-US")}
                        </span>
                      </div>
                      <span className="text-[11px] mono-label text-zinc-400 block mt-1">
                        {period}
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2.5 mb-6 text-xs text-zinc-300 font-sans">
                      {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 leading-snug">
                          <Check className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Select Button */}
                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-2 group rounded-xs ${
                      isPopular
                        ? "bg-[#22c55e] !text-black hover:bg-[#16a34a] shadow-lg shadow-[#22c55e]/25"
                        : "bg-white/[0.03] border border-white/[0.12] text-white hover:bg-[#22c55e] hover:!text-black hover:border-[#22c55e]"
                    }`}
                  >
                    <span className={isPopular ? "!text-black font-black" : "text-white group-hover:!text-black font-bold"}>
                      {t.pricing.selectPlan}
                    </span>
                    <ArrowUpRight className={`w-4 h-4 ${isPopular ? "!text-black stroke-[2.5]" : "text-white group-hover:!text-black stroke-[2]"}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Official 3-Branch Network Directory (Direct from the official rate card) */}
        <div className="border border-white/[0.08] p-6 sm:p-8 bg-[#0e0e12] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <span className="mono-label text-[10px] text-[#22c55e] block mb-1">
                PLATINUM GYM NETWORK // 3 OFFICIAL BRANCHES
              </span>
              <h4 className="text-xl font-black text-white uppercase tracking-tight">
                {language === "bn" ? "প্লাটিনাম জিম শাখা নেটওয়ার্ক" : "Official Multi-Branch Locations"}
              </h4>
            </div>
            <div className="flex items-center gap-4 text-xs mono-label text-zinc-400">
              <span className="flex items-center gap-1.5 text-white">
                <Globe className="w-3.5 h-3.5 text-[#22c55e]" />
                <a
                  href="https://www.platinumgym.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#22c55e] transition-colors"
                >
                  www.platinumgym.com
                </a>
              </span>
              <span>•</span>
              <span>EST. 2015</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Branch 01 */}
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">BRANCH 01</span>
              <span className="text-white font-bold block mb-1 font-sans">Block-J, Banasree</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                House-01, Road-07, Block-J, Banasree, Dhaka-1219
              </p>
            </div>

            {/* Branch 02 (Featured) */}
            <div className="p-4 rounded-lg bg-[#22c55e]/5 border border-[#22c55e]/30 relative">
              <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#22c55e] text-black uppercase">
                THIS CAMPUS
              </span>
              <span className="text-[10px] text-[#22c55e] uppercase block mb-1">BRANCH 02</span>
              <span className="text-white font-bold block mb-1 font-sans">Block-D, Banasree</span>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                House: 16, Road: 03, Block: D, Banasree, Rampura, Dhaka-1219
              </p>
            </div>

            {/* Branch 03 */}
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">BRANCH 03</span>
              <span className="text-white font-bold block mb-1 font-sans">Aftab Nagar, Badda</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Siraj Convention Center, Level 7, Plot No-39, Block-C, Aftab Nagar, Badda, Dhaka 1212
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}