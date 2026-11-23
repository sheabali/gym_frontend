"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number; // Distance multiplier for magnetic pull (e.g. 0.35)
  textParallax?: boolean; // Multi-layered parallax depth effect
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  textParallax = true,
  onClick,
  disabled,
  type = "button",
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Motion values for button container
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for magnetic pull & return
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Parallax motion values for inner content (faster pull)
  const textX = useSpring(x, { damping: 12, stiffness: 180, mass: 0.1 });
  const textY = useSpring(y, { damping: 12, stiffness: 180, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isTouchDevice || !ref.current) return;
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
      }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      {...(props as any)}
    >
      {textParallax ? (
        <motion.span
          style={{
            x: textX,
            y: textY,
          }}
          className="inline-flex items-center justify-center gap-2 pointer-events-none w-full"
        >
          {children}
        </motion.span>
      ) : (
        children
      )}
    </motion.button>
  );
}
