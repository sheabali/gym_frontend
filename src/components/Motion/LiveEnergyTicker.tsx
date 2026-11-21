"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";

export default function LiveEnergyTicker() {
  const { language } = useLanguage();

  const items =
    language === "bn"
      ? [
          "১০০% সেন্ট্রাল এয়ার-কন্ডিশন্ড",
          "বাড়ি-১৬, রোড-০৩, ব্লক-ডি, বনশ্রী",
          "গুগল রেটিং ৪.৪★ (১৭৩+ ভেরিফাইড রিভিউ)",
          "আলাদা পুরুষ ও নারী শিফট ব্যবস্থা",
          "প্রতি শিফটে সার্টিফাইড ফ্লোর কোচ",
          "প্রতিদিন সকাল ০৭:০০ টায় খোলে",
          "সরাসরি ফোন: ০১৭৩৩-৫২১০৫২",
        ]
      : [
          "100% INVERTER CLIMATE CONTROL",
          "HOUSE-16, ROAD-03, BLOCK-D, BANASREE",
          "GOOGLE RATING 4.4★ (173 REVIEWS)",
          "DEDICATED MALE & FEMALE TIME SLOTS",
          "CERTIFIED FLOOR COACHES ON DUTY",
          "OPENS DAILY AT 07:00 SHARP",
          "DIRECT LINE: 01733-521052",
        ];

  return (
    <div className="w-full bg-[#0d0d10] border-b border-white/[0.08] py-2.5 overflow-hidden select-none">
      <div className="flex w-max animate-marquee-slow">
        {[...items, ...items, ...items].map((text, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 mx-6 text-xs mono-label text-zinc-400 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span className="hover:text-white transition-colors">{text}</span>
            <span className="text-zinc-700 ml-4">/</span>
          </div>
        ))}
      </div>
    </div>
  );
}
