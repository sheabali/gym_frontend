"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";
import { useGetFaqsQuery } from "@/redux/api/contentApi";
import { ArrowUpRight, Plus, Minus, ShieldCheck, Check } from "lucide-react";

export default function FaqSection() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "shifts" | "privacy" | "coaching" | "admission">("all");
  const [openId, setOpenId] = useState<string | null>("proto-1");
  const { data: faqsResponse } = useGetFaqsQuery(undefined) as any;
  const apiFaqs = faqsResponse?.data || [];

  const baseProtocols = [
    {
      id: "proto-1",
      code: "01 • SEC-TIMETABLE",
      category: "shifts",
      categoryLabel: language === "bn" ? "শিফট কাঠামো" : "SHIFT ARCHITECTURE",
      badge: "ENFORCED DAILY",
      question:
        language === "bn"
          ? "পুরুষ, নারী এবং কম্বাইন্ড সদস্যদের আলাদা শিফটের সঠিক সময়সূচি কী?"
          : "What are the exact daily operating shift hours for Male, Female, and Combined slots?",
      answer:
        language === "bn"
          ? "প্লাটিনাম জিম প্রতিদিন ৪টি সুনির্দিষ্ট আলাদা শিফটে পরিচালিত হয় যাতে ভিড় এড়ানো যায় এবং সর্বোচ্চ মনোযোগ ও পর্দা বজায় থাকে। সার্বক্ষণিক সেন্ট্রাল এসি চালু থাকে।"
          : "Platinum Gym enforces 4 structured daily shifts to ensure zero floor crowding, focused workout atmosphere, and strict gender separation. 100% central inverter cooling operates continuously.",
      specs: [
        { label: language === "bn" ? "পুরুষ সকাল শিফট" : "Male Morning Shift", value: "07:00 AM – 11:30 AM" },
        { label: language === "bn" ? "নারী এক্সক্লুসিভ শিফট" : "Female Exclusive Shift", value: "12:00 PM – 04:30 PM (Private)" },
        { label: language === "bn" ? "যৌথ কম্বাইন্ড শিফট" : "Combined Evening Shift", value: "04:30 PM – 06:30 PM" },
        { label: language === "bn" ? "পুরুষ প্রাইম শিফট" : "Male Prime Night Shift", value: "06:30 PM – 10:30 PM [Closing]" },
      ],
    },
    {
      id: "proto-2",
      code: "02 • SEC-FEMALE",
      category: "privacy",
      categoryLabel: language === "bn" ? "নারী নিরাপত্তা" : "FEMALE INTEGRITY",
      badge: "ZERO-TOLERANCE",
      question:
        language === "bn"
          ? "নারী শিফটে শতভাগ পর্দা, গোপনীয়তা ও নিরাপত্তা কীভাবে নিশ্চিত করা হয়?"
          : "How is strict privacy, modesty, and security maintained during the dedicated Female shift?",
      answer:
        language === "bn"
          ? "দুপুর ১২:০০ থেকে বিকাল ০৪:৩০ পর্যন্ত সম্পূর্ণ জিম ভবন নারীদের জন্য ব্যক্তিগত সংরক্ষিত জোনে রূপান্তর করা হয়। কোনো পুরুষ সদস্য বা পুরুষ স্টাফের প্রবেশাধিকার থাকে না। ফ্লোরে শুধুমাত্র অভিজ্ঞ নারী ট্রেইনাররা দায়িত্বে থাকেন এবং চারপাশ টিন্টেড গ্লাসে আবৃত।"
          : "From 12:00 PM to 04:30 PM daily, the facility operates under complete male lockout. No male members, visitors, or staff may enter. The floor is managed exclusively by certified female mentors with tinted privacy glass partitions.",
      specs: [
        { label: language === "bn" ? "পুরুষ প্রবেশাধিকার" : "Male Entry Protocol", value: "0% (Absolute Restriction)" },
        { label: language === "bn" ? "ফ্লোর ট্রেইনার" : "Coaching Faculty", value: "Certified Female Mentors Only" },
        { label: language === "bn" ? "পার্টিশন ও পর্দা" : "Visual Partitioning", value: "100% Tinted Acoustic Privacy Glass" },
        { label: language === "bn" ? "ওয়াশ ও চেঞ্জিং" : "Sanitary Facilities", value: "Dedicated Private Locker & Shower" },
      ],
    },
    {
      id: "proto-3",
      code: "03 • SUP-COACHING",
      category: "coaching",
      categoryLabel: language === "bn" ? "ফ্লোর গাইডেন্স" : "FLOOR SUPERVISION",
      badge: "INCLUDED IN ALL TIERS",
      question:
        language === "bn"
          ? "ব্যায়ামের নিয়ম শেখা ও সঠিক টেকনিক দেখানোর জন্য কি বাড়তি কোনো ফি দিতে হয়?"
          : "Do members need to pay an additional coaching fee for daily lifting supervision and form correction?",
      answer:
        language === "bn"
          ? "কোনো প্রকার বাড়তি বা গোপন চার্জ নেই। প্রতিটি শিফটেই আমাদের সার্টিফাইড ফ্লোর ট্রেইনাররা উপস্থিত থাকেন। তারা নতুনদের মেশিন সেটআপ, স্কোয়াট ও ডেডলিফটের সঠিক টেকনিক শিখিয়ে দেন এবং আঘাতমুক্ত ওয়ার্কআউট নিশ্চিত করেন।"
          : "No hidden coaching surcharges. Certified strength coaches are stationed on the floor during every shift at zero extra charge to guide machine calibration, inspect squat and deadlift biomechanics, and prevent injury.",
      specs: [
        { label: language === "bn" ? "ফ্লোর কোচ উপস্থিতি" : "Coach Floor Coverage", value: "Every Single Shift (100%)" },
        { label: language === "bn" ? "নতুনদের গাইডেন্স" : "Beginner Orientation", value: "Included With Admission" },
        { label: language === "bn" ? "ফর্ম ও সেফটি পর্যবেক্ষণ" : "Form & Ergonomics", value: "Continuous Floor Observation" },
        { label: language === "bn" ? "পার্সোনাল ট্রেইনিং" : "1-on-1 Personal Training", value: "Optional Dedicated Packages Available" },
      ],
    },
    {
      id: "proto-4",
      code: "04 • SAN-ETIQUETTE",
      category: "coaching",
      categoryLabel: language === "bn" ? "ফ্লোর অনুশাসন" : "FLOOR ETIQUETTE",
      badge: "MANDATORY STANDARD",
      question:
        language === "bn"
          ? "জিম ফ্লোরে জুতা, তোয়ালে এবং ইকুইপমেন্ট ব্যবহারের সাধারণ নিয়মগুলো কী কী?"
          : "What are the mandatory floor guidelines regarding indoor footwear, towels, and equipment re-racking?",
      answer:
        language === "bn"
          ? "রাবার ফ্লোরিং এবং মেশিনের আন্তর্জাতিক পরিচ্ছন্নতার মান ধরে রাখতে পরিষ্কার ইনডোর ট্রেনিং শু পরা বাধ্যতামূলক। বাইরের কাদাযুক্ত জুতা নিয়ে ফ্লোরে ওঠা সম্পূর্ণ নিষেধ। প্রতিটি সদস্যকে নিজস্ব তোয়ালে ব্যবহার করতে হবে এবং ডাম্বেল-বারবেল ব্যবহারের পর যথাস্থানে সাজিয়ে রাখতে হবে।"
          : "To preserve hospital-grade hygiene across rubber mats and upholstery, members must wear clean indoor athletic shoes (outdoor shoes strictly barred). A personal workout towel is required, and all dumbbells and Olympic plates must be re-racked immediately after sets.",
      specs: [
        { label: language === "bn" ? "জুতার নিয়ম" : "Footwear Requirement", value: "Clean Indoor Athletic Shoes Only" },
        { label: language === "bn" ? "তোয়ালে নিয়ম" : "Hygiene Mandate", value: "Personal Workout Towel Required" },
        { label: language === "bn" ? "ডাম্বেল ও প্লেট" : "Plate Management", value: "Mandatory Re-Racking on Numbered Trees" },
        { label: language === "bn" ? "বারবেল সুরক্ষা" : "Safety Collars", value: "Mandatory Spring Collars on Heavy Lifts" },
      ],
    },
    {
      id: "proto-5",
      code: "05 • ADM-TRIAL",
      category: "admission",
      categoryLabel: language === "bn" ? "ভর্তি ও ট্রায়াল" : "TRIAL INDUCTION",
      badge: "ZERO COMMITMENT",
      question:
        language === "bn"
          ? "ভর্তি হওয়ার আগে কি পরিবেশ, এসি ও ইকুইপমেন্ট নিজে এসে ফ্রি ট্রায়াল দেওয়া সম্ভব?"
          : "Can I test the facility, biomechanical machines, and air-conditioning before committing to a plan?",
      answer:
        language === "bn"
          ? "অবশ্যই। বনশ্রী ও আশেপাশের এলাকার যেকোনো ফিটনেস সচেতন ব্যক্তিকে আমরা ১টি সম্পূর্ণ ফ্রি ট্রায়াল সেশনে আমন্ত্রণ জানাই। নিচে দেওয়া বুকিং ফর্ম পূরণ করুন অথবা সরাসরি ফ্রন্ট ডেস্কে ফোন করে আপনার ট্রায়াল শিফট কনফার্ম করুন।"
          : "Yes. Prospective members in Banasree, Rampura, and surrounding neighborhoods are entitled to a complimentary workout session and facility inspection. Submit the terminal form below or call reception directly.",
      specs: [
        { label: language === "bn" ? "ট্রায়াল ফি" : "Trial Session Fee", value: "৳0 (100% Free)" },
        { label: language === "bn" ? "সুযোগ-সুবিধা" : "Access Level", value: "Full Machine, Cardio & Locker Access" },
        { label: language === "bn" ? "শিফট নির্বাচন" : "Shift Availability", value: "Any Male, Female, or Combined Slot" },
        { label: language === "bn" ? "বুকিং পদ্ধতি" : "Booking Mode", value: "Online Terminal Form or 01733-521052" },
      ],
    },
    {
      id: "proto-6",
      code: "06 • FIN-DUES",
      category: "admission",
      categoryLabel: language === "bn" ? "পেমেন্ট ও সুবিধা" : "PAYMENT & FREEZE",
      badge: "TRANSPARENT TERMS",
      question:
        language === "bn"
          ? "মেম্বারশিপ ফি পরিশোধের মাধ্যম কী এবং ট্যুর বা পরীক্ষার সময় মেম্বারশিপ ফ্রিজ রাখা যায়?"
          : "What payment channels are accepted, and is there a membership freeze option during university exams or travel?",
      answer:
        language === "bn"
          ? "আমরা বিকাশ, নগদ, রকেট, কার্ড এবং ফ্রন্ট ডেস্কে সরাসরি ক্যাশ পেমেন্ট গ্রহণ করি। কোয়ার্টারলি এবং বাৎসরিক সদস্যদের জন্য পরীক্ষা, অসুস্থতা বা ট্যুরের ক্ষেত্রে ১৫ থেকে ৩০ দিনের মেম্বারশিপ সাময়িক ফ্রিজ রাখার বিশেষ সুবিধা রয়েছে।"
          : "We accept bKash, Nagad, Rocket, debit/credit cards, and cash at the front desk. Quarterly and Yearly members receive a complimentary 15 to 30-day membership pause option for university exams, travel, or medical recovery.",
      specs: [
        { label: language === "bn" ? "ডিজিটাল পেমেন্ট" : "Digital Channels", value: "bKash, Nagad, Rocket, Visa, Mastercard" },
        { label: language === "bn" ? "ক্যাশ পেমেন্ট" : "Physical Desk", value: "Direct Cash Accepted at Reception" },
        { label: language === "bn" ? "মেম্বারশিপ ফ্রিজ" : "Membership Freeze", value: "15 to 30 Days (Quarterly & Yearly)" },
        { label: language === "bn" ? "লকার সুবিধা" : "Locker Allocation", value: "Available During Active Workout Sessions" },
      ],
    },
    {
      id: "proto-7",
      code: "07 • LOC-CAMPUS",
      category: "admission",
      categoryLabel: language === "bn" ? "লোকেশন ও ক্যাম্পাস" : "CAMPUS ACCESS",
      badge: "BANASREE BLOCK-D",
      question:
        language === "bn"
          ? "বনশ্রীতে জিমের সঠিক অবস্থান কোথায় এবং পার্কিংয়ের কী ব্যবস্থা রয়েছে?"
          : "Where is Platinum Gym located in Banasree, and is dedicated vehicle parking available?",
      answer:
        language === "bn"
          ? "বাড়ি-১৬, রোড-০৩, ব্লক-ডি, বনশ্রী, ঢাকা ১২১৯ (গুগল প্লাস কোড: QC6J+VP Dhaka)। বনশ্রী মেইন রোড থেকে মাত্র ১৫০ মিটার ভেতরে। ভবনের গ্রাউন্ড ফ্লোরে সদস্যদের মোটরসাইকেল ও সাইকেলের জন্য ২৪ ঘণ্টা সিকিউরিটি গার্ড নিয়ন্ত্রিত সুরক্ষিত পার্কিং রয়েছে।"
          : "House-16, Road-03, Block-D, Banasree, Dhaka 1219 (Plus Code: QC6J+VP Dhaka). Situated 150m from Banasree Main Road. The building includes covered ground-floor parking for member motorcycles and bicycles with 24/7 security.",
      specs: [
        { label: language === "bn" ? "মেইন রোড থেকে দূরত্ব" : "From Main Road", value: "150m (2 Min Walk)" },
        { label: language === "bn" ? "রামপুরা ব্রিজ থেকে" : "From Rampura Bridge", value: "1.2 KM (5 Min Rickshaw)" },
        { label: language === "bn" ? "পার্কিং সুবিধা" : "Parking Facility", value: "Dedicated Ground Floor Bike Bay" },
        { label: language === "bn" ? "ভবন নিরাপত্তা" : "Premises Security", value: "24/7 Security Personnel on Duty" },
      ],
    },
  ];

  const protocols = [
    ...apiFaqs.map((faq: any, idx: number) => ({
      id: faq.id,
      code: `0${idx + 1} • FAQ-LIVE`,
      category: "admission",
      categoryLabel: "GENERAL FAQ",
      badge: "VERIFIED",
      question: faq.question,
      answer: faq.answer,
      specs: [],
    })),
    ...baseProtocols,
  ];

  const filtered =
    activeTab === "all"
      ? protocols
      : protocols.filter((p) => p.category === activeTab);

  return (
    <section id="faq" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0b0b0d]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header (100% Synced with Schedule, Pricing, Reviews) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-zinc-400 mb-2 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>09 • AUDIT & PROTOCOLS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "ক্লাব প্রটোকল ও নিয়মাবলী" : "Rules & Member Protocols"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "শিফটের সময়সূচি, নারীদের শতভাগ গোপনীয়তা, ট্রেইনারের প্রাপ্যতা ও ফি সংক্রান্ত স্বচ্ছ নীতিমালা।"
              : "Institutional policies governing gender segregation, air-conditioner uptime, coaching conduct, and membership integrity."}
          </p>
        </div>

        {/* Minimalist Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/[0.06]">
          {[
            { key: "all", labelEn: "ALL PROTOCOLS", labelBn: "সকল প্রটোকল" },
            { key: "shifts", labelEn: "SHIFT TIMINGS", labelBn: "শিফট সময়সূচি" },
            { key: "privacy", labelEn: "FEMALE PRIVACY", labelBn: "নারী নিরাপত্তা" },
            { key: "coaching", labelEn: "COACHING & RULES", labelBn: "প্রশিক্ষক ও নিয়মাবলী" },
            { key: "admission", labelEn: "FEES & CAMPUS", labelBn: "ফি ও ক্যাম্পাস" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer rounded-xs ${activeTab === tab.key
                ? "bg-[#22c55e] !text-black font-black shadow-md shadow-[#22c55e]/20"
                : "text-zinc-400 hover:text-white border border-white/[0.08]"
                }`}
            >
              <span className={activeTab === tab.key ? "!text-black font-black" : ""}>
                {language === "bn" ? tab.labelBn : tab.labelEn}
              </span>
            </button>
          ))}
        </div>

        {/* Architectural Departure-Board Table with Smooth Animation */}
        <div className="border border-white/[0.08] divide-y divide-white/[0.08] bg-[#0e0e12] mb-12 rounded-xs shadow-xl">
          {filtered.map((item: any) => {
            const isOpen = openId === item.id;

            return (
              <div key={item.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-6 sm:p-8 text-left flex items-start justify-between gap-6 cursor-pointer group focus:outline-none hover:bg-white/[0.02]"
                >
                  <div className="flex items-start gap-4 sm:gap-6 flex-1">
                    <span className="mono-label text-[11px] text-zinc-500 font-bold shrink-0 pt-1 group-hover:text-[#22c55e] transition-colors">
                      {item.code}
                    </span>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] mono-label text-zinc-400">
                          {item.categoryLabel}
                        </span>
                        <span className="text-[10px] mono-label px-2 py-0.5 border border-white/[0.08] text-zinc-400 rounded-xs">
                          {item.badge}
                        </span>
                      </div>

                      <h3
                        className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${isOpen ? "text-white" : "text-zinc-300 group-hover:text-white"
                          }`}
                      >
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 border flex items-center justify-center shrink-0 transition-all rounded-xs ${isOpen
                      ? "bg-[#22c55e] border-[#22c55e] text-black font-bold shadow-md shadow-[#22c55e]/20"
                      : "border-white/[0.12] bg-white/[0.02] text-zinc-400 group-hover:border-white/30 group-hover:text-white"
                      }`}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Expanded Architectural Details with AnimatePresence */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-white/[0.06] bg-[#121217]"
                    >
                      <div className="px-6 sm:px-8 pb-8 pt-6 sm:pl-16 space-y-6">
                        <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed max-w-3xl font-sans">
                          {item.answer}
                        </p>

                        {/* Technical Specifications Matrix Grid */}
                        {item.specs && item.specs.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                            {item.specs.map((spec: any, i: number) => (
                              <div
                                key={i}
                                className="p-3.5 border border-white/[0.08] bg-[#0e0e12] rounded-xs"
                              >
                                <span className="mono-label text-[10px] text-zinc-400 block mb-1">
                                  {spec.label}
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-white block font-sans">
                                  {spec.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Minimalist Desk & Campus Audit Box */}
        <div className="border border-white/[0.08] p-6 sm:p-8 bg-[#0e0e12] flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xs shadow-xl">
          <div>
            <div className="mono-label text-[10px] text-zinc-400 mb-1">
              CAMPUS RECEPTION AUDIT & DIRECT TELEPHONY
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              BANASREE BLOCK-D • ROAD-03 • HOUSE-16
            </h4>
            <p className="text-xs text-zinc-400 mt-1 mono-label">
              HOTLINE: {BUSINESS_INFO.phone} • PLUS CODE: {BUSINESS_INFO.plusCode} • OPENS 07:00 AM DAILY
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="px-4 py-3 border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.08] text-white text-xs mono-label font-bold transition-colors flex items-center gap-2 rounded-xs"
            >
              <span>CALL FRONT DESK</span>
            </a>

            <a
              href="#contact"
              className="px-5 py-3 bg-[#22c55e] hover:bg-[#16a34a] !text-black font-black text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#22c55e]/25 cursor-pointer rounded-xs"
            >
              <span className="!text-black font-black">ENROLLMENT & TRIAL DESK</span>
              <ArrowUpRight className="w-3.5 h-3.5 !text-black stroke-[2.5]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}