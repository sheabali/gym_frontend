"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";
import { ArrowUpRight, Check, Minus } from "lucide-react";

export default function AboutSection() {
  const { language, t } = useLanguage();

  const tenets = [
    {
      num: "01",
      titleEn: "Climate Architecture",
      titleBn: "সেন্ট্রাল তাপমাত্রা ও অক্সিজেন নিয়ন্ত্রণ",
      descEn:
        "High-output inverter air conditioning maintains a crisp 20°C and steady airflow. You train without the suffocating humidity and fatigue common in Dhaka basements.",
      descBn:
        "উন্নত ইনভার্টার এসি সিস্টেম সার্বক্ষণিক ২০ ডিগ্রি তাপমাত্রা ও সতেজ বাতাস নিশ্চিত করে, যা তীব্র গরমেও ক্লান্তিহীন ও স্বাস্থ্যকর ওয়ার্কআউট নিশ্চিত করে।",
    },
    {
      num: "02",
      titleEn: "Shift Segregation & Privacy",
      titleBn: "সম্পূর্ণ নিরাপদ নারী ও পুরুষ শিফট",
      descEn:
        "We reject crowded combined free-for-alls. Our two male shifts and one dedicated female exclusive shift—coached by certified female instructors—guarantee absolute privacy.",
      descBn:
        "কোনো রকম অস্বস্তিকর ভিড় নয়। ২টি পুরুষ শিফট এবং নারী প্রশিক্ষক পরিচালিত ১টি সম্পূর্ণ ব্যক্তিগত নারী শিফটে সবার জন্য সর্বোচ্চ নিরাপত্তা ও স্বাধীনতা।",
    },
    {
      num: "03",
      titleEn: "Zero-Queue Biomechanics",
      titleBn: "পর্যাপ্ত ইকুইপমেন্ট ও হেভি ডাম্বেল",
      descEn:
        "Commercial-grade cable crossover stacks, power racks, deadlift platforms, and dumbbells up to 50kg+. Designed so your sets never wait on someone else.",
      descBn:
        "২ কেজি থেকে ৫০+ কেজির ডাম্বেল, কেবল ক্রসওভার ও অলিম্পিক বারবেল। কোনো মেশিনের জন্য অপেক্ষা না করে দ্রুত ও সঠিকভাবে ওয়ার্কআউট শেষ করার সুবিধা।",
    },
  ];

  const comparison = [
    {
      metric: "Climate & Air Quality",
      metricBn: "তাপমাত্রা ও বাতাসের মান",
      platinum: "100% Inverter Central AC + continuous air exchange",
      platinumBn: "১০০% সেন্ট্রাল এসি ও সার্বক্ষণিক ফ্রেশ এয়ার ভেন্টিলেশন",
      ordinary: "Stuffy ceiling fans, high humidity, bad odor",
      ordinaryBn: "ঘিঞ্জি ফ্যান, স্যাঁতসেঁতে পরিবেশ ও দুর্গন্ধ",
    },
    {
      metric: "Gender Privacy",
      metricBn: "আলাদা শিফট ও পর্দা",
      platinum: "Dedicated Female Shift (Certified Female Instructor)",
      platinumBn: "আলাদা নারী শিফট ও নারী প্রশিক্ষক দ্বারা পরিচালিত",
      ordinary: "Crowded combined floor with zero privacy",
      ordinaryBn: "অতিরিক্ত ভিড় ও নারীদের জন্য আলাদা কোনো নিরাপদ সময় নেই",
    },
    {
      metric: "Coach Supervision",
      metricBn: "প্রশিক্ষকের সহায়তা",
      platinum: "Certified floor trainers present on EVERY shift (No extra fee)",
      platinumBn: "প্রতি শিফটে সার্টিফাইড ফ্লোর ট্রেইনার উপস্থিত (অতিরিক্ত ফি ছাড়া)",
      ordinary: "Unsupervised workouts; expensive add-on fee for basic form help",
      ordinaryBn: "গাইডেন্স ছাড়া ব্যায়াম অথবা সাধারণ উপদেশের জন্যও বাড়তি টাকা দাবি",
    },
    {
      metric: "Equipment Standard",
      metricBn: "ইকুইপমেন্টের মান",
      platinum: "Calibrated biomechanical machines & dumbbells to 50kg+",
      platinumBn: "আন্তর্জাতিক মানের সঠিক বায়োমেকানিক্যাল মেশিন ও ৫০+ কেজি ডাম্বেল",
      ordinary: "Local welded steel with improper joint leverage",
      ordinaryBn: "ত্রুটিপূর্ণ লোকাল মেশিন যার ভুল এঙ্গেলে জয়েন্টে আঘাতের ঝুঁকি থাকে",
    },
  ];

  return (
    <section id="about" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0b0b0d]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Monospace Index */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-zinc-400 mb-2 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>01 • THE PHILOSOPHY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "আমাদের মূল দর্শন" : "Engineered For Focus"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "একটি জিম শুধু লোহার স্তূপ নয়; এটি এমন একটি পরিবেশ যেখানে আপনার শৃঙ্খলা ও একাগ্রতাকে সম্মান জানানো হয়।"
              : "A gym is not a warehouse of steel. It is an architectural sanctuary where athletic discipline is respected."}
          </p>
        </div>

        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          {/* Left: Architectural Imagery with Telemetry Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-white/[0.08] p-2 bg-[#121216]">
              <div className="aspect-[4/5] relative w-full overflow-hidden bg-zinc-900">
                <Image
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                  alt="Platinum Gym interior floor in Banasree Dhaka"
                  fill
                  className="object-cover contrast-110 filter grayscale-[20%]"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>

              {/* Minimalist Telemetry Strip */}
              <div className="pt-3 pb-1 px-2 flex items-center justify-between text-[11px] mono-label text-zinc-400">
                <span>HOUSE-16, ROAD-03, BLOCK-D</span>
                <span className="text-white font-bold">{BUSINESS_INFO.plusCode}</span>
              </div>
            </div>
          </div>

          {/* Right: 3 Numbered Architectural Tenets */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-white/[0.08]">
            {tenets.map((tenet, idx) => (
              <motion.div
                key={tenet.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ x: 6 }}
                className="py-8 first:pt-0 last:pb-0 group cursor-default transition-all"
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="mono-label text-zinc-500 font-bold group-hover:text-[#22c55e] transition-colors font-mono">
                    {tenet.num}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                    {language === "bn" ? tenet.titleBn : tenet.titleEn}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed pl-10 max-w-xl">
                  {language === "bn" ? tenet.descBn : tenet.descEn}
                </p>
              </motion.div>
            ))}

            <div className="pt-8">
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider !text-white hover:text-[#22c55e] transition-colors group"
              >
                <span className="!text-white font-bold group-hover:!text-[#22c55e] transition-colors">INSPECT SHIFT TIMINGS & SLOTS</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#22c55e] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Minimalist Comparison Table (Architectural Lines) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border border-white/[0.08] bg-[#0e0e11] p-6 sm:p-10 rounded-xs shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="mono-label text-zinc-400 mb-1 font-mono">
                AUDIT • BENCHMARK
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                {language === "bn"
                  ? "প্লাটিনাম জিম বনাম সাধারণ জিম"
                  : "The Platinum Benchmark vs. Ordinary Gyms"}
              </h3>
            </div>
            <span className="text-xs mono-label text-zinc-400">
              BANASREE AREA STANDARDS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-[11px] mono-label text-zinc-400">
                  <th className="py-3 px-4 font-normal">PARAMETER</th>
                  <th className="py-3 px-4 font-bold text-[#22c55e] bg-white/[0.03]">
                    PLATINUM GYM BANASREE
                  </th>
                  <th className="py-3 px-4 font-normal text-zinc-500">
                    CONVENTIONAL GYMS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {comparison.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.015] transition-colors">
                    <td className="py-4 px-4 font-semibold text-zinc-300">
                      {language === "bn" ? item.metricBn : item.metric}
                    </td>
                    <td className="py-4 px-4 bg-white/[0.03] text-white font-medium">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                        <span>{language === "bn" ? item.platinumBn : item.platinum}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-zinc-500">
                      <div className="flex items-center gap-2.5">
                        <Minus className="w-3.5 h-3.5 text-red-400/70" />
                        <span>{language === "bn" ? item.ordinaryBn : item.ordinary}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
