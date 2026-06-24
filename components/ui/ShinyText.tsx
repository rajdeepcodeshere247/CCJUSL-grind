"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number; // in seconds
  className?: string;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 6,
  className = "",
}: ShinyTextProps) {
  if (disabled) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-white/40 via-white to-white/40 bg-[length:200%_100%] animate-shine ${className}`}
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
}
