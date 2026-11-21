"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";
import {
  MapPin,
  Phone,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Please enter your full name (at least 2 letters)" }),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid phone number (at least 10 digits)" }),
  plan: z.string().min(1, { message: "Please select a plan" }),
  slot: z.string().min(1, { message: "Please select a preferred shift slot" }),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactSection() {
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedPlusCode, setCopiedPlusCode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      plan: "half-yearly",
      slot: "male-evening",
      message: "",
    },
  });

  const selectedPlan = watch("plan");
  const selectedSlot = watch("slot");

  // Listen to select-gym-plan event from pricing cards
  useEffect(() => {
    const handleSelectGymPlan = (e: any) => {
      if (e.detail?.planId) {
        setValue("plan", e.detail.planId);
      }
    };
    window.addEventListener("select-gym-plan", handleSelectGymPlan);
    return () => window.removeEventListener("select-gym-plan", handleSelectGymPlan);
  }, [setValue]);

  const handleCopyPlusCode = () => {
    navigator.clipboard.writeText(BUSINESS_INFO.plusCode);
    setCopiedPlusCode(true);
    toast.success(
      language === "bn"
        ? "প্লাস কোড QC6J+VP কপি করা হয়েছে!"
        : "Google Plus Code QC6J+VP copied to clipboard!"
    );
    setTimeout(() => setCopiedPlusCode(false), 3000);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        setIsSubmitted(true);
        toast.success(
          language === "bn"
            ? "আপনার বার্তা সফলভাবে গৃহীত হয়েছে! ফ্রন্ট ডেস্ক থেকে দ্রুত কল করা হবে।"
            : "Enrollment transmission received. Reception desk will verify your session shortly."
        );
        reset();
      } else {
        toast.error(res.message || "Submission failed. Please dial 01733-521052 directly.");
      }
    } catch (err) {
      toast.error(
        language === "bn"
          ? "সাময়িক ত্রুটি। অনুগ্রহ করে সরাসরি ফোন করুন: 01733-521052"
          : "Network error. Please call us directly at 01733-521052"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const planOptions = [
    {
      id: "trial",
      titleEn: "Free Trial",
      titleBn: "ফ্রি ট্রায়াল",
      price: "৳0",
      subEn: "Complimentary Workout",
      subBn: "১টি ফ্রি সেশন",
    },
    {
      id: "single",
      titleEn: "Single",
      titleBn: "সিঙ্গেল মেম্বারশিপ",
      price: "৳3,300",
      subEn: "1 Month (Renewal ৳1.5K)",
      subBn: "১ মাস (রিনিউ ১.৫K)",
      tag: "SAVE ৳200",
    },
    {
      id: "quarterly",
      titleEn: "3 Months",
      titleBn: "৩ মাস প্যাকেজ",
      price: "৳5,700",
      subEn: "3 Months Total",
      subBn: "৩ মাস সর্বমোট",
      tag: "SAVE ৳800",
    },
    {
      id: "half-yearly",
      titleEn: "6 Months",
      titleBn: "৬ মাস প্যাকেজ",
      price: "৳9,500",
      subEn: "6 Months Commitment",
      subBn: "৬ মাস পূর্ণ প্যাকেজ",
      tag: "POPULAR • SAVE ৳1.5K",
    },
    {
      id: "yearly",
      titleEn: "1 Year",
      titleBn: "১ বছর মেম্বারশিপ",
      price: "৳17,000",
      subEn: "Full 12 Months",
      subBn: "পূর্ণ ১ বছর",
      tag: "BEST VALUE • SAVE ৳3K",
    },
  ];

  const slotOptions = [
    {
      id: "male-morning",
      titleEn: "Male Morning",
      titleBn: "পুরুষ সকাল",
      time: "07:00 – 11:30 AM",
    },
    {
      id: "female-shift",
      titleEn: "Female Private",
      titleBn: "নারী এক্সক্লুসিভ",
      time: "12:00 – 04:30 PM",
      highlight: true,
    },
    {
      id: "combined-shift",
      titleEn: "Combined Shift",
      titleBn: "কম্বাইন্ড শিফট",
      time: "04:30 – 06:30 PM",
    },
    {
      id: "male-evening",
      titleEn: "Male Prime",
      titleBn: "পুরুষ সন্ধ্যা/নাইট",
      time: "06:30 – 10:30 PM",
    },
  ];

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0b0b0d]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-zinc-400 mb-2">
              [ 10 // PHYSICAL LOCATION & DIRECT ENROLLMENT ]
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "লোকেশন ও যোগাযোগ" : "Visit & Connect"}
            </h2>
          </div>
          <div className="max-w-md">
            <span className="text-xs font-mono text-[#22c55e] uppercase tracking-wider font-bold block mb-1">
              HOUSE-16, ROAD-03, BLOCK-D, BANASREE, DHAKA 1219
            </span>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
              {language === "bn"
                ? "সরাসরি চলে আসুন বনশ্রী ব্লক-ডি প্রধান জিম ভিজিট করতে, অথবা নিচের ফর্মটি পূরণ করে ফ্রি ট্রায়াল নিশ্চিত করুন।"
                : "Drop by our Banasree Block-D flagship campus, or schedule your complimentary walkthrough and trial below."}
            </p>
          </div>
        </div>

        {/* 2-Column Balanced & Airy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (5 Cols): Clean Physical Campus & Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-white/[0.08] bg-[#0e0e12] p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-[10px] font-mono text-[#22c55e] uppercase tracking-wider font-bold block mb-1.5">
                  MAIN CAMPUS • BANASREE BLOCK-D
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  House-16, Road-03, Block-D
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 font-mono leading-relaxed">
                  Banasree, Rampura Thana, Dhaka 1219. Near Banasree Central Mosque.
                </p>
              </div>

              {/* Hours & Rating */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06] text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">HOURS</span>
                  <span className="font-bold text-white">Daily 07:00 AM – 10:30 PM</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">VERIFIED RATING</span>
                  <span className="font-bold text-[#22c55e]">★ 4.4 (173 Reviews)</span>
                </div>
              </div>

              {/* Direct Communication Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="py-3 px-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.12] text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors font-bold rounded-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>{BUSINESS_INFO.phone}</span>
                </a>

                <a
                  href={`https://wa.me/8801733521052?text=Hello%20Platinum%20Gym%2C%20I%20want%20to%20visit%20the%20gym%20in%20Banasree%20Block-D`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-[#22c55e]/10 hover:bg-[#22c55e]/20 border border-[#22c55e]/30 text-[#22c55e] font-mono text-xs flex items-center justify-center gap-2 transition-colors font-bold rounded-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WHATSAPP DESK</span>
                </a>
              </div>
            </div>

            {/* Google Map Box */}
            <div className="border border-white/[0.08] bg-[#0e0e12] overflow-hidden">
              <div className="h-64 sm:h-72 w-full relative">
                <iframe
                  title="Platinum Gym Banasree Dhaka Map"
                  src={BUSINESS_INFO.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="p-3.5 bg-[#121216] flex items-center justify-between text-xs font-mono border-t border-white/[0.08]">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                  <span>QC6J+VP BANASREE</span>
                </span>
                <a
                  href={BUSINESS_INFO.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#22c55e] hover:text-[#16a34a] font-bold flex items-center gap-1 transition-colors"
                >
                  <span>GET DIRECTIONS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Streamlined, Clean Booking Form */}
          <div className="lg:col-span-7 border border-white/[0.08] bg-[#0e0e12] p-6 sm:p-8">
            <div className="pb-5 mb-6 border-b border-white/[0.08]">
              <span className="text-[10px] font-mono text-[#22c55e] uppercase tracking-wider font-bold block mb-1">
                ONLINE REGISTRATION & INQUIRY
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                {language === "bn" ? "অ্যাডমিশন ও ফ্রি ট্রায়াল ফর্ম" : "Book a Visit or Membership"}
              </h3>
            </div>

            {isSubmitted ? (
              <div className="py-12 px-6 border border-[#22c55e]/30 bg-[#22c55e]/5 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-[#22c55e] text-black flex items-center justify-center mb-4 rounded-xs">
                  <CheckCircle2 className="w-6 h-6 !text-black stroke-[2.5]" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white mb-2 uppercase tracking-tight">
                  {language === "bn" ? "অনুরোধ নিশ্চিত করা হয়েছে!" : "Booking Confirmed."}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-8 leading-relaxed font-mono">
                  {language === "bn"
                    ? "প্লাটিনাম জিম বনশ্রী ব্লক-ডি নির্বাচন করার জন্য ধন্যবাদ। আমাদের ফ্রন্ট ডেস্ক ম্যানেজার আপনার নম্বরে দ্রুত কল করে সেশন নিশ্চিত করবেন।"
                    : "Thank you for selecting Platinum Gym. Our Banasree front desk manager will contact you shortly to confirm your entry."}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://wa.me/8801733521052?text=Hello%20Platinum%20Gym%2C%20I%20just%20submitted%20my%20enrollment%20request"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] !text-black font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 rounded-xs shadow-md shadow-[#22c55e]/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5 !text-black stroke-[2.5]" />
                    <span className="!text-black font-black">NOTIFY VIA WHATSAPP</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.12] text-xs font-mono uppercase tracking-wider text-white transition-colors cursor-pointer rounded-xs"
                  >
                    {language === "bn" ? "আরেকটি ফর্ম পূরণ করুন" : "SUBMIT ANOTHER RECORD"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 1. Clean Package Selector */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-2.5 block">
                    01. SELECT PLAN / GOAL
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {planOptions.map((opt) => {
                      const isSelected = selectedPlan === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setValue("plan", opt.id)}
                          className={`py-2.5 px-3 border text-center transition-all cursor-pointer rounded-xs ${
                            isSelected
                              ? "bg-[#22c55e] !text-black font-bold border-[#22c55e] shadow-md shadow-[#22c55e]/20"
                              : "bg-[#121216] border-white/[0.08] text-zinc-300 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <span className={`text-xs block font-bold ${isSelected ? "!text-black" : "text-white"}`}>
                            {language === "bn" ? opt.titleBn : opt.titleEn}
                          </span>
                          <span className={`text-[10px] font-mono block mt-0.5 ${isSelected ? "!text-black/80 font-bold" : "text-[#22c55e]"}`}>
                            {opt.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Clean Shift Selector */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-2.5 block">
                    02. PREFERRED SHIFT
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {slotOptions.map((slot) => {
                      const isSelected = selectedSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setValue("slot", slot.id)}
                          className={`py-2 px-2.5 border text-center transition-all cursor-pointer rounded-xs ${
                            isSelected
                              ? "bg-[#22c55e] !text-black font-bold border-[#22c55e] shadow-md shadow-[#22c55e]/20"
                              : "bg-[#121216] border-white/[0.08] text-zinc-300 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <span className={`text-xs block font-bold ${isSelected ? "!text-black" : "text-white"}`}>
                            {language === "bn" ? slot.titleBn : slot.titleEn}
                          </span>
                          <span className={`text-[10px] font-mono block mt-0.5 ${isSelected ? "!text-black/80" : "text-zinc-400"}`}>
                            {slot.time}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                      {t.contact.nameLabel} <span className="text-[#22c55e]">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder={t.contact.namePlaceholder}
                      className={`w-full px-4 py-3 bg-[#121216] border text-sm text-white placeholder-zinc-600 focus:outline-none transition-all font-mono rounded-xs ${
                        errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/[0.08] focus:border-[#22c55e]"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1 font-mono">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                      {t.contact.phoneLabel} <span className="text-[#22c55e]">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      placeholder={t.contact.phonePlaceholder}
                      className={`w-full px-4 py-3 bg-[#121216] border text-sm text-white placeholder-zinc-600 focus:outline-none transition-all font-mono rounded-xs ${
                        errors.phone
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/[0.08] focus:border-[#22c55e]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-400 mt-1 font-mono">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xs text-xs sm:text-sm font-mono uppercase tracking-wider font-black !text-black bg-[#22c55e] hover:bg-[#16a34a] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-[#22c55e]/25"
                  >
                    {isSubmitting ? (
                      <span className="!text-black font-black">{t.contact.submitting}</span>
                    ) : (
                      <>
                        <span className="!text-black font-black">
                          {language === "bn" ? "বুকিং নিশ্চিত করুন" : "CONFIRM ADMISSION / TRIAL"}
                        </span>
                        <ArrowRight className="w-4 h-4 !text-black stroke-[2.5]" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 pt-3 text-[11px] font-mono text-zinc-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>NO ADVANCE PAYMENT • IMMEDIATE CONFIRMATION BY PHONE</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}