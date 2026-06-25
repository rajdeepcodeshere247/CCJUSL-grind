"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { alumniMembers } from "@/data/alumni";
import AlumniCard from "@/components/Alumni/AlumniCard";
import AlumniModal from "@/components/Alumni/AlumniModal";
import Footer from "@/components/Footer";
import type { AlumniMember } from "@/types";
import DecryptText from "@/components/ui/DecryptText";
import ShinyText from "@/components/ui/ShinyText";
import { GraduationCap } from "lucide-react";

export default function AlumniPage() {
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniMember | null>(
    null
  );
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div ref={headerRef} className="text-center pb-12 pt-10 sm:pt-12 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.015 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] mb-6 backdrop-blur-md cursor-default transition-all duration-300"
        >
          <GraduationCap size={13} className="text-rose-500" />
          <ShinyText text="The legacy continues" className="text-[10px] font-mono font-medium uppercase tracking-[0.15em] text-white/80" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl font-semibold uppercase tracking-tight text-white sm:text-5xl md:text-6xl cursor-default"
        >
          <DecryptText text="Our" animateOnHover speed={40} />{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-300">
            <DecryptText text="Alumni" animateOnHover speed={40} delay={150} />
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/50"
        >
          The talented individuals who built CodeClub JUSL and went on to make their mark in the tech industry. We&apos;re proud of where they are today.
        </motion.div>
      </div>

      <div className="mx-auto w-11/12 max-w-7xl">
        {/* Alumni Grid */}
        {alumniMembers.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 pb-12 sm:pb-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {alumniMembers.map((alumni, i) => (
              <AlumniCard
                key={alumni.id}
                alumni={alumni}
                index={i}
                onClick={() => setSelectedAlumni(alumni)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-white/50">None yet.</p>
          </div>
        )}
      </div>

      {/* Alumni Modal */}
      <AlumniModal
        alumni={selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
      />

      <Footer />
    </div>
  );
}
