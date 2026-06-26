"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { Building, FileText, Download, Users, ArrowRight } from "lucide-react";
import Magnet from "./Magnet";

interface FolderCardProps {
  company: string;
  count: number;
  contributors: string[];
  pdfPath?: string;
  onClick?: () => void;
  meta: {
    color: string;
    bgGlow: string;
    gradientLine: string;
    buttonClass: string;
    initial: string;
  };
  buttonText?: string;
  customDescription?: string;
  badgeText?: string;
  isParent?: boolean;
  isSplitting?: boolean;
}

const brandBorders: Record<string, {
  border: string;
  borderHover: string;
  glowDefault: string;
  glowHover: string;
  text: string;
  bgBtn: string;
  borderBtn: string;
  colorHex: string;
}> = {
  "Google": {
    border: "border-blue-500/50",
    borderHover: "border-blue-400/80",
    glowDefault: "rgba(96, 165, 250, 0.22)",
    glowHover: "rgba(96, 165, 250, 0.45)",
    text: "text-blue-400",
    bgBtn: "group-hover:bg-blue-500 group-hover:text-black group-hover:border-blue-400",
    borderBtn: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    colorHex: "#3b82f6",
  },
  "D.E. Shaw": {
    border: "border-rose-500/50",
    borderHover: "border-rose-400/80",
    glowDefault: "rgba(244, 63, 94, 0.22)",
    glowHover: "rgba(244, 63, 94, 0.45)",
    text: "text-rose-400",
    bgBtn: "group-hover:bg-rose-500 group-hover:text-black group-hover:border-rose-400",
    borderBtn: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    colorHex: "#f43f5e",
  },
  "JPMC": {
    border: "border-amber-500/50",
    borderHover: "border-amber-400/80",
    glowDefault: "rgba(251, 191, 36, 0.22)",
    glowHover: "rgba(251, 191, 36, 0.45)",
    text: "text-amber-400",
    bgBtn: "group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-400",
    borderBtn: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    colorHex: "#f59e0b",
  },
  "Salesforce": {
    border: "border-cyan-500/50",
    borderHover: "border-cyan-400/80",
    glowDefault: "rgba(34, 211, 238, 0.25)",
    glowHover: "rgba(34, 211, 238, 0.45)",
    text: "text-cyan-400",
    bgBtn: "group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-400",
    borderBtn: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    colorHex: "#06b6d4",
  },
  "Sprinklr": {
    border: "border-orange-500/50",
    borderHover: "border-orange-400/80",
    glowDefault: "rgba(249, 115, 22, 0.22)",
    glowHover: "rgba(249, 115, 22, 0.45)",
    text: "text-orange-500",
    bgBtn: "group-hover:bg-orange-500 group-hover:text-black group-hover:border-orange-400",
    borderBtn: "border-orange-500/30 text-orange-400 bg-orange-500/10",
    colorHex: "#f97316",
  },
  "Visa": {
    border: "border-indigo-500/50",
    borderHover: "border-indigo-400/80",
    glowDefault: "rgba(129, 140, 248, 0.22)",
    glowHover: "rgba(129, 140, 248, 0.45)",
    text: "text-indigo-400",
    bgBtn: "group-hover:bg-indigo-500 group-hover:text-black group-hover:border-indigo-400",
    borderBtn: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
    colorHex: "#6366f1",
  },
  "Wells Fargo": {
    border: "border-emerald-500/50",
    borderHover: "border-emerald-400/80",
    glowDefault: "rgba(52, 211, 153, 0.22)",
    glowHover: "rgba(52, 211, 153, 0.45)",
    text: "text-emerald-400",
    bgBtn: "group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400",
    borderBtn: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    colorHex: "#10b981",
  },
  "Goldman Sachs": {
    border: "border-sky-500/50",
    borderHover: "border-sky-400/80",
    glowDefault: "rgba(56, 189, 248, 0.22)",
    glowHover: "rgba(56, 189, 248, 0.45)",
    text: "text-sky-400",
    bgBtn: "group-hover:bg-sky-500 group-hover:text-black group-hover:border-sky-400",
    borderBtn: "border-sky-500/30 text-sky-400 bg-sky-500/10",
    colorHex: "#38bdf8",
  }
};

const defaultBrand = {
  border: "border-white/20",
  borderHover: "border-white/45",
  glowDefault: "rgba(255, 255, 255, 0.08)",
  glowHover: "rgba(255, 255, 255, 0.2)",
  text: "text-neutral-300",
  bgBtn: "group-hover:bg-white group-hover:text-black group-hover:border-white",
  borderBtn: "border-white/20 text-neutral-300 bg-white/5",
  colorHex: "rgba(255, 255, 255, 0.3)",
};

