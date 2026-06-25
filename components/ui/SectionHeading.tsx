"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import DecryptText from "./DecryptText";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export default function SectionHeading({
  children,
  className = "",
  as: Tag = "h2",
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const textStr = typeof children === "string" ? children : "";
  const words = textStr.trim().split(/\s+/);
  const firstWord = words[0] || "";
  const restWords = words.slice(1).join(" ");

  return (
    <div ref={ref} className={`flex flex-col items-center gap-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Tag className="text-center text-3xl font-semibold uppercase tracking-tight xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl cursor-default">
          {firstWord && <DecryptText text={firstWord} animateOnHover speed={40} />}
          {" "}
          {restWords && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-300">
              <DecryptText text={restWords} animateOnHover speed={40} delay={150} />
            </span>
          )}
          {!textStr && children}
        </Tag>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="h-px w-24 origin-center bg-rose-500"
      />
    </div>
  );
}
