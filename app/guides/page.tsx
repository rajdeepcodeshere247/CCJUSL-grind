"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { interviewGuides } from "@/data/guides";
import { 
  Search, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  CheckCircle, 
  X, 
  BookOpen, 
  ChevronRight,
  Download,
  Building
} from "lucide-react";
import Footer from "@/components/Footer";
import type { InterviewGuide } from "@/types";

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Check if heading
        const isHeading = 
          trimmed.endsWith(":") || 
          /^(Technical Round|Online Assessment|HR Round|Round \d|Section \d|S\d:|Q\d\)|OA)/i.test(trimmed);

        // Check list items
        const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*");
        const isNumbered = /^\d+(\.|\s)/.test(trimmed) || /^(Q\d\)|S\d:)/i.test(trimmed);

        let content = trimmed;
        if (isBullet) {
          content = trimmed.replace(/^[•\-\*]\s*/, "");
        }

        const renderFormattedLine = (str: string) => {
          let labelText = "";
          let restText = str;
          
          const labelMatch = str.match(/^([^:\–\—]+)([:\–\—])(.*)$/);
          if (labelMatch && !isHeading && labelMatch[1].trim().length < 25) {
            labelText = labelMatch[1].trim() + labelMatch[2];
            restText = labelMatch[3];
          }

          const formatText = (textVal: string) => {
            const parts = textVal.split(/\*\*([^*]+)\*\*/g);
            return parts.map((part, i) => {
              if (i % 2 === 1) {
                return <strong key={i} className="text-white font-bold">{part}</strong>;
              }
              const subparts = part.split(/\*([^*]+)\*/g);
              return subparts.map((subpart, j) => {
                if (j % 2 === 1) {
                  return <em key={j} className="text-white/90 italic">{subpart}</em>;
                }
                return subpart;
              });
            });
          };

          if (labelText) {
            return (
              <span>
                <strong className="text-red-400 font-semibold">{labelText} </strong>
                {formatText(restText)}
              </span>
            );
          }
          return <span>{formatText(str)}</span>;
        };

        if (isHeading) {
          return (
            <h5 
              key={idx} 
              className="text-white font-bold text-sm tracking-wide mt-4 border-b border-white/5 pb-1 uppercase text-red-400"
            >
              <u>{content}</u>
            </h5>
          );
        }

        if (isBullet) {
          return (
            <div key={idx} className="flex gap-2 pl-4 text-sm leading-relaxed text-white/70">
              <span className="text-red-500 font-bold">•</span>
              <span className="flex-1">{renderFormattedLine(content)}</span>
            </div>
          );
        }

        if (isNumbered) {
          const numberPart = trimmed.split(/[.\s]/)[0];
          const restText = trimmed.substring(trimmed.indexOf(numberPart) + numberPart.length).trim();
          return (
            <div key={idx} className="flex gap-2 pl-2 text-sm leading-relaxed text-white/70">
              <span className="text-red-400 font-semibold">{numberPart}</span>
              <span className="flex-1">{renderFormattedLine(restText)}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-sm leading-relaxed text-white/70">
            {renderFormattedLine(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedGuide, setSelectedGuide] = useState<InterviewGuide | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  // Get unique companies list
  const companies = useMemo(() => {
    const set = new Set(interviewGuides.map((g) => g.company));
    return ["All", ...Array.from(set)];
  }, []);

  // Filter guides
  const filteredGuides = useMemo(() => {
    return interviewGuides.filter((guide) => {
      const matchesSearch = 
        guide.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.experience.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (guide.prepTips && guide.prepTips.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCompany = selectedCompany === "All" || guide.company === selectedCompany;
      const matchesDept = selectedDept === "All" || guide.department === selectedDept;

      return matchesSearch && matchesCompany && matchesDept;
    });
  }, [searchQuery, selectedCompany, selectedDept]);


  return (
    <div className="min-h-screen bg-black text-white font-jetbrains-mono selection:bg-red-500/30 selection:text-red-200">
      {/* Background Subtle Mesh / Grid */}
      <div 
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(237,27,88,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(237,27,88,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-red-950/10 blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto w-11/12 max-w-7xl pt-12 pb-24">
        
        {/* Header Section */}
        <div ref={headerRef} className="text-center pb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/35 bg-red-950/20 mb-6 shadow-[0_2px_15px_rgba(237,27,88,0.15)] hover:border-red-500/60 hover:bg-red-950/30 transition-all duration-300 select-none cursor-default"
          >
            <Briefcase size={14} className="text-red-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-red-200">Ace Your Placement & Internships</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-4xl font-semibold uppercase tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-orange-400">Guides</span>
          </motion.h1>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHeaderInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 h-[2px] w-24 origin-center bg-red-400"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/50 sm:text-base"
          >
            Real interview experiences, prep recommendations, and advice shared by Jadavpur University Information Technology 
            and Computer Science & Engineering students who successfully cracked major tech companies.
          </motion.p>
        </div>

        {/* Stats Grid */}
        {/* Purpose Taglines Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12 border border-white/5 bg-white/[0.02] p-6 rounded-2xl backdrop-blur-md"
        >
          <div className="flex flex-col p-4 border-b md:border-b-0 md:border-r border-white/5 last:border-0">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400 mb-2">Simplify Placements</h3>
            <p className="text-xs leading-relaxed text-white/60">
              Demystifying the tech recruitment timeline and rounds to make the overall internship and placement hiring process easier for you to navigate.
            </p>
          </div>
          <div className="flex flex-col p-4 border-b md:border-b-0 md:border-r border-white/5 last:border-0">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-2">Study Real Patterns</h3>
            <p className="text-xs leading-relaxed text-white/60">
              Equip yourself by studying exact interview experiences, coding problems, puzzles, and core questions asked of your seniors.
            </p>
          </div>
          <div className="flex flex-col p-4 last:border-0">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400 mb-2">By Students, For Students</h3>
            <p className="text-xs leading-relaxed text-white/60">
              The true core purpose of CodeClub JUSL is to help, share, and support our student community in cracking their dream roles.
            </p>
          </div>
        </motion.div>

        {/* Filters Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between pb-8 border-b border-white/10 mb-10">
          
          {/* Company Chips Filter */}
          <div className="flex flex-nowrap items-center gap-2 max-w-full overflow-x-auto py-1.5 scrollbar-thin select-none pr-4">
            {companies.map((company) => (
              <button
                key={company}
                suppressHydrationWarning={true}
                onClick={() => setSelectedCompany(company)}
                className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider border transition-all duration-300 font-semibold ${
                  selectedCompany === company
                    ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20"
                    : "bg-white/[0.03] border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                {company}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type="text"
                suppressHydrationWarning={true}
                placeholder="Search name, key topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-red-500/60 focus:bg-white/[0.05] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  suppressHydrationWarning={true}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Department Dropdown */}
            <select
              value={selectedDept}
              suppressHydrationWarning={true}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-black border border-white/10 rounded-lg text-white/80 focus:outline-none focus:border-red-500/60 cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Computer Science & Engineering">Computer Science & Eng.</option>
            </select>
          </div>

        </div>

        {/* Guides Grid */}
        <AnimatePresence mode="popLayout">
          {filteredGuides.length > 0 ? (
            <motion.div 
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredGuides.map((guide, idx) => (
                <motion.div
                  layout
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                  onClick={() => setSelectedGuide(guide)}
                  className="group relative cursor-pointer border border-white/5 hover:border-red-500/30 bg-white/[0.01] hover:bg-white/[0.03] p-6 rounded-xl hover:shadow-[0_12px_24px_rgba(237,27,88,0.05)] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Glowing tag border effect on hover */}
                  <div className="absolute top-0 left-0 w-[2px] h-0 bg-red-500 group-hover:h-full transition-all duration-300 rounded-l-xl" />
                  
                  <div>
                    {/* Header elements */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] border border-white/5 text-[10px] font-bold uppercase tracking-wider text-white/60">
                        <Building size={10} className="text-red-400" />
                        {guide.company}
                      </span>
                      
                      {guide.selected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-950/20 px-2 py-0.5 rounded border border-green-500/20">
                          <CheckCircle size={10} />
                          Selected
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
                      {guide.candidateName}
                    </h3>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <GraduationCap size={12} />
                        {guide.department === "Computer Science & Engineering" ? "CSE" : "IT"}
                      </span>
                      <span>•</span>
                      <span>Class of {guide.yearOfGrad}</span>
                    </div>

                    {/* Preview Snippet */}
                    <p className="text-xs text-white/40 leading-relaxed mt-4 line-clamp-3">
                      {guide.experience}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 text-[11px] text-white/50 group-hover:text-white transition-colors">
                    <span className="flex items-center gap-1 font-semibold text-red-400/90 group-hover:text-red-400">
                      Read Experience <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <a
                      href={guide.pdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                      title="Open Original PDF"
                    >
                      <Download size={14} />
                    </a>
                  </div>

                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center border border-dashed border-white/10 rounded-2xl"
            >
              <FileText size={48} className="mx-auto text-white/20 mb-4" />
              <h3 className="text-lg font-semibold">No Guides Found</h3>
              <p className="text-sm text-white/40 mt-1">Try tweaking your filters or search keywords.</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedGuide(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col justify-between scrollbar-thin shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedGuide(null)}
                className="absolute right-4 top-4 p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {/* Modal Content */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/5 text-xs font-bold uppercase tracking-wider text-white">
                    <Building size={12} className="text-red-400" />
                    {selectedGuide.company}
                  </span>
                  
                  {selectedGuide.selected && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-green-400 bg-green-950/20 px-2.5 py-0.5 rounded border border-green-500/20">
                      <CheckCircle size={11} />
                      Selected
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-white mb-2">
                  {selectedGuide.candidateName}
                </h2>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60 mb-8 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap size={16} className="text-red-400/80" />
                    <span>Department of {selectedGuide.department}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={16} className="text-red-400/80" />
                    <span>Class of {selectedGuide.yearOfGrad}</span>
                  </div>
                </div>

                {/* Grid for details */}
                <div className="space-y-6 text-sm md:text-base leading-relaxed text-white/80">
                  
                  {/* Experience Section */}
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-red-400 font-bold mb-3 flex items-center gap-2">
                      <Briefcase size={14} />
                      Interview Experience
                    </h4>
                    <div className="bg-white/[0.01] border border-white/5 p-5 rounded-xl text-white/70 text-sm leading-relaxed">
                      <FormattedText text={selectedGuide.experience} />
                    </div>
                  </div>

                  {/* Preparation Tips Section */}
                  {selectedGuide.prepTips && (
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-red-400 font-bold mb-3 flex items-center gap-2">
                        <CheckCircle size={14} />
                        Preparation Tips
                      </h4>
                    <div className="bg-white/[0.01] border border-white/5 p-5 rounded-xl text-white/70 text-sm leading-relaxed">
                      <FormattedText text={selectedGuide.prepTips} />
                    </div>
                    </div>
                  )}

                  {/* Additional Notes Section */}
                  {selectedGuide.additionalNotes && (
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-red-400 font-bold mb-3 flex items-center gap-2">
                        <FileText size={14} />
                        Additional Notes
                      </h4>
                    <div className="bg-white/[0.01] border border-white/5 p-5 rounded-xl text-white/70 text-sm leading-relaxed">
                      <FormattedText text={selectedGuide.additionalNotes} />
                    </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between mt-8 pt-6 border-t border-white/5">
                <span className="text-xs text-white/40">
                  Source Document: {selectedGuide.pdfPath.split('/').pop()}
                </span>
                
                <a
                  href={selectedGuide.pdfPath}
                  download={selectedGuide.pdfPath.split('/').pop()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-red-500/40 hover:border-red-500 bg-red-500/10 hover:bg-red-500 text-sm font-semibold uppercase tracking-wider text-white transition-all shadow-lg hover:shadow-red-500/15"
                >
                  <Download size={14} />
                  Download Original PDF
                </a>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
