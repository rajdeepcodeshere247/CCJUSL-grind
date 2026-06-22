"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { galleryItems } from "@/data/gallery";
import Footer from "@/components/Footer";
import { GalleryItem } from "@/types";

// Dynamic Category Definitions
const galleryCategories = [
  { key: "all", label: "All" },
  { key: "workshops", label: "Workshops" },
  { key: "hackathons", label: "Hackathons" },
  { key: "competitions", label: "Competitions" },
  { key: "club-activities", label: "Club Activities" },
] as const;

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });

  // Reset pagination scale seamlessly whenever filter selection changes
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory]);

  // 1. Filter elements by chosen tab
  const filteredItems = galleryItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );
  
  // 2. Paginate dynamically using current limits
  const displayItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const openLightbox = useCallback((item: GalleryItem) => {
    setLightboxItem(item);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxItem(null);
  }, []);

  // Navigate between images in lightbox using filtered subset context
  const currentIndex = lightboxItem
    ? filteredItems.findIndex((i) => i.id === lightboxItem.id)
    : -1;

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentIndex > 0) setLightboxItem(filteredItems[currentIndex - 1]);
    },
    [currentIndex, filteredItems]
  );

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentIndex < filteredItems.length - 1)
        setLightboxItem(filteredItems[currentIndex + 1]);
    },
    [currentIndex, filteredItems]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && currentIndex > 0)
        setLightboxItem(filteredItems[currentIndex - 1]);
      if (e.key === "ArrowRight" && currentIndex < filteredItems.length - 1)
        setLightboxItem(filteredItems[currentIndex + 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxItem, currentIndex, filteredItems, closeLightbox]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxItem ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxItem]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Header */}
      <div ref={headerRef} className="pb-6 pt-12 sm:pb-8 sm:pt-16 lg:pt-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl font-black uppercase tracking-wider bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent sm:text-5xl md:text-6xl"
        >
          Gallery
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-4 h-1 w-20 origin-center rounded-full bg-gradient-to-r from-red-500 to-orange-500"
        />
        <p className="mt-4 text-neutral-400 max-w-md mx-auto text-xs sm:text-sm px-4">
          Glimpses of hackathons, coding showdowns, and technical milestones at CodeClub JUSL.
        </p>
      </div>

      <div className="mx-auto w-11/12 max-w-7xl">
        {/* Category Filters Tab Element */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-3xl mx-auto bg-neutral-900/50 backdrop-blur-md p-2 rounded-2xl border border-neutral-800/60">
          {galleryCategories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-300 uppercase ${
                activeCategory === category.key
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-orange-900/30 font-semibold"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Improved Masonry Grid Display Matrix */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`gallery-grid-${activeCategory}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance] w-full"
          >
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.02 }}
                className="mb-4 break-inside-avoid relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40 group hover:border-neutral-700/80 transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(item)}
              >
                {/* Image Container with Next.js Optimization mapping */}
                <div className="overflow-hidden bg-neutral-950 aspect-auto">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600}
                    height={400}
                    className="w-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Contextual Category Tag badge */}
                <span className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase text-orange-400 shadow-sm">
                  {item.category.replace("-", " ")}
                </span>

                {/* Elegant Smooth Overlay Slide & Reveal */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-xs font-semibold tracking-wide text-neutral-400 uppercase mb-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Expand Image
                  </p>
                  <p className="text-sm font-medium leading-snug text-white/95 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty Category State Safe-Guard */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-neutral-900/20 border border-dashed border-neutral-800 rounded-2xl my-6">
            <p className="text-neutral-500 text-sm">No items matching this filter option yet.</p>
          </div>
        )}

        {/* Load More Pagination Container */}
        {hasMore && (
          <div className="flex justify-center py-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="border border-neutral-800 bg-neutral-900/30 px-8 py-3 text-xs font-semibold tracking-widest uppercase text-neutral-300 rounded-xl transition-all duration-300 hover:border-neutral-600 hover:text-white hover:bg-neutral-800/40 shadow-sm"
            >
              Load More
            </button>
          </div>
        )}

        {!hasMore && displayItems.length > 0 && (
          <div className="flex items-center justify-center gap-4 py-12 text-[10px] tracking-widest text-neutral-700 font-bold">
            <div className="h-px w-12 bg-neutral-800" />
            <span>FIN</span>
            <div className="h-px w-12 bg-neutral-800" />
          </div>
        )}
      </div>

      {/* Lightbox Overlay Controller Module */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={closeLightbox}
          >
            {/* Close UI button */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/80 border border-neutral-800 text-white transition-colors hover:bg-neutral-800"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Prev navigation button */}
            {currentIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900/80 border border-neutral-800 text-white transition-colors hover:bg-neutral-800"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next navigation button */}
            {currentIndex < filteredItems.length - 1 && (
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900/80 border border-neutral-800 text-white transition-colors hover:bg-neutral-800"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Lightbox Focus Item Card Container */}
            <motion.div
              key={lightboxItem.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex max-h-[90vh] w-[90vw] max-w-5xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image viewport core */}
              <div className="relative flex-1 overflow-hidden bg-neutral-950 flex items-center justify-center">
                <Image
                  src={lightboxItem.src}
                  alt={lightboxItem.alt}
                  width={1200}
                  height={800}
                  className="max-h-[70vh] w-full object-contain"
                  priority
                />
              </div>

              {/* Data Text Meta Display Footer */}
              <div className="bg-neutral-900/90 border-t border-neutral-800/80 px-6 py-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-orange-400 tracking-wide uppercase mb-1 text-[10px]">
                  {lightboxItem.category.replace("-", " ")}
                </p>
                <p className="text-sm leading-relaxed text-neutral-200 font-medium">
                  {lightboxItem.caption}
                </p>
                <p className="mt-2 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                  Image {currentIndex + 1} of {filteredItems.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}