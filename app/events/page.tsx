"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { exclusiveEvents, seasonalEvents, flagshipEvents } from "@/data/events";
import EventCard from "@/components/Events/EventCard";
import Footer from "@/components/Footer";

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-12">
          {exclusiveEvents.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-white/10 py-20"
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-12">
        {seasonalEvents.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>
    ),

    flagship: (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-12">
        {flagshipEvents.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-black">
     {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div ref={headerRef} className="text-center pb-12 pt-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl font-jetbrains-mono font-semibold uppercase tracking-tight text-white sm:text-5xl md:text-6xl cursor-default"
        >
          Eve<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-300">nts</span>
        </motion.h1>
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
