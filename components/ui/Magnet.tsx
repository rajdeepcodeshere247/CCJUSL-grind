"use client";

import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagnetProps {
  children: React.ReactNode;
  className?: string;
  magnetStrength?: number; // scale multiplier of how close it moves
  active?: boolean;
}

export default function Magnet({
  children,
  className = "",
  magnetStrength = 0.3,
  active = true,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 12, stiffness: 130, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    if (!active) return;

    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = el.getBoundingClientRect();
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      const maxDistance = 75; // proximity trigger range (in px)
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < maxDistance) {
        x.set(distanceX * magnetStrength);
        y.set(distanceY * magnetStrength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [active, magnetStrength, x, y]);

  if (!active) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
