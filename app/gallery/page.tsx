"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { galleryItems } from "@/data/gallery";
import Footer from "@/components/Footer";
import { GalleryItem } from "@/types";

export default function GalleryPage() {
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });

  const filteredItems = galleryItems;
  const displayItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const openLightbox = useCallback((item: GalleryItem) => {
    setLightboxItem(item);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxItem(null);
  }, []);

  // Navigate between images in lightbox
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div ref={headerRef} className="pb-6 pt-10 sm:pb-8 sm:pt-12 lg:pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-4xl font-semibold uppercase tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Gallery
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-4 h-px w-24 origin-center bg-red-400"
        />
      </div>

      <div className="mx-auto w-11/12 max-w-7xl">
        {/* Masonry Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key="gallery-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
          >
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="mb-4 break-inside-avoid"
              >
                {/* Card with hover overlay */}
                <div
                  className="gallery-card relative w-full cursor-pointer overflow-hidden rounded-lg border border-white/10"
                  onClick={() => openLightbox(item)}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600}
                    height={400}
                    className="gallery-card-img w-full object-cover transition-transform duration-500"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Hover overlay */}
                  <div className="gallery-card-overlay absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 transition-opacity duration-300">
                    <div className="p-4">
                      <p className="text-sm font-medium leading-snug text-white/90">
                        {item.caption}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-red-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                        View
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center py-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="border border-white/20 px-8 py-3 text-sm uppercase tracking-wider text-white/60 transition-all duration-300 hover:border-white/50 hover:text-white"
            >
              Load More
            </button>
          </div>
        )}

        {!hasMore && displayItems.length > 0 && (
          <div className="flex items-center justify-center gap-4 py-12 text-xs tracking-widest text-white/20">
            <div className="h-px w-12 bg-white/10" />
            <span>END</span>
            <div className="h-px w-12 bg-white/10" />
          </div>
        )}
      </div>

      {/* Lightbox */}
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
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Prev button */}
            {currentIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Next button */}
            {currentIndex < filteredItems.length - 1 && (
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Image + Caption */}
            <motion.div
              key={lightboxItem.id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex max-h-[90vh] w-[90vw] max-w-5xl flex-col overflow-hidden rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative flex-1 overflow-hidden bg-black">
                <Image
                  src={lightboxItem.src}
                  alt={lightboxItem.alt}
                  width={1200}
                  height={800}
                  className="max-h-[75vh] w-full object-contain"
                  priority
                />
              </div>

              {/* Caption bar */}
              <div className="bg-[#111] px-6 py-4">
                <p className="text-sm leading-relaxed text-white/80">
                  {lightboxItem.caption}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/30">
                  {currentIndex + 1} / {filteredItems.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover CSS */}
      <style jsx global>{`
        .gallery-card:hover .gallery-card-overlay {
          opacity: 1;
        }
        .gallery-card:hover .gallery-card-img {
          transform: scale(1.05);
        }
      `}</style>

      <Footer />
    </div>
  );
}
