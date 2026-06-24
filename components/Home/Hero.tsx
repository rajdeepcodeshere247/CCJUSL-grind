"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import MagicRings from "../MagicRings";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.5 }, // delay to let logo be appreciated
  },
  showImmediate: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function Hero() {
  const [introActive, setIntroActive] = useState(true); // Default to matching server-render splash
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [playedIntroThisMount, setPlayedIntroThisMount] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Scroll Tracking & Geometry
  const { scrollY } = useScroll();
  const [thresholds, setThresholds] = useState({ start: 0, end: 0 });
  const [coords, setCoords] = useState({ deltaX: 0, deltaY: 0, scale: 1 });

  useEffect(() => {
    setMounted(true);
    const played = sessionStorage.getItem("ccjusl_intro_played");
    if (played === "true") {
      setIntroActive(false);
      setHasCheckedSession(true);
      document.body.style.overflow = "unset";
    } else {
      setIntroActive(true);
      setHasCheckedSession(true);
      document.body.style.overflow = "hidden"; // Scroll-lock during splash Sequence

      const timerComplete = setTimeout(() => {
        setIntroActive(false);
        setPlayedIntroThisMount(true);
        sessionStorage.setItem("ccjusl_intro_played", "true");
        document.body.style.overflow = "unset"; // Restore scroll
      }, 2500); // 2.5 seconds appreciation splash

      return () => {
        clearTimeout(timerComplete);
        document.body.style.overflow = "unset";
      };
    }
  }, []);

  // Update layout coordinates dynamically on mount, resize, and after splash hides
  useEffect(() => {
    const updateGeometry = () => {
      // Calculate Scroll Thresholds
      const start = window.innerHeight * 0.3; // Begins at 30% viewport
      const end = window.innerHeight * 0.65;   // Settles by 65% viewport
      setThresholds({ start, end });

      // Calculate Bounding Coordinates
      const navbarPlaceholder = document.getElementById("navbar-logo-placeholder");
      if (!navbarPlaceholder) return;

      const rect = navbarPlaceholder.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Position in client coordinates of the target navbar logo
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      // Displacement deltas
      const deltaX = targetX - centerX;
      const deltaY = targetY - centerY;

      // Dynamic scaling according to active screen breakpoints
      const initialLogoWidth = window.innerWidth < 640 ? 192 : window.innerWidth < 768 ? 240 : window.innerWidth < 1024 ? 288 : 320;
      const targetScale = rect.width / initialLogoWidth;

      setCoords({ deltaX, deltaY, scale: targetScale });
    };

    updateGeometry();
    const timer = setTimeout(updateGeometry, 200); // Let Next.js hydration stabilize

    window.addEventListener("resize", updateGeometry);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateGeometry);
    };
  }, [introActive]);

  // Easing function for a fluid physically-connected migration
  const easeInOut = (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  // Mapped Transform Motion Values
  const logoX = useTransform(scrollY, (val) => {
    if (val < thresholds.start) return 0;
    if (val > thresholds.end) return coords.deltaX;
    const progress = (val - thresholds.start) / (thresholds.end - thresholds.start);
    return easeInOut(progress) * coords.deltaX;
  });

  const logoY = useTransform(scrollY, (val) => {
    if (val < thresholds.start) return 0;
    if (val > thresholds.end) return coords.deltaY;
    const progress = (val - thresholds.start) / (thresholds.end - thresholds.start);
    return easeInOut(progress) * coords.deltaY;
  });

  const logoScale = useTransform(scrollY, (val) => {
    if (val < thresholds.start) return 1;
    if (val > thresholds.end) return coords.scale;
    const progress = (val - thresholds.start) / (thresholds.end - thresholds.start);
    const easedProgress = easeInOut(progress);
    return 1 - easedProgress * (1 - coords.scale);
  });

  const rippleOpacity = useTransform(scrollY, [0, thresholds.start], [1, 0]);

  // Determine staggered reveal transition state
  let revealAnimate = "hidden";
  if (hasCheckedSession && !introActive) {
    revealAnimate = playedIntroThisMount ? "show" : "showImmediate";
  }

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-4">
      {/* Magic Rings background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!introActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <MagicRings
          color="#f87171"
          colorTwo="#ffffff"
          ringCount={6}
          speed={1}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst={false}
        />
      </motion.div>

      {/* Subtle grid backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!introActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(237,27,88,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(237,27,88,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* 2.5s Appreciation Splash Overlay (New Session Only) */}
      <AnimatePresence>
        {introActive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            {/* Subtle splash background grid */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(237,27,88,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(237,27,88,0.05) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            {/* Static Splash Logo with expanding ripples */}
            <motion.div
              layoutId="main-logo"
              className="relative flex flex-col items-center justify-center"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
              }
            >
              {/* Concentric rings scaling infinitely */}
              {!shouldReduceMotion && (
                <div className="absolute flex items-center justify-center pointer-events-none">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border border-[#ed1b58]/40"
                      style={{ width: 280, height: 280 }}
                      initial={{ scale: 0.3, opacity: 0.8 }}
                      animate={{ scale: 2.8, opacity: 0 }}
                      transition={{
                        duration: 2.6,
                        ease: "easeOut",
                        repeat: Infinity,
                        delay: i * 0.8,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Logo Centered Splash Image */}
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "drop-shadow(0 0 32px rgba(237, 27, 88, 0.55))",
                }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 1.4, ease: "easeOut", delay: 0.2 }
                }
                src="/images/Secondary-Main-Light.png"
                alt="CodeClub JUSL Logo"
                className="h-auto w-48 sm:w-60 md:w-72 lg:w-80 select-none"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Scroll-Driven Fixed Logo */}
      {!introActive && mounted && createPortal(
        <motion.div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            x: logoX,
            y: logoY,
            scale: logoScale,
            translateX: "-50%",
            translateY: "-50%",
            willChange: "transform",
          }}
          className="pointer-events-none z-[60] flex items-center justify-center"
        >
          {/* Fading Concentric rings as scroll starts */}
          {!shouldReduceMotion && (
            <motion.div
              style={{ opacity: rippleOpacity }}
              className="absolute flex items-center justify-center pointer-events-none"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-[#ed1b58]/40"
                  style={{ width: 280, height: 280 }}
                  initial={{ scale: 0.3, opacity: 0.8 }}
                  animate={{ scale: 2.8, opacity: 0 }}
                  transition={{
                    duration: 2.6,
                    ease: "easeOut",
                    repeat: Infinity,
                    delay: i * 0.8,
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Animating Logo Image */}
          <motion.img
            src="/images/Secondary-Main-Light.png"
            alt="CodeClub JUSL"
            className="h-auto w-48 sm:w-60 md:w-72 lg:w-80 select-none drop-shadow-[0_0_32px_rgba(237,27,88,0.55)]"
            draggable={false}
          />
        </motion.div>,
        document.body
      )}

      {/* Centered spacer to push Hero content below the centered logo */}
      <div className="h-[36vh] w-full shrink-0 pointer-events-none sm:h-[40vh]" />



      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!introActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: playedIntroThisMount ? 1.5 : 0.4, duration: 0.6 }}
        className="absolute bottom-4 flex flex-col items-center gap-1.5 md:bottom-8"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/20 sm:text-xs">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="h-4 w-px bg-white/20 sm:h-6"
        />
      </motion.div>
    </section>
  );
}

export default Hero;
