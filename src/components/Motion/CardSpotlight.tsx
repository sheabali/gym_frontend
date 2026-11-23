"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
  showReticles?: boolean;
}

export default function CardSpotlight({
  children,
  className = "",
  spotlightColor = "rgba(34, 197, 94, 0.14)",
  enableTilt = true,
  showReticles = false,
}: CardSpotlightProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: -999,
    y: -999,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number }>({
    rotateX: 0,
    rotateY: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg tilt
      const rotateY = ((x - centerX) / centerX) * 5; // Max 5 deg tilt
      setTilt({ rotateX, rotateY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: -999, y: -999 });
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={
        enableTilt
          ? {
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
              scale: isHovered ? 1.01 : 1,
            }
          : {}
      }
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden rounded-xs bg-[#0e0e12] border border-white/[0.08] transition-colors duration-300 ${className}`}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* Subtle border highlight under cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xs opacity-0 transition-opacity duration-300 z-10 border border-[#22c55e]/40"
        style={{
          opacity: isHovered ? 1 : 0,
          maskImage: `radial-gradient(220px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(220px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
        }}
      />

      {/* Optional Corner Telemetry Reticles */}
      {showReticles && (
        <>
          <span className="pointer-events-none absolute top-1 left-1 text-[9px] font-mono text-white/20 select-none">
            +
          </span>
          <span className="pointer-events-none absolute top-1 right-1 text-[9px] font-mono text-white/20 select-none">
            +
          </span>
          <span className="pointer-events-none absolute bottom-1 left-1 text-[9px] font-mono text-white/20 select-none">
            +
          </span>
          <span className="pointer-events-none absolute bottom-1 right-1 text-[9px] font-mono text-white/20 select-none">
            +
          </span>
        </>
      )}

      {/* Content wrapper */}
      <div className="relative z-20 h-full w-full">{children}</div>
    </motion.div>
  );
}
