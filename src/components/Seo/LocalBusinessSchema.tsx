import React from "react";
import { BUSINESS_INFO } from "@/data/gymData";

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: "Platinum Gym (প্লাটিনাম জিম)",
    alternateName: ["Platinum Gym Banasree", "Platinum Fitness Dhaka"],
    description:
      "Premier 100% air-conditioned gym in Banasree, Dhaka with world-class equipment, certified trainers in every shift, and dedicated male & female slots.",
    url: "https://platinumgym.bd",
    telephone: BUSINESS_INFO.phoneTel,
    priceRange: "৳৳",
    image: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "House-16, Road-03, Block-D, Banasree",
      addressLocality: "Dhaka",
      postalCode: "1219",
      addressRegion: "Dhaka Division",
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_INFO.coordinates.lat,
      longitude: BUSINESS_INFO.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "07:00",
        closes: "22:30",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS_INFO.googleRating,
      reviewCount: BUSINESS_INFO.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Air Conditioning",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Free Weights & Heavy Dumbbells",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Separate Female Shift with Certified Female Trainers",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Lockers & Showers",
        value: true,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
