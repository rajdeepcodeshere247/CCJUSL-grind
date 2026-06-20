"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { galleryItems } from "@/data/gallery";
import LightboxModal from "@/components/Gallery/LightboxModal";
import Footer from "@/components/Footer";
import type { GalleryItem } from "@/types";

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });

  const filteredItems = galleryItems;

  const displayItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const openLightbox = (item: GalleryItem) => {
    const idx = filteredItems.findIndex((i) => i.id === item.id);
    setLightboxIndex(idx);
  };

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
                <button
                  onClick={() => openLightbox(item)}
                  className="relative block w-full overflow-hidden rounded-lg border border-white/10"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600}
                    height={400}
                    className="w-full object-cover"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </button>
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
      {lightboxIndex !== null && (
        <LightboxModal
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}

      <Footer />
    </div>
  );
}
