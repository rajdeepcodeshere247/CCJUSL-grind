"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { getAuthStatus } from "@/services/AuthService";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FEATURES } from "@/config/features";


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/teams", label: "Teams" },
  { href: "/alumni", label: "Alumni" },
  { href: "/guides", label: "Guides" },
];

function Navbar() {
  const path = usePathname();
  const [signedIn, setSignedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const visibleLinks = navLinks.filter(
    (link) => link.href !== "/guides" || FEATURES.enableGuides
  );


  useEffect(() => {
    setMounted(true);
    getAuthStatus().then((res) => {
      if (res) setSignedIn(true);
    });
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return path === "/";
    return path.startsWith(href);
  };

  // ─── Mobile overlay (portal) ─────────────────────────────────────────────
  // Rendered via createPortal at <body> level — outside the <header> — so that
  // no CSS filter/backdrop-filter on the header can create a containing block
  // that would incorrectly scope `position:fixed` to the header's bounds.
  const mobileOverlay = (
    <AnimatePresence>
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-black lg:hidden"
        >
          {/* Close button — top-right */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 p-2 text-white"
            aria-label="Close menu"
          >
            <motion.div
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          </button>

          {/* Subtle grid backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(237,27,88,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(237,27,88,0.03) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {visibleLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
            >
              <Link
                href={link.href}
                className={`text-2xl uppercase tracking-widest transition-colors ${
                  isActive(link.href)
                    ? "text-red-400"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * visibleLinks.length, duration: 0.3 }}
          >
            {signedIn ? (
              <Link
                href="/dashboard"
                className="border border-red-400/60 px-6 py-3 text-lg uppercase tracking-widest text-red-400"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/signin"
                className="border border-red-400/60 px-6 py-3 text-lg uppercase tracking-widest text-red-400"
              >
                Sign In
              </Link>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Fixed, always-black navbar — no scroll-dependent styling */}
      <header className="font-jetbrains-mono fixed top-0 left-0 right-0 z-50 w-full bg-black/50 backdrop-blur-md saturate-150 border-b border-white/10">
        <div className="mx-auto flex w-11/12 max-w-7xl items-center justify-between py-4 lg:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {path === "/" ? (
              // Layout-preserving placeholder on homepage.
              // The scroll-driven Hero logo docks on top of it.
              <div id="navbar-logo-placeholder" className="h-6 w-28 sm:h-8 lg:h-12 lg:w-40" />
            ) : (
              <motion.div
                layoutId="main-logo"
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
              >
                <Image
                  height={160}
                  width={160}
                  src="/images/Secondary-Main-Light.png"
                  alt="CCJUSL Logo"
                  className="h-auto w-28 lg:w-40"
                />
              </motion.div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-sm uppercase tracking-wider lg:flex xl:gap-10 xl:text-base">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-red-400"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-red-400"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            {signedIn ? (
              <Link
                href="/dashboard"
                className={`border border-red-400/60 px-4 py-2 text-sm uppercase tracking-wider transition-colors duration-200 hover:bg-red-400/10 ${
                  isActive("/dashboard") ? "bg-red-400/10 text-red-400" : "text-red-400"
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/signin"
                className={`border border-red-400/60 px-4 py-2 text-sm uppercase tracking-wider transition-colors duration-200 hover:bg-red-400/10 ${
                  isActive("/signin") ? "bg-red-400/10 text-red-400" : "text-red-400"
                }`}
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-white lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Spacer so content doesn't hide under the fixed navbar */}
      <div className="h-[57px] sm:h-[65px] lg:h-[81px]" aria-hidden />

      {/* Portal: overlay lives at <body> level, outside the <header> */}
      {mounted && createPortal(mobileOverlay, document.body)}
    </>
  );
}

export default Navbar;
