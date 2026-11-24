"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`inline-flex items-center justify-center p-2 rounded-sm border border-white/[0.1] text-zinc-400 bg-white/[0.03] opacity-60 ${className}`}
        disabled
      >
        <span className="w-4 h-4 block" />
        {showLabel && <span className="ml-2 text-xs font-mono">Theme</span>}
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex items-center justify-center p-2 rounded-sm border transition-all duration-200 cursor-pointer select-none group ${
        isDark
          ? "bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.1] text-zinc-300 hover:text-white"
          : "bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700 hover:text-zinc-950 shadow-xs"
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-800 transition-transform duration-300 group-hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="ml-2 text-xs font-mono font-medium">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
