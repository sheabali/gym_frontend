"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";
import {
  Phone,
  MapPin,
  Clock,
  Star,
  ArrowUp,
  MessageSquare,
  Facebook,
  Instagram,
  Youtube,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  const { language, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { href: "#about", label: t.nav.about },
    { href: "#facilities", label: t.nav.facilities },
    { href: "#schedule", label: t.nav.schedule },
    { href: "#trainers", label: t.nav.trainers },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#gallery", label: t.nav.gallery },
    { href: "#reviews", label: t.nav.reviews },
    { href: "#faq", label: t.nav.faq },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <footer className="bg-[#070709] border-t border-white/[0.08] relative overflow-hidden text-zinc-400">
      {/* Monumental Architectural Watermark */}
      <div className="pt-12 sm:pt-16 pb-4 sm:pb-8 px-4 sm:px-6 lg:px-8 border-b border-white/[0.04] overflow-hidden select-none pointer-events-none">
        <h2 className="text-4xl sm:text-7xl lg:text-[10rem] font-black tracking-tighter text-white/[0.03] uppercase whitespace-nowrap leading-none">
          PLATINUM GYM BANASREE
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/[0.08]">
          {/* Brand & Identity Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm tracking-widest text-[#22c55e]">[ PG-01 ]</span>
                <span className="text-xs font-mono text-zinc-500">BANASREE BLOCK-D</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30">EST. 2015</span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                PLATINUM GYM
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                {BUSINESS_INFO.nameBangla} • Dhaka 1219 • www.platinumgym.com
              </p>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-mono max-w-sm">
              {t.footer.tagline}
            </p>

            {/* Google Rating Pill */}
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>4.4 / 5.0</span>
              </div>
              <span className="text-zinc-600 font-mono text-xs">•</span>
              <span className="text-[11px] font-mono text-zinc-400">
                173 {language === "bn" ? "গুগল রিভিউ" : "Google Reviews"}
              </span>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={BUSINESS_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
              <a
                href={BUSINESS_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={BUSINESS_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={BUSINESS_INFO.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Directory Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white">
              [ DIRECTORY INDEX ]
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs font-mono">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors block py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Timetable Summary */}
          <div className="lg:col-span-4 space-y-4 font-mono text-xs">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white">
              [ TIMETABLE SPECIFICATIONS ]
            </h4>
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-zinc-400">MALE MORNING</span>
                <span className="text-white">07:00 – 11:30 AM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-[#22c55e]">FEMALE PRIVATE</span>
                <span className="text-white">12:00 – 04:30 PM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-zinc-400">COMBINED SHIFT</span>
                <span className="text-white">04:30 – 06:30 PM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-zinc-400">MALE EVENING</span>
                <span className="text-white">06:30 – 10:30 PM</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>FRIDAY OPEN • CENTRAL INVERTER AC ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Telemetry, Copyright, Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>PLATINUM GYM DHAKA • BST +06:00</span>
          </div>

          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} PLATINUM GYM. HOUSE-16, ROAD-03, BLOCK-D, BANASREE.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <span>RETURN TO APEX</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}