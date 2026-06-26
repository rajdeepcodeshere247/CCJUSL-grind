"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Linkedin, Github, Twitter, Trophy } from "lucide-react";
import type { TeamMember } from "@/types";

interface TeamMemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export default function TeamMemberModal({
  member,
  onClose,
}: TeamMemberModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (member) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [member, onClose]);

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 px-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/[0.08] bg-[#0c0c0e]/95 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col md:flex-row gap-6 md:gap-8 scrollbar-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 z-20 p-2 rounded-full border border-white/5 bg-zinc-900/60 text-zinc-400 transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="w-full md:w-[220px] shrink-0 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-full md:h-[220px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl mb-5">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 220px"
                  priority
                />
              </div>

              <span className="inline-flex px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
                {member.position}
              </span>

              <span className="text-xs font-mono text-zinc-500 tracking-wide">
                Class of {member.graduationYear}
              </span>
            </div>

            <div className="flex-1 flex flex-col text-left">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-4">
                {member.name}
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed mb-6">
                {member.bio}
              </p>

              {member.achievements && member.achievements.length > 0 && (
                <div className="w-full mb-6">
                  <h3 className="mb-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                    Achievements
                  </h3>
                  <div className="space-y-2.5">
                    {member.achievements.map((achievement, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors"
                      >
                        <Trophy size={15} className="text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                          {achievement}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2.5 mt-auto pt-5 border-t border-white/[0.05]">
                {member.socials.linkedin && (
                  <Link
                    href={member.socials.linkedin}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full border border-white/5 bg-[#18181b] text-zinc-300 transition-all hover:bg-white hover:text-black hover:border-white hover:shadow-lg active:scale-95"
                  >
                    <Linkedin size={14} /> LinkedIn
                  </Link>
                )}
                {member.socials.github && (
                  <Link
                    href={member.socials.github}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full border border-white/5 bg-[#18181b] text-zinc-300 transition-all hover:bg-white hover:text-black hover:border-white hover:shadow-lg active:scale-95"
                  >
                    <Github size={14} /> GitHub
                  </Link>
                )}
                {member.socials.twitter && (
                  <Link
                    href={member.socials.twitter}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full border border-white/5 bg-[#18181b] text-zinc-300 transition-all hover:bg-white hover:text-black hover:border-white hover:shadow-lg active:scale-95"
                  >
                    <Twitter size={14} /> Twitter
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
