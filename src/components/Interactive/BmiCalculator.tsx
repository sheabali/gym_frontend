"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUpRight } from "lucide-react";

export default function BmiCalculator() {
  const { language } = useLanguage();
  const [weight, setWeight] = useState<number>(72);
  const [height, setHeight] = useState<number>(172);
  const [activity, setActivity] = useState<number>(1.45);
  const [gender, setGender] = useState<"male" | "female">("male");

  // Calculate BMI: weight (kg) / [height (m)]^2
  const heightInMeters = height / 100;
  const bmiValue = weight / (heightInMeters * heightInMeters);
  const bmi = bmiValue.toFixed(1);

  // Basal Metabolic Rate (BMR) using Mifflin-St Jeor
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * 25 + 5
      : 10 * weight + 6.25 * height - 5 * 25 - 161;

  const tdee = Math.round(bmr * activity);

  // Health Classification
  let statusEn = "Normal Weight";
  let statusBn = "স্বাভাবিক ওজন";
  let recommendationEn = "Optimal baseline. Focus on progressive overload and body recomposition.";
  let recommendationBn = "আদর্শ শারীরিক গঠন। মাসল হাইপারট্রফি ও স্ট্রেংথ বাড়াতে ট্রেনিং শুরু করুন।";

  if (bmiValue < 18.5) {
    statusEn = "Underweight";
    statusBn = "স্বাভাবিকের চেয়ে কম ওজন";
    recommendationEn = "Caloric surplus and structured strength training recommended.";
    recommendationBn = "ক্যালোরি সারপ্লাস খাদ্যতালিকা ও হাইপারট্রফি ট্রেনিং প্রয়োজন।";
  } else if (bmiValue >= 25 && bmiValue < 29.9) {
    statusEn = "Overweight";
    statusBn = "অতিরিক্ত ওজন";
    recommendationEn = "Moderate calorie deficit with structured daily conditioning & resistance training.";
    recommendationBn = "ক্যালোরি ঘাটতি ডায়েট ও কার্ডিও-স্ট্রেন্থ কম্বিনেশন ট্রেনিং প্রয়োজন।";
  } else if (bmiValue >= 30) {
    statusEn = "Obese Class";
    statusBn = "স্থূলতা (ওবেসিটি)";
    recommendationEn = "Structured conditioning with certified supervision to protect joint mechanics.";
    recommendationBn = "জয়েন্ট সুরক্ষিত রেখে অভিজ্ঞ ট্রেইনারের তত্ত্বাবধানে ওয়েট লস প্রোগ্রাম।";
  }

  const handleConsult = () => {
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
    <div className="w-full my-8 border border-white/[0.08] bg-[#0e0e12] p-6 sm:p-8 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="text-xs font-semibold text-[#22c55e] mb-1">
            Health & Fitness Audit
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {language === "bn"
              ? "বিএমআই ও দৈনিক ক্যালোরি ক্যালকুলেটর"
              : "BMI & Daily Calorie Calculator"}
          </h3>
        </div>

        {/* Gender Toggle */}
        <div className="flex items-center border border-white/[0.1] bg-black/50 p-1 rounded-full shrink-0">
          <button
            type="button"
            onClick={() => setGender("male")}
            className={`px-4 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              gender === "male"
                ? "bg-[#22c55e] !text-black shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>{language === "bn" ? "পুরুষ" : "Male"}</span>
          </button>
          <button
            type="button"
            onClick={() => setGender("female")}
            className={`px-4 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              gender === "female"
                ? "bg-[#22c55e] !text-black shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>{language === "bn" ? "নারী" : "Female"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Metric Sliders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weight */}
          <div>
            <div className="flex justify-between items-center mb-2 text-xs text-zinc-300 font-medium">
              <span>Body Weight</span>
              <span className="text-white font-bold text-sm bg-white/[0.04] px-2.5 py-0.5 rounded-md border border-white/[0.08]">
                {weight} KG
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="150"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>40 KG</span>
              <span>95 KG</span>
              <span>150 KG</span>
            </div>
          </div>

          {/* Height */}
          <div>
            <div className="flex justify-between items-center mb-2 text-xs text-zinc-300 font-medium">
              <span>Height</span>
              <span className="text-white font-bold text-sm bg-white/[0.04] px-2.5 py-0.5 rounded-md border border-white/[0.08]">
                {height} CM
              </span>
            </div>
            <input
              type="range"
              min="135"
              max="210"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>135 CM (4&apos;5&quot;)</span>
              <span>172 CM (5&apos;8&quot;)</span>
              <span>210 CM (6&apos;11&quot;)</span>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs text-zinc-300 font-medium mb-2">
              Physical Activity Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { factor: 1.2, label: "Sedentary", sub: "Desk Job" },
                { factor: 1.45, label: "Moderate", sub: "3-4 Days" },
                { factor: 1.75, label: "Active", sub: "Daily Training" },
              ].map((lvl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivity(lvl.factor)}
                  className={`py-2 px-2 text-xs rounded-xl border transition-all cursor-pointer text-center ${
                    activity === lvl.factor
                      ? "bg-[#22c55e] !text-black font-bold border-[#22c55e] shadow-sm"
                      : "bg-white/[0.02] text-zinc-400 border-white/[0.08] hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="block font-bold">{lvl.label}</span>
                  <span className={`text-[10px] block opacity-80 ${activity === lvl.factor ? "!text-black" : ""}`}>{lvl.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Result Display */}
        <div className="lg:col-span-5 border border-white/[0.08] bg-[#121216] p-6 sm:p-7 rounded-2xl flex flex-col justify-between text-left shadow-lg">
          <div>
            <div className="text-xs text-zinc-400 font-medium">
              Calculated BMI Score
            </div>

            <div className="text-5xl font-black text-white tracking-tight my-2">
              {bmi}
            </div>

            <div className="inline-block px-3 py-1 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-xs font-semibold text-[#22c55e] mb-5">
              {language === "bn" ? statusBn : statusEn}
            </div>

            <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e0e12] mb-5">
              <div className="text-xs text-zinc-400 font-medium">
                Estimated Daily Calories (TDEE)
              </div>
              <div className="text-xl font-bold text-white mt-0.5">
                ~{tdee} kcal / day
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              {language === "bn" ? recommendationBn : recommendationEn}
            </p>
          </div>

          <button
            type="button"
            onClick={handleConsult}
            className="w-full py-3 bg-[#22c55e] hover:bg-[#16a34a] !text-black text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#22c55e]/25 rounded-xl"
          >
            <span className="!text-black">Consult Floor Coach for Custom Diet Plan</span>
            <ArrowUpRight className="w-3.5 h-3.5 !text-black stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
