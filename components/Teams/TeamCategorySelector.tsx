"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Brain,
  Terminal,
  Code,
  Palette,
  Calendar,
  Megaphone,
  Handshake,
  LucideIcon,
} from "lucide-react";

interface TeamCategorySelectorProps {
  categories: readonly { key: string; label: string }[];
  activeCategory: string;
  onSelect: (key: string) => void;
}

const categoryIcons: Record<string, LucideIcon> = {
  core: Crown,
  aiml: Brain,
  cp: Terminal,
  development: Code,
  design: Palette,
  logistics: Calendar,
  pr: Megaphone,
  sponsorship: Handshake,
};

export default function TeamCategorySelector({
  categories,
  activeCategory,
  onSelect,
}: TeamCategorySelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-5xl mx-auto px-4 z-10 relative">
      {categories.map((cat, i) => {
        const isActive = activeCategory === cat.key;
        const IconComponent = categoryIcons[cat.key] || Code;

        return (
          <motion.button
            key={cat.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            onClick={() => onSelect(cat.key)}
            className="group relative flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 text-xs sm:text-sm font-medium focus:outline-none hover:scale-[1.02] active:scale-[0.98]"
          >
            {isActive && (
              <motion.div
                layoutId="activeCategoryTab"
                className="absolute inset-0 bg-red-500/10 border border-red-400/30 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.1)] z-0"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            {!isActive && (
              <div className="absolute inset-0 border border-white/5 bg-white/[0.01] rounded-full group-hover:border-white/20 group-hover:bg-white/[0.04] transition-all duration-300 z-0" />
            )}

            <div className="relative z-10 flex items-center gap-2">
              <IconComponent
                size={14}
                className={`transition-colors duration-300 ${
                  isActive ? "text-red-400" : "text-white/40 group-hover:text-white/80"
                }`}
              />
              <span
                className={`uppercase tracking-wider transition-colors duration-300 text-[10px] sm:text-[11px] font-mono font-semibold ${
                  isActive ? "text-red-400" : "text-white/50 group-hover:text-white/80"
                }`}
              >
                {cat.label}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
