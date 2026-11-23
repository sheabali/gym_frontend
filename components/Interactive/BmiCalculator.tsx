"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUpRight } from "lucide-react";

export default function BmiCalculator() {
  const { language } = useLanguage();

  const [weight, setWeight] = useState(72);
  const [height, setHeight] = useState(172);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState<number>(1.4);

  const heightInMeters = height / 100;
  const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));

  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * 26 + 5
      : 10 * weight + 6.25 * height - 5 * 26 - 161;
  const tdee = Math.round(bmr * activity);

  let statusEn = "OPTIMAL WEIGHT";
  let statusBn = "স্বাভাবিক ওজন";
  let recommendationEn = "Optimal muscle building & progressive strength conditioning recommended.";
  let recommendationBn = "লিন মাসল বিল্ডিং এবং স্ট্রেংথ কন্ডিশনিং সেশন আপনার জন্য সেরা।";

  if (bmi < 18.5) {
    statusEn = "UNDERWEIGHT";
    statusBn = "স্বাভাবিকের চেয়ে কম";
    recommendationEn = "Calorie surplus nutrition + progressive compound strength training.";
    recommendationBn = "ক্যালোরি সারপ্লাস ডায়েট এবং হেভি ওয়েট লিফটিং আপনার জন্য প্রয়োজন।";
  } else if (bmi >= 25 && bmi < 29.9) {
    statusEn = "OVERWEIGHT (MILD)";
    statusBn = "অতিরিক্ত ওজন";
    recommendationEn = "Moderate calorie deficit + HIIT cardio & compound resistance circuits.";
    recommendationBn = "ক্যালোরি ঘাটতি ডায়েট এবং কার্ডিও সহ কম্পাউন্ড রেজিস্ট্যান্স ট্রেনিং প্রয়োজন।";
  } else if (bmi >= 30) {
    statusEn = "HIGH BODY FAT (OBESE)";
    statusBn = "স্থূলতা (মেদবহুল)";
    recommendationEn = "Structured fat-loss guidance under certified coach with low-impact cardio.";
    recommendationBn = "সার্টিফাইড কোচের অধীনে সুনির্দিষ্ট ফ্যাট-লস প্রোগ্রাম শুরু করা জরুরি।";
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
    <div className="w-full my-8 border border-white/[0.08] bg-[#0e0e12] p-6 sm:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="mono-label text-[10px] text-zinc-400 mb-1">
            CLINICAL TELEMETRY • TOOL 02
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            {language === "bn"
              ? "বিএমআই ও দৈনিক ক্যালোরি ক্যালকুলেটর"
              : "BMI & Basal Calorie Audit"}
          </h3>
        </div>

        {/* Gender Toggle */}
        <div className="flex items-center border border-white/[0.1] bg-black p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setGender("male")}
            className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${gender === "male"
              ? "bg-[#22c55e] !text-black font-black"
              : "text-zinc-400 hover:text-white"
              }`}
          >
            <span className={gender === "male" ? "!text-black font-black" : ""}>
              {language === "bn" ? "পুরুষ" : "MALE"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setGender("female")}
            className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${gender === "female"
              ? "bg-[#22c55e] !text-black font-black"
              : "text-zinc-400 hover:text-white"
              }`}
          >
            <span className={gender === "female" ? "!text-black font-black" : ""}>
              {language === "bn" ? "নারী" : "FEMALE"}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Metric Sliders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weight */}
          <div>
            <div className="flex justify-between items-center mb-2 text-xs mono-label text-zinc-300">
              <span>WEIGHT PARAMETER</span>
              <span className="text-white font-bold text-sm">
                {weight} KG
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="150"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-[#22c55e]"
            />
            <div className="flex justify-between text-[10px] mono-label text-zinc-400 mt-1">
              <span>40 KG</span>
              <span>95 KG</span>
              <span>150 KG</span>
            </div>
          </div>

          {/* Height */}
          <div>
            <div className="flex justify-between items-center mb-2 text-xs mono-label text-zinc-300">
              <span>STATURE PARAMETER</span>
              <span className="text-white font-bold text-sm">
                {height} CM
              </span>
            </div>
            <input
              type="range"
              min="135"
              max="210"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-[#22c55e]"
            />
            <div className="flex justify-between text-[10px] mono-label text-zinc-400 mt-1">
              <span>135 CM (4&apos;5&quot;)</span>
              <span>172 CM (5&apos;8&quot;)</span>
              <span>210 CM (6&apos;11&quot;)</span>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-[11px] mono-label text-zinc-400 mb-2">
              PHYSICAL ACTIVITY INDEX
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { factor: 1.2, label: "SEDENTARY (DESK)" },
                { factor: 1.45, label: "MODERATE (3-4 DAYS)" },
                { factor: 1.75, label: "INTENSE (DAILY LIFT)" },
              ].map((lvl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivity(lvl.factor)}
                  className={`py-2 px-2 text-[10px] font-mono uppercase tracking-wider border transition-all ${activity === lvl.factor
                    ? "bg-[#22c55e] !text-black font-black border-[#22c55e]"
                    : "bg-transparent text-zinc-400 border-white/[0.08] hover:border-white/20"
                    }`}
                >
                  <span className={activity === lvl.factor ? "!text-black font-black" : ""}>
                    {lvl.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Telemetry Result Display */}
        <div className="lg:col-span-5 border border-white/[0.08] bg-[#0a0a0c] p-6 sm:p-8 flex flex-col justify-between text-left">
          <div>
            <div className="mono-label text-[10px] text-zinc-400">
              COMPUTED SCORE
            </div>

            <div className="text-5xl sm:text-6xl font-black text-white tracking-tighter my-2 font-mono">
              {bmi}
            </div>

            <div className="inline-block px-2.5 py-0.5 border border-[#22c55e]/30 bg-[#22c55e]/10 text-[10px] mono-label text-[#22c55e] mb-6">
              {language === "bn" ? statusBn : statusEn}
            </div>

            <div className="p-3 border border-white/[0.08] bg-[#121216] mb-6">
              <div className="text-[10px] mono-label text-zinc-400">
                DAILY MAINTENANCE TARGET (TDEE)
              </div>
              <div className="text-xl font-bold text-white font-mono mt-0.5">
                ~{tdee} KCAL / DAY
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              {language === "bn" ? recommendationBn : recommendationEn}
            </p>
          </div>

          <button
            type="button"
            onClick={handleConsult}
            className="w-full py-3 bg-[#22c55e] hover:bg-[#16a34a] !text-black text-xs uppercase tracking-wider font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#22c55e]/25 rounded-xs"
          >
            <span className="!text-black font-black">CONSULT FLOOR COACH FOR DIET CHART</span>
            <ArrowUpRight className="w-3.5 h-3.5 !text-black stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
