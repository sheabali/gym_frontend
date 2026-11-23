"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";
import { Phone, MessageSquare, ArrowUp, Calendar } from "lucide-react";

export default function FloatingActions() {
  const { language, t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      const topOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Scroll to Top FAB (Desktop, Tablet & Mobile) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-10 h-10 rounded-full bg-[#121216]/90 hover:bg-[#1c1c22] border border-white/[0.12] text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono"
        >
          <ArrowUp className="w-4 h-4 text-[#22c55e]" />
        </button>
      )}

      {/* Floating Bottom Action Bar on Mobile */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-50">
        <div className="bg-[#0b0b0e]/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl p-2 shadow-2xl shadow-black/80 flex items-center justify-between gap-2">
          {/* Call button */}
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono text-xs flex items-center justify-center gap-1.5 border border-white/[0.08] transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>{t.floating.call}</span>
          </a>

          {/* WhatsApp button */}
          <a
            href={BUSINESS_INFO.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#22c55e]/15 hover:bg-[#22c55e]/25 text-[#22c55e] font-mono text-xs flex items-center justify-center gap-1.5 border border-[#22c55e]/30 transition-all font-bold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.floating.whatsapp}</span>
          </a>

          {/* Book Trial button */}
          <button
            type="button"
            onClick={scrollToContact}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] !text-black font-mono uppercase font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#22c55e]/25 transition-all"
          >
            <Calendar className="w-3.5 h-3.5 !text-black stroke-[2.5]" />
            <span className="!text-black font-black">{language === "bn" ? "ট্রায়াল" : "Trial"}</span>
          </button>
        </div>
      </div>
    </>
  );
}