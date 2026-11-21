import React from "react";
import HeroSection from "@/components/Sections/HeroSection";
import LiveEnergyTicker from "@/components/Motion/LiveEnergyTicker";
import AboutSection from "@/components/Sections/AboutSection";
import FacilitiesSection from "@/components/Sections/FacilitiesSection";
import ScheduleSection from "@/components/Sections/ScheduleSection";
import TrainersSection from "@/components/Sections/TrainersSection";
import PricingSection from "@/components/Sections/PricingSection";
import TransformationSection from "@/components/Sections/TransformationSection";
import GallerySection from "@/components/Sections/GallerySection";
import ReviewsSection from "@/components/Sections/ReviewsSection";
import FaqSection from "@/components/Sections/FaqSection";
import ContactSection from "@/components/Sections/ContactSection";

export const metadata = {
  title: "Platinum Gym (প্লাটিনাম জিম) | Premier Fitness Center in Banasree, Dhaka",
  description:
    "Banasree’s premier 100% air-conditioned gym. Complete modern equipment, certified trainers in every shift, dedicated male and female time slots. 4.4 Google rating (173 reviews). Call 01733-521052.",
  keywords: [
    "Platinum Gym",
    "প্লাটিনাম জিম",
    "Gym in Banasree",
    "Gym in Dhaka",
    "Female gym shift Dhaka",
    "Air conditioned gym Banasree",
    "Fitness center Banasree",
    "Best gym in Rampura",
    "Platinum Fitness Banasree",
  ],
  openGraph: {
    title: "Platinum Gym (প্লাটিনাম জিম) - Banasree, Dhaka",
    description:
      "Premier 100% air-conditioned gym in Banasree, Dhaka. World-class equipment, certified trainers, and separate male and female shifts.",
    url: "https://platinumgym.bd",
    siteName: "Platinum Gym",
    images: [
      {
        url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Platinum Gym Banasree Dhaka Floor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platinum Gym (প্লাটিনাম জিম) - Banasree, Dhaka",
    description:
      "Premier 100% air-conditioned gym in Banasree, Dhaka. 4.4 Google rating (173 reviews).",
    images: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LiveEnergyTicker />
      <AboutSection />
      <FacilitiesSection />
      <ScheduleSection />
      <TrainersSection />
      <PricingSection />
      <TransformationSection />
      <GallerySection />
      <ReviewsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
