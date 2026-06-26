"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { AlumniMember } from "@/types";

interface AlumniCardProps {
  alumni: AlumniMember;
  index: number;
  onClick: () => void;
}

function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      width="16"
      height="16"
    >
      <path d="M23.36 10.56a1.18 1.18 0 0 0-.25-.83 1.54 1.54 0 0 1-.32-1.39l.22-1.07a1.18 1.18 0 0 0-.75-1.36l-1-.38a1.54 1.54 0 0 1-1-1.07l-.37-1a1.18 1.18 0 0 0-1.5-.77l-1.07.22a1.54 1.54 0 0 1-1.39-.32 1.18 1.18 0 0 0-.83-.25l-1.08.06a1.56 1.56 0 0 1-1.42-.87l-.46-1a1.19 1.19 0 0 0-1.07-.64h-.1a1.19 1.19 0 0 0-1.07.64l-.46 1a1.56 1.56 0 0 1-1.42.87l-1.08-.06a1.18 1.18 0 0 0-.83-.25 1.54 1.54 0 0 1-1.39.32L3.85 2.7a1.18 1.18 0 0 0-1.39.77l-.37 1a1.54 1.54 0 0 1-1 1.07l-1 .38a1.18 1.18 0 0 0-.75 1.36l.22 1.07a1.54 1.54 0 0 1-.32 1.39 1.18 1.18 0 0 0-.25.83v.1a1.18 1.18 0 0 0 .25.83 1.54 1.54 0 0 1 .32 1.39l-.22 1.07a1.18 1.18 0 0 0 .75 1.36l1 .38a1.54 1.54 0 0 1 1 1.07l.37 1a1.18 1.18 0 0 0 1.39.77l1.07-.22a1.54 1.54 0 0 1 1.39.32 1.18 1.18 0 0 0 .83.25l1.08-.06a1.56 1.56 0 0 1 1.42.87l-.46-1a1.19 1.19 0 0 0-1.07-.64h-.1a1.19 1.19 0 0 0-1.07-.64l-.46-1a1.56 1.56 0 0 1 1.42-.87l-1.08-.06a1.18 1.18 0 0 0-.83-.25 1.54 1.54 0 0 1 1.39-.32l1.07.22a1.18 1.18 0 0 0 1.39-.77l.37-1a1.54 1.54 0 0 1 1-1.07l1-.38a1.18 1.18 0 0 0 .75-1.36l-.22-1.07a1.54 1.54 0 0 1 .32-1.39 1.18 1.18 0 0 0 .25-.83zM10.15 16.4L6 12.2l1.4-1.41 2.74 2.76 6.45-6.52L18 8.44z" />
    </svg>
  );
}

export default function AlumniCard({
  alumni,
  index,
  onClick,
}: AlumniCardProps) {
  const getTagline = (bio?: string) => {
    if (!bio) return `${alumni.role} @ ${alumni.company}`;
    const firstSentence = bio.split(/[.!?]/)[0];
    return firstSentence ? firstSentence.trim() + "." : bio;
  };
  const tagline = getTagline(alumni.bio);

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const followUrl =
      alumni.socials.linkedin || alumni.socials.github || alumni.socials.twitter;
    if (followUrl) {
      window.open(followUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="w-full [perspective:1200px]">
      <style>{`
        @keyframes borderGlowMove {
          0% { transform: translate(-50%, -50%); }
          25% { transform: translate(0%, -50%); }
          50% { transform: translate(0%, 0%); }
          75% { transform: translate(-50%, 0%); }
          100% { transform: translate(-50%, -50%); }
        }
        .animate-border-glow-move {
          animation: borderGlowMove 4s linear infinite;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        className="group relative flex flex-col justify-end w-full aspect-[3/4.2] rounded-[2.5rem] bg-[#141415] border border-white/[0.05] p-4 sm:p-5 transition-all duration-600 ease-in-out shadow-[rgba(30,30,60,0)_40px_50px_25px_-40px,rgba(30,30,60,0.2)_0px_25px_25px_-5px] hover:shadow-[rgba(30,30,60,0.3)_30px_50px_25px_-40px,rgba(30,30,60,0.15)_0px_25px_30px_0px] cursor-pointer [transform-style:preserve-3d] hover:[transform:rotate3d(1,-1,0,25deg)] hover:border-transparent"
      >
        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden z-0 pointer-events-none">
          <div
            className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] animate-border-glow-move opacity-0 group-hover:opacity-100 transition-opacity duration-600"
            style={{
              background: "radial-gradient(circle, #f43f5e 0%, transparent 60%)",
            }}
          />
          <div className="absolute inset-[1.5px] rounded-[2.4rem] bg-[#141415] z-0" />
        </div>

        <div className="absolute top-4 left-4 right-4 bottom-[38%] overflow-hidden rounded-[1.75rem] transition-all duration-600 ease-in-out group-hover:inset-[1.5px] group-hover:rounded-[2.4rem] z-0">
          <Image
            src={alumni.photo}
            alt={alumni.name}
            fill
            className="object-cover transition-transform duration-600 ease-in-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={index < 4}
          />
          <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-[1]" />

          <div
            className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 backdrop-blur-[8px] transition-opacity duration-600 ease-in-out z-[2]"
            style={{
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0) 100%)",
              maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0) 100%)"
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col text-left transition-all duration-600 ease-in-out [transform:translate3d(0,0,31px)] [transform-style:preserve-3d]">
          <div className="flex items-center gap-1.5 [transform-style:preserve-3d]">
            <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] truncate">
              {alumni.name}
            </h3>
            <VerifiedBadge className="text-emerald-500 group-hover:text-white transition-colors duration-600 ease-in-out shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:[transform:translate3d(0,0,15px)]" />
          </div>

          <p className="text-zinc-400 text-[11px] sm:text-xs md:text-[13px] leading-relaxed mt-1 h-8 sm:h-9 line-clamp-2 transition-colors duration-600 ease-in-out group-hover:text-zinc-200">
            {tagline}
          </p>

          <div className="w-full h-[1px] bg-white/[0.05] group-hover:bg-white/10 transition-colors duration-600 ease-in-out my-2 sm:my-3" />

          <div className="flex items-center justify-between [transform-style:preserve-3d]">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 group-hover:text-zinc-300 transition-colors duration-600 ease-in-out font-mono font-medium truncate max-w-[55%]">
              Class of {alumni.graduationYear}
            </span>

            <button
              onClick={handleFollow}
              className="px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-full border border-white/5 bg-[#2a2a2b] text-white transition-all duration-600 ease-in-out group-hover:bg-white group-hover:text-black group-hover:border-white group-hover:shadow-lg group-hover:shadow-white/10 hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer group-hover:[transform:translate3d(0,0,60px)]"
            >
              Follow +
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
