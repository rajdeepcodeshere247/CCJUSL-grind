"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { teamCategories, teamMembers } from "@/data/teams";
import TeamCategorySelector from "@/components/Teams/TeamCategorySelector";
import TeamMemberCard from "@/components/Teams/TeamMemberCard";
import TeamMemberModal from "@/components/Teams/TeamMemberModal";
import Footer from "@/components/Footer";
import type { TeamMember } from "@/types";
import DecryptText from "@/components/ui/DecryptText";
import ShinyText from "@/components/ui/ShinyText";
import { Users } from "lucide-react";

export default function TeamsPage() {
  const [activeCategory, setActiveCategory] = useState<string>(teamCategories[0].key);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });

  const filteredMembers = teamMembers.filter(
    (m) => m.team === activeCategory
  );

  return (
    <div className="min-h-screen bg-black">
      <div ref={headerRef} className="text-center pb-12 pt-10 sm:pt-12 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.015 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] mb-6 backdrop-blur-md cursor-default transition-all duration-300"
        >
          <Users size={13} className="text-rose-500" />
          <ShinyText text="The innovators & builders" className="text-[10px] font-mono font-medium uppercase tracking-[0.15em] text-white/80" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl font-semibold uppercase tracking-tight text-white sm:text-5xl md:text-6xl cursor-default"
        >
          <DecryptText text="Our" animateOnHover speed={40} />{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-300">
            <DecryptText text="Team" animateOnHover speed={40} delay={150} />
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/50"
        >
          Meet the talented minds running CodeClub JUSL and making a difference.
        </motion.div>
      </div>

      <div className="mx-auto w-11/12 max-w-7xl">
        <div className="mb-12">
          <TeamCategorySelector
            categories={teamCategories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.h2
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-8 text-center text-lg font-semibold uppercase tracking-wider text-red-400"
          >
            {teamCategories.find((c) => c.key === activeCategory)?.label}
          </motion.h2>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 sm:gap-6 pb-12 sm:pb-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredMembers.map((member, i) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                index={i}
                onClick={() => setSelectedMember(member)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <TeamMemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      <Footer />
    </div>
  );
}
