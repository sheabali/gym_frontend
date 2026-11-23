"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { GALLERY_IMAGES } from "@/data/gymData";
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

export default function GallerySection() {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<"all" | "floor" | "equipment" | "training" | "cardio">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages =
    filter === "all"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === filter);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  return (
    <section id="gallery" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0b0b0d]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-zinc-400 mb-2 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>07 • ARCHITECTURAL ARCHIVE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "ফটোগ্রাফি গ্যালারি" : "Spatial Archive"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "আমাদের সুপরিসর ফ্লোর, হেভি ডাম্বেল কর্নার ও পরিচ্ছন্ন পরিবেশ এক নজরে দেখে নিন।"
              : "Visual documentation of our climate-controlled floor, equipment bays, and private training suites."}
          </p>
        </div>

        {/* Minimalist Filter Pills with Fluid Motion */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/[0.06]">
          {[
            { key: "all", label: t.gallery.filterAll },
            { key: "floor", label: t.gallery.filterFloor },
            { key: "equipment", label: t.gallery.filterEquipment },
            { key: "cardio", label: t.gallery.filterCardio },
            { key: "training", label: t.gallery.filterTraining },
          ].map((tab) => {
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key as any)}
                className="relative px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer rounded-xs"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeGalleryFilterPill"
                    className="absolute inset-0 bg-[#22c55e] rounded-xs shadow-md shadow-[#22c55e]/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? "!text-black font-black" : "text-zinc-400 hover:text-white"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Photographic Grid with Interactive Reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, idx) => {
            const title = language === "bn" ? image.titleBn : image.titleEn;
            const categoryLabel =
              language === "bn"
                ? image.categoryLabelBn
                : image.categoryLabelEn;

            return (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => setLightboxIndex(idx)}
                className="group relative border border-white/[0.08] bg-[#121216] p-2 cursor-pointer hover:border-[#22c55e]/40 transition-all duration-300 rounded-xs shadow-xl"
              >
                {/* Corner reticles on hover */}
                <span className="pointer-events-none absolute top-1.5 left-1.5 text-[8px] font-mono text-transparent group-hover:text-[#22c55e] transition-colors select-none">
                  ┌
                </span>
                <span className="pointer-events-none absolute top-1.5 right-1.5 text-[8px] font-mono text-transparent group-hover:text-[#22c55e] transition-colors select-none">
                  ┐
                </span>
                <span className="pointer-events-none absolute bottom-1.5 left-1.5 text-[8px] font-mono text-transparent group-hover:text-[#22c55e] transition-colors select-none">
                  └
                </span>
                <span className="pointer-events-none absolute bottom-1.5 right-1.5 text-[8px] font-mono text-transparent group-hover:text-[#22c55e] transition-colors select-none">
                  ┘
                </span>

                <div className="aspect-[4/3] relative w-full overflow-hidden bg-zinc-900 rounded-xs">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="pt-3 pb-1 px-2 flex items-center justify-between text-[11px] mono-label text-zinc-400 font-mono">
                  <span className="truncate pr-2 group-hover:text-white transition-colors">{title}</span>
                  <span className="text-[#22c55e] shrink-0 font-bold">{categoryLabel}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fullscreen Lightbox Modal */}
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close Lightbox"
              className="absolute top-6 right-6 p-2 text-white hover:text-zinc-400 transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  lightboxIndex > 0
                    ? lightboxIndex - 1
                    : filteredImages.length - 1
                );
              }}
              aria-label="Previous"
              className="absolute left-4 sm:left-8 p-3 text-white hover:text-zinc-400 transition-colors z-20 cursor-pointer"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  lightboxIndex < filteredImages.length - 1
                    ? lightboxIndex + 1
                    : 0
                );
              }}
              aria-label="Next"
              className="absolute right-4 sm:right-8 p-3 text-white hover:text-zinc-400 transition-colors z-20 cursor-pointer"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center">
              <div className="relative w-full h-[65vh] border border-white/[0.1] bg-black">
                <Image
                  src={filteredImages[lightboxIndex].src}
                  alt={filteredImages[lightboxIndex].alt}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="mt-4 text-center">
                <span className="text-xs mono-label text-zinc-400 block mb-1 font-mono">
                  {filteredImages[lightboxIndex].categoryLabelEn} • ARCHIVE {lightboxIndex + 1} OF {filteredImages.length}
                </span>
                <p className="text-sm font-bold text-white">
                  {language === "bn"
                    ? filteredImages[lightboxIndex].titleBn
                    : filteredImages[lightboxIndex].titleEn}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