export default function FolderCard({
  company,
  count,
  contributors,
  pdfPath,
  onClick,
  meta,
  buttonText,
  customDescription,
  badgeText,
  isParent = false,
  isSplitting = false,
}: FolderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Reduced tilt range (32 degree sweep) while preserving resting state (rotateX: 6, rotateY: -6)
  const rotateX = useSpring(useTransform(y, [0, 1], [22, -10]), { damping: 20, stiffness: 100 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-22, 10]), { damping: 20, stiffness: 100 });

  // Parallax offsets for Layer 2 (Document Content)
  const docX = useSpring(useTransform(x, [0, 1], [5, -5]), { damping: 20, stiffness: 100 });
  const docY = useSpring(useTransform(y, [0, 1], [5, -5]), { damping: 20, stiffness: 100 });

  // Parallax offsets for Layer 3 (Front Cover Content)
  const coverContentX = useSpring(useTransform(x, [0, 1], [9, -9]), { damping: 20, stiffness: 100 });
  const coverContentY = useSpring(useTransform(y, [0, 1], [9, -9]), { damping: 20, stiffness: 100 });

  // Watermark letter parallax (sinks deeper in the opposite direction)
  const watermarkX = useSpring(useTransform(x, [0, 1], [-11, 11]), { damping: 20, stiffness: 100 });
  const watermarkY = useSpring(useTransform(y, [0, 1], [-11, 11]), { damping: 20, stiffness: 100 });

  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);

    const handleClose = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== cardRef.current) {
        setIsActive(false);
      }
    };

    const handleDocumentClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };

    document.addEventListener("close-folder-cards", handleClose);
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("close-folder-cards", handleClose);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    if (!isTouch || isActive) return;

    // Gentle auto-sway animation for touch devices when not active to demonstrate 3D layer depth
    const controlsX = animate(x, [0.5, 0.35, 0.65, 0.5], {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    });

    const controlsY = animate(y, [0.5, 0.58, 0.42, 0.5], {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    });

    return () => {
      controlsX.stop();
      controlsY.stop();
      x.set(0.5);
      y.set(0.5);
    };
  }, [isTouch, isActive, x, y]);

  const showHoverState = isActive || isHovered;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    x.set((e.clientX - rect.left) / width);
    y.set((e.clientY - rect.top) / height);

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const isKeyboard = e.clientX === 0 && e.clientY === 0;
    const clickX = isKeyboard ? 0.5 : (e.clientX - rect.left) / rect.width;
    const clickY = isKeyboard ? 0.5 : (e.clientY - rect.top) / rect.height;

    x.set(clickX);
    y.set(clickY);
    setPosition({
      x: isKeyboard ? rect.width / 2 : e.clientX - rect.left,
      y: isKeyboard ? rect.height / 2 : e.clientY - rect.top,
    });
  };

  let brand = brandBorders[company] || defaultBrand;
  if (company.includes("Batch")) {
    brand = {
      border: "border-rose-500/50",
      borderHover: "border-rose-400/80",
      glowDefault: "rgba(244, 63, 94, 0.22)",
      glowHover: "rgba(244, 63, 94, 0.45)",
      text: "text-rose-400",
      bgBtn: "group-hover:bg-rose-500 group-hover:text-black group-hover:border-rose-400",
      borderBtn: "border-rose-500/30 text-rose-400 bg-rose-500/10",
      colorHex: "#f43f5e",
    };
  }

  const content = (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="w-full h-full relative"
    >
      {/* Dynamic Under-card Shadow Layer */}
      <motion.div
        className="absolute bottom-0 left-0 w-full rounded-2xl bg-black/75 blur-2xl -z-10 transition-opacity duration-300"
        animate={
          isSplitting
            ? { scale: 0.5, opacity: 0 }
            : { scale: showHoverState ? 0.92 : 0.82, opacity: showHoverState ? 0.65 : 0.35 }
        }
        style={{
          z: -20,
          x: useSpring(useTransform(x, [0, 1], [15, -15]), { damping: 20, stiffness: 100 }),
          y: useSpring(useTransform(y, [0, 1], [25, -5]), { damping: 20, stiffness: 100 }),
          height: isParent ? "295px" : "245px",
        }}
      />

      {/* Layer 1: Folder Back Panel */}
      <motion.div
        animate={
          isSplitting
            ? { x: -450, rotate: -20, rotateY: -45, scale: 0.7, opacity: 0, z: 0 }
            : { x: 0, rotate: 0, rotateY: 0, scale: 1, opacity: 1, z: showHoverState ? 15 : 0 }
        }
        transition={
          isSplitting
            ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            : { type: "spring", stiffness: 100, damping: 18 }
        }
        className={`absolute bottom-0 left-0 w-full rounded-2xl bg-neutral-950 border transition-colors duration-500 z-0 ${
          isParent ? "h-[295px]" : "h-[245px]"
        } ${showHoverState ? brand.borderHover : brand.border}`}
        style={{
          boxShadow: showHoverState
            ? `0 25px 60px -12px ${brand.glowHover}, 0 10px 25px -10px rgba(0,0,0,0.8)`
            : `0 12px 35px -10px ${brand.glowDefault}, 0 8px 20px -8px rgba(0,0,0,0.7)`,
        }}
      >
        {/* Top Folder Tab */}
        <div
          className={`absolute left-[16px] px-4 bg-neutral-950 border-t border-x rounded-t-xl flex items-center gap-2 transition-colors duration-500 ${
            isParent ? "-top-[24px] h-[24px]" : "-top-[22px] h-[22px]"
          } ${showHoverState ? brand.borderHover : brand.border}`}
        >
          <Building size={13} className={`transition-colors duration-500 ${showHoverState ? brand.text : "text-neutral-500"}`} />
          <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-neutral-300 truncate max-w-[180px] sm:max-w-none">
            {company}
          </span>
        </div>
      </motion.div>

      {/* Layer 2: Inner Document Sheet */}
      <motion.div
        animate={
          isSplitting
            ? { y: -180, scale: 1.3, rotate: 5, opacity: 0, z: 20 }
            : {
                y: showHoverState ? (isParent ? -45 : -30) : (isParent ? 50 : 42),
                scale: showHoverState ? 1.02 : 0.96,
                opacity: 1,
                z: showHoverState ? 45 : 20
              }
        }
        transition={
          isSplitting
            ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            : { type: "spring", stiffness: 120, damping: 20 }
        }
        className={`absolute left-[3%] w-[94%] bg-[#1a1a1a] border border-white/10 border-t-white/25 rounded-xl p-4 z-10 flex flex-col justify-between shadow-2xl ${
          isParent ? "h-[275px]" : "h-[230px]"
        }`}
      >
        <motion.div
          className="w-full h-full flex flex-col justify-between"
          style={{
            transformStyle: "preserve-3d",
            x: docX,
            y: docY,
          }}
        >
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-medium tracking-[0.2em] text-neutral-400 uppercase">
              {onClick ? "Category // Placement Batch" : "Resource // PDF Guide"}
            </span>
            <div className="w-full h-px bg-white/5 mt-2 mb-2" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
            {onClick ? (
              <Building size={isParent ? 28 : 24} strokeWidth={1.5} className={`mb-2 ${brand.text} opacity-80`} />
            ) : (
              <FileText size={isParent ? 28 : 24} strokeWidth={1.5} className={`mb-2 ${brand.text} opacity-80`} />
            )}
            <h3 className={`font-display font-semibold text-white tracking-tight mb-1 ${
              isParent ? "text-sm sm:text-base mt-1" : "text-xs sm:text-sm"
            }`}>
              {onClick 
                ? (company.endsWith("Experiences") ? company : `${company} Experiences`) 
                : `${company} Interview Kit`
              }
            </h3>
            <p className={`font-body text-neutral-400 font-normal leading-snug max-w-[220px] ${
              isParent ? "text-[11px] sm:text-xs px-2" : "text-[10px] sm:text-[11px]"
            }`}>
              {onClick 
                ? "Click to open this batch and view specific company interview experiences."
                : "Click to view the full PDF containing coding challenges and HR strategies."
              }
            </p>
          </div>

          <Magnet className="w-full" magnetStrength={0.1}>
            <div
              className={`action-button-trigger flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-[11px] font-mono font-medium uppercase tracking-[0.12em] text-white transition-all duration-300 backdrop-blur-sm ${brand.borderBtn} ${brand.bgBtn} hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]`}
            >
              {onClick ? (
                <>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  {buttonText || "Open Folder"}
                </>
              ) : (
                <>
                  <Download size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                  {buttonText || "Download Guide"}
                </>
              )}
            </div>
          </Magnet>
        </motion.div>
      </motion.div>

      {/* Layer 3: Folder Front Cover */}
      <motion.div
        animate={
          isSplitting
            ? { x: 450, rotate: 20, rotateY: 45, scale: 0.7, opacity: 0, z: 40 }
            : {
                rotateX: showHoverState ? -24 : -6,
                y: showHoverState ? 10 : 0,
                x: 0,
                rotate: 0,
                rotateY: 0,
                scale: 1,
                opacity: 1,
                z: showHoverState ? 75 : 40
              }
        }
        transition={
          isSplitting
            ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            : { type: "spring", stiffness: 100, damping: 18 }
        }
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "bottom center",
          boxShadow: showHoverState
            ? "0 -10px 30px -10px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.2)"
            : "0 -5px 15px -8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
        className={`absolute bottom-0 left-0 w-full rounded-2xl bg-gradient-to-br from-neutral-900 to-[#101010] border border-t-white/20 p-4 flex flex-col justify-between overflow-hidden z-20 transition-colors duration-500 ${
          isParent ? "h-[295px]" : "h-[245px]"
        } ${showHoverState ? brand.borderHover : brand.border} ${isTouch && showHoverState ? "pointer-events-none" : ""}`}
      >
        {/* Spotlight Cursor */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ease-out"
          style={{
            opacity: showHoverState ? 1 : 0,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${brand.glowHover}, transparent 80%)`,
          }}
        />

        {/* Subdued Watermark Letter */}
        <motion.div
          style={{
            color: brand.colorHex,
            x: watermarkX,
            y: watermarkY,
            z: -10,
          }}
          className={`absolute bottom-2 right-4 text-[55px] sm:text-[75px] font-display font-black select-none pointer-events-none transition-all duration-500 ease-out leading-none z-0 ${
            showHoverState ? "opacity-25 scale-110" : "opacity-12"
          }`}
        >
          {meta.initial}
        </motion.div>

        {/* Foreground Content */}
        <motion.div
          className="relative z-10 flex flex-col justify-between h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            x: coverContentX,
            y: coverContentY,
          }}
          animate={{
            z: showHoverState ? 25 : 10,
          }}
        >
          <div className="flex justify-between items-start w-full">
            <h2 className={`font-display font-semibold italic tracking-tight bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent pb-1 pr-3 ${
              isParent ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
            }`}>
              {company}
            </h2>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md mt-1">
              <FileText size={12} className={brand.text} />
              <span className="text-[10px] font-mono font-medium tracking-wide">
                {badgeText || `${count} ${count === 1 ? "Exp" : "Exps"}`}
              </span>
            </div>
          </div>

          <div 
            className="flex flex-col justify-center flex-1 mt-3 border-l-2 pl-3 transition-all duration-500"
            style={{ borderLeftColor: showHoverState ? brand.colorHex : "rgba(255, 255, 255, 0.15)" }}
          >
            <p className={`font-body text-white/95 leading-relaxed font-medium pr-2 ${
              isParent ? "text-xs sm:text-[13px]" : "text-[11px] sm:text-[12px]"
            }`}>
              {customDescription || "Complete preparation guide containing online assessments, technical rounds, and interview experiences."}
            </p>
          </div>

          <div className="w-full pt-2.5 mt-3 border-t border-white/10 flex justify-between items-center">
            <span className="text-[9px] font-mono font-medium text-neutral-500 tracking-[0.15em] uppercase">
              {onClick ? "Placement Batch" : "Placement Resource"}
            </span>
            <span className="text-[9px] font-mono font-medium text-neutral-400 tracking-[0.15em] uppercase group-hover:text-white transition-colors duration-300">
              {onClick ? "Click to open folder" : "Click to open PDF"}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        onClick={(e) => {
          if (isTouch) {
            if (!isActive) {
              e.preventDefault();
              e.stopPropagation();
              setIsActive(true);
              document.dispatchEvent(new CustomEvent("close-folder-cards", { detail: cardRef.current }));
            } else {
              onClick();
            }
          } else {
            onClick();
          }
        }}
        type="button"
        className={`block relative mt-8 pt-1 group w-full max-w-[310px] sm:max-w-[340px] mx-auto outline-none text-left overflow-visible ${
          isParent ? "h-[370px]" : "h-[310px]"
        }`}
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d",
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      href={pdfPath}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (isTouch) {
          if (!isActive) {
            e.preventDefault();
            e.stopPropagation();
            setIsActive(true);
            document.dispatchEvent(new CustomEvent("close-folder-cards", { detail: cardRef.current }));
          } else {
            // Second click opens the PDF guide
          }
        }
      }}
      className={`block relative mt-8 pt-1 group w-full max-w-[310px] sm:max-w-[340px] mx-auto outline-none overflow-visible ${
        isParent ? "h-[370px]" : "h-[310px]"
      }`}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
      {content}
    </a>
  );
}
