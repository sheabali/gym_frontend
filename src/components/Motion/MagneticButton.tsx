"use client";

import React from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  textParallax?: boolean;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  disabled,
  type = "button",
  ...props
}: MagneticButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`relative inline-flex items-center justify-center select-none font-medium transition-colors cursor-pointer rounded-sm ${className}`}
      {...(props as any)}
    >
      <span className="inline-flex items-center justify-center gap-2 pointer-events-none w-full">
        {children}
      </span>
    </motion.button>
  );
}
