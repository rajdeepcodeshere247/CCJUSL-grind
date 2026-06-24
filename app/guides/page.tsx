"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { interviewGuides } from "@/data/guides";
import {
  Search,
  FileText,
  Briefcase,
  X,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import Footer from "@/components/Footer";
import { FEATURES } from "@/config/features";
import NotFound from "@/components/NotFound";
import DecryptText from "@/components/ui/DecryptText";
import ShinyText from "@/components/ui/ShinyText";
import Magnet from "@/components/ui/Magnet";
import FolderCard from "@/components/ui/FolderCard";

// Brand-specific metadata for dynamic, premium styling
const companyMetadata: Record<string, {
  color: string;
  bgGlow: string;
  gradientLine: string;
  buttonClass: string;
  initial: string;
}> = {
  "Google": {
    color: "text-blue-400",
    bgGlow: "rgba(96, 165, 250, 0.12)",
    gradientLine: "from-blue-400/50 via-blue-500/50 to-transparent",
    buttonClass: "border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/10",
    initial: "G"
  },
  "D.E. Shaw": {
    color: "text-rose-500",
    bgGlow: "rgba(244, 63, 94, 0.12)",
    gradientLine: "from-rose-400/50 via-rose-500/50 to-transparent",
    buttonClass: "border-rose-500/30 hover:border-rose-400 hover:bg-rose-500/10",
    initial: "D"
  },
  "JPMC": {
    color: "text-amber-400",
    bgGlow: "rgba(251, 191, 36, 0.12)",
    gradientLine: "from-amber-400/50 via-amber-500/50 to-transparent",
    buttonClass: "border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10",
    initial: "J"
  },
  "Salesforce": {
    color: "text-cyan-400",
    bgGlow: "rgba(34, 211, 238, 0.15)",
    gradientLine: "from-cyan-400/50 via-cyan-500/50 to-transparent",
    buttonClass: "border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10",
    initial: "S"
  },
  "Sprinklr": {
    color: "text-orange-500",
    bgGlow: "rgba(249, 115, 22, 0.12)",
    gradientLine: "from-orange-400/50 via-orange-500/50 to-transparent",
    buttonClass: "border-orange-500/30 hover:border-orange-400 hover:bg-orange-500/10",
    initial: "S"
  },
  "Visa": {
    color: "text-indigo-400",
    bgGlow: "rgba(129, 140, 248, 0.12)",
    gradientLine: "from-indigo-400/50 via-indigo-500/50 to-transparent",
    buttonClass: "border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-500/10",
    initial: "V"
  },
  "Wells Fargo": {
    color: "text-emerald-400",
    bgGlow: "rgba(52, 211, 153, 0.12)",
    gradientLine: "from-emerald-400/50 via-emerald-500/50 to-transparent",
    buttonClass: "border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10",
    initial: "W"
  }
};

const defaultMeta = {
  color: "text-rose-500",
  bgGlow: "rgba(244, 63, 94, 0.12)",
  gradientLine: "from-rose-400/50 via-rose-500/50 to-transparent",
  buttonClass: "border-rose-500/30 hover:border-rose-400 hover:bg-rose-500/10",
  initial: "C"
};

// Animation Variants for Split/Division effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
} as const;

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.35,
    y: 70,
    rotate: -12,
    rotateX: 18,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 13,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 30,
    rotate: 5,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
} as const;

const batchContainerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
} as const;

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [splittingBatch, setSplittingBatch] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const handleBatchClick = (batchName: string) => {
    setSplittingBatch(batchName);
    setSelectedBatch(batchName);
    setTimeout(() => {
      setSplittingBatch(null);
    }, 600);
  };

  // Group all guides dynamically by batch
  const batches = useMemo(() => {
    const batchMap = new Map<string, {
      year: number;
      name: string;
      guides: typeof interviewGuides;
      companiesCount: number;
      contributors: string[];
    }>();

    interviewGuides.forEach((guide) => {
      const year = guide.yearOfGrad;
      const batchName = `${year % 100} Batch Interview Experiences`;
      const name = guide.candidateName;

      let b = batchMap.get(batchName);
      if (!b) {
        b = {
          year,
          name: batchName,
          guides: [],
          companiesCount: 0,
          contributors: []
        };
        batchMap.set(batchName, b);
      }
      b.guides.push(guide);
      if (!b.contributors.includes(name)) {
        b.contributors.push(name);
      }
    });

    return Array.from(batchMap.values()).map((b) => {
      const uniqueCompanies = new Set(b.guides.map((g) => g.company));
      return {
        ...b,
        companiesCount: uniqueCompanies.size,
      };
    });
  }, []);

  const selectedBatchData = useMemo(() => {
    if (!selectedBatch) return null;
    return batches.find((b) => b.name === selectedBatch) || null;
  }, [batches, selectedBatch]);

  const companyGuidesForSelectedBatch = useMemo(() => {
    if (!selectedBatchData) return [];
    const map = new Map<string, { pdfPath: string; count: number; contributors: string[] }>();
    selectedBatchData.guides.forEach((guide) => {
      const existing = map.get(guide.company);
      const name = guide.candidateName;
      if (existing) {
        existing.count += 1;
        if (!existing.contributors.includes(name)) existing.contributors.push(name);
      } else {
        map.set(guide.company, { pdfPath: guide.pdfPath, count: 1, contributors: [name] });
      }
    });
    return Array.from(map.entries()).map(([company, data]) => ({ company, ...data }));
  }, [selectedBatchData]);

  // List of all company guides across all batches for direct search
  const allCompanyGuides = useMemo(() => {
    const map = new Map<string, { pdfPath: string; count: number; contributors: string[]; batchName: string }>();
    interviewGuides.forEach((guide) => {
      const key = `${guide.company} (${guide.yearOfGrad % 100} Batch)`;
      const name = guide.candidateName;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.contributors.includes(name)) existing.contributors.push(name);
      } else {
        map.set(key, { 
          pdfPath: guide.pdfPath, 
          count: 1, 
          contributors: [name], 
          batchName: `${guide.yearOfGrad % 100} Batch` 
        });
      }
    });
    return Array.from(map.entries()).map(([key, data]) => {
      const company = key.substring(0, key.indexOf(" ("));
      return { key, company, ...data };
    });
  }, []);

  const filteredCompanyGuides = useMemo(() => {
    if (!searchQuery) return [];
    return allCompanyGuides.filter((guide) =>
      guide.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCompanyGuides, searchQuery]);

  if (!FEATURES.enableGuides) return <NotFound />;

  // Default meta for batch cards
  const batchMeta = {
    color: "text-rose-500",
    bgGlow: "rgba(244, 63, 94, 0.12)",
    gradientLine: "from-rose-400/50 via-rose-500/50 to-transparent",
    buttonClass: "border-rose-500/30 hover:border-rose-400 hover:bg-rose-500/10",
    initial: "27",
  };

  return (
    <div className="min-h-screen bg-black text-[#ededed] font-jetbrains-mono selection:bg-rose-500/30 selection:text-rose-200 relative overflow-hidden">
      {/* Premium Dot Pattern Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-full h-[550px] opacity-35 z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 0%, #000 70%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 0%, #000 70%, transparent 100%)",
        }}
      />
      {/* Dual Gradient Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[380px] w-full max-w-7xl bg-gradient-to-b from-rose-500/10 via-rose-500/5 to-transparent blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 mx-auto w-11/12 max-w-7xl pt-12 pb-24">
        
        {/* Header Section */}
        <div ref={headerRef} className="text-center pb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.015 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] mb-6 backdrop-blur-md cursor-default transition-all duration-300"
          >
            <Briefcase size={13} className="text-rose-500" />
            <ShinyText text="Ace Your Placement & Internships" className="text-[10px] font-mono font-medium uppercase tracking-[0.15em] text-white/80" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-4xl font-semibold uppercase tracking-tight text-white sm:text-5xl md:text-6xl cursor-default"
          >
            <DecryptText text="Interview" animateOnHover speed={40} />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-300">
              <DecryptText text="Guides" animateOnHover speed={40} delay={150} />
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/50"
          >
            Download official, compiled company interview guides. Read about preparation strategies, online assessment questions, and technical/HR round experiences shared by students.
          </motion.div>
        </div>

        {/* Filters & Search Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-white/10 mb-10 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <h2 className="text-xs font-mono font-semibold uppercase tracking-[0.15em] text-neutral-300">
              {selectedBatch && !searchQuery ? (
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setSelectedBatch(null)} 
                    className="hover:text-white text-neutral-400 transition-colors flex items-center gap-1 font-semibold"
                  >
                    Guides
                  </button>
                  <ChevronRight size={10} className="text-neutral-500" />
                  <span className="text-white">{selectedBatch}</span>
                </div>
              ) : searchQuery ? (
                "Search Results"
              ) : (
                "Prepare with Precision"
              )}
            </h2>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {selectedBatch && !searchQuery && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedBatch(null)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono hover:bg-white/[0.06] hover:text-white transition-all text-neutral-400"
              >
                <ArrowLeft size={13} />
                Back to Batches
              </motion.button>
            )}

            <div className="relative w-full sm:w-80 group">
              {/* Outer shadow glow layer on focus */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-rose-500 to-white opacity-0 group-hover:opacity-20 group-focus-within:opacity-100 blur-[2px] transition duration-500 pointer-events-none" />
              
              <div className="relative w-full flex items-center bg-[#070707] border border-white/10 rounded-xl overflow-hidden focus-within:border-transparent transition-all duration-300">
                <Search className="absolute left-4 text-white/30 group-focus-within:text-white transition-colors duration-300" size={15} />
                <input
                  type="text"
                  placeholder="Search company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 text-xs font-mono bg-transparent text-white placeholder-white/30 outline-none"
                />
                {searchQuery && (
                  <Magnet className="absolute right-3 flex items-center justify-center" magnetStrength={0.25}>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-white/30 hover:text-white transition-colors cursor-pointer p-1"
                    >
                      <X size={13} />
                    </button>
                  </Magnet>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Guides Grid / Batch View with Split Animation */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {searchQuery ? (
              // Search view: bypass hierarchy
              <motion.div
                key="search-view"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid gap-6 gap-y-16 lg:gap-y-20 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredCompanyGuides.length > 0 ? (
                  filteredCompanyGuides.map((guide) => {
                    const meta = companyMetadata[guide.company] || defaultMeta;
                    return (
                      <motion.div
                        key={guide.key}
                        variants={itemVariants}
                        className="z-10"
                      >
                        <FolderCard
                          company={guide.company}
                          count={guide.count}
                          contributors={guide.contributors}
                          pdfPath={guide.pdfPath}
                          meta={meta}
                          badgeText={`${guide.count} ${guide.count === 1 ? "Exp" : "Exps"} (${guide.batchName})`}
                          isParent={false}
                        />
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]"
                  >
                    <FileText size={48} className="mx-auto text-white/10 mb-4" />
                    <h3 className="text-lg font-semibold tracking-wide text-white/80">No Guides Found</h3>
                    <p className="text-sm text-white/40 mt-1 font-light">Try searching for a different company name.</p>
                  </motion.div>
                )}
              </motion.div>
            ) : selectedBatch ? (
              // Batch specific view: company folders
              <motion.div
                key={`batch-companies-${selectedBatch}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid gap-6 gap-y-16 lg:gap-y-20 sm:grid-cols-2 lg:grid-cols-3"
              >
                {companyGuidesForSelectedBatch.map((guide) => {
                  const meta = companyMetadata[guide.company] || defaultMeta;
                  return (
                    <motion.div
                      key={guide.company}
                      variants={itemVariants}
                      className="z-10"
                    >
                      <FolderCard
                        company={guide.company}
                        count={guide.count}
                        contributors={guide.contributors}
                        pdfPath={guide.pdfPath}
                        meta={meta}
                        isParent={false}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              // Root view: Batch Folders
              <motion.div
                key="batch-list"
                variants={batchContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex justify-center"
              >
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full justify-center">
                  {batches.map((batch) => {
                    const customMeta = {
                      ...batchMeta,
                      initial: String(batch.year % 100),
                    };

                    const isThisSplitting = splittingBatch === batch.name;
                    const isAnySplitting = splittingBatch !== null;

                    return (
                      <motion.div
                        key={batch.name}
                        className="z-10"
                        animate={{
                          opacity: isAnySplitting && !isThisSplitting ? 0 : 1,
                          scale: isAnySplitting && !isThisSplitting ? 0.92 : 1,
                        }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <FolderCard
                          company={batch.name}
                          count={batch.companiesCount}
                          contributors={batch.contributors}
                          meta={customMeta}
                          onClick={() => handleBatchClick(batch.name)}
                          buttonText="Open Batch Folder"
                          customDescription={`Explore the detailed, compiled company-wise interview experiences shared by students of the graduating batch of ${batch.year}.`}
                          badgeText={`${batch.companiesCount} ${batch.companiesCount === 1 ? "Company" : "Companies"}`}
                          isParent={true}
                          isSplitting={isThisSplitting}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fixed Splitting Overlay Card (3D Division Animation) */}
          {splittingBatch && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[999] overflow-hidden bg-black/10 backdrop-blur-[1px]">
              <div className="w-[340px] h-[370px] relative">
                <FolderCard
                  company={splittingBatch}
                  count={batches.find(b => b.name === splittingBatch)?.companiesCount || 0}
                  contributors={[]}
                  meta={{
                    color: "text-rose-500",
                    bgGlow: "rgba(244, 63, 94, 0.12)",
                    gradientLine: "from-rose-400/50 via-rose-500/50 to-transparent",
                    buttonClass: "border-rose-500/30 hover:border-rose-400 hover:bg-rose-500/10",
                    initial: batches.find(b => b.name === splittingBatch) ? String(batches.find(b => b.name === splittingBatch)!.year % 100) : "27",
                  }}
                  isParent={true}
                  isSplitting={true}
                />
              </div>
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
}
