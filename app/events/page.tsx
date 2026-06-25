"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { exclusiveEvents, seasonalEvents, flagshipEvents } from "@/data/events";
import EventCard from "@/components/Events/EventCard";
import EventCardTouch from "@/components/Events/EventCardTouch";
import Footer from "@/components/Footer";
import DecryptText from "@/components/ui/DecryptText";
import ShinyText from "@/components/ui/ShinyText";
import { Calendar } from "lucide-react";

const tabs = [
  { key: "exclusive", label: "Exclusive" },
  { key: "seasonal", label: "Seasonal" },
  { key: "flagship", label: "Flagship" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("flagship");
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });

  const tabContent: Record<TabKey, React.ReactNode> = {
    exclusive:
      exclusiveEvents.length > 0 ? (
        <div className="flex flex-wrap gap-8 items-center justify-center w-full">
          {exclusiveEvents.map((event) => (
            <React.Fragment key={event.id}>
              <EventCard event={event} />
              <EventCardTouch event={event} />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-white/10 py-20 w-full"
        >
          <p className="text-lg font-medium uppercase tracking-widest text-white/30">
            Coming Soon
          </p>
          <p className="max-w-md text-center text-sm text-white/20">
            Something exclusive is in the works. Stay tuned for announcements.
          </p>
        </motion.div>
      ),

    seasonal: (
      <div className="flex flex-wrap gap-8 items-center justify-center w-full">
        {seasonalEvents.map((event) => (
          <React.Fragment key={event.id}>
            <EventCard event={event} />
            <EventCardTouch event={event} />
          </React.Fragment>
        ))}
      </div>
    ),

    flagship: (
      <div className="flex flex-wrap gap-8 items-center justify-center w-full">
        {flagshipEvents.map((event) => (
          <React.Fragment key={event.id}>
            <EventCard event={event} />
            <EventCardTouch event={event} />
          </React.Fragment>
        ))}
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-black">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div ref={headerRef} className="text-center pb-12 pt-10 sm:pt-12 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.015 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] mb-6 backdrop-blur-md cursor-default transition-all duration-300"
        >
          <Calendar size={13} className="text-rose-500" />
          <ShinyText text="Relive the competition" className="text-[10px] font-mono font-medium uppercase tracking-[0.15em] text-white/80" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl font-semibold uppercase tracking-tight text-white sm:text-5xl md:text-6xl cursor-default"
        >
          <DecryptText text="Past" animateOnHover speed={40} />{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-300">
            <DecryptText text="Events" animateOnHover speed={40} delay={150} />
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/50"
        >
          Explore our history of flagships, hackathons, coding contests, and guest sessions.
        </motion.div>
      </div>

      <div className="mx-auto w-11/12 max-w-7xl pb-16 sm:pb-24">
        {/* ── Tabs ───────────────────────────────────────────────────────────── */}
        <div className="mb-12 flex justify-center gap-1 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm uppercase tracking-wider transition-colors duration-200 ${
                activeTab === tab.key
                  ? "text-red-400"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="events-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px bg-red-400"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Content ────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
