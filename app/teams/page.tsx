"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { teamCategories, teamMembers } from "@/data/teams";
import TeamCategorySelector from "@/components/Teams/TeamCategorySelector";
import TeamMemberCard from "@/components/Teams/TeamMemberCard";
import TeamMemberModal from "@/components/Teams/TeamMemberModal";
import Footer from "@/components/Footer";
import type { TeamMember } from "@/types";

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
      {/* Header */}
      <div ref={headerRef} className="text-center pb-12 pt-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl font-jetbrains-mono font-semibold uppercase tracking-tight text-white sm:text-5xl md:text-6xl cursor-default"
        >
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-300">Team</span>
        </motion.h1>
      </div>

      <div className="mx-auto w-11/12 max-w-7xl">
        {/* Category Selector */}
        <div className="mb-12">
          <TeamCategorySelector
            categories={teamCategories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* Category Label */}
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

        {/* Member Grid */}
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

      {/* Member Modal */}
      <TeamMemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      <Footer />
    </div>
  );
}
