"use client";

import React, { useEffect, useState, useRef } from "react";

interface DecryptTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  animateOnHover?: boolean;
}

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export default function DecryptText({
  text,
  speed = 30,
  delay = 0,
  className = "",
  animateOnHover = false,
}: DecryptTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [trigger, setTrigger] = useState(0);
  const isHovered = useRef(false);

  useEffect(() => {
    const startAnimation = () => {
      let iteration = 0;
      const originalText = text;
      
      const interval = setInterval(() => {
        setDisplayText(
          originalText
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return originalText[index];
              }
              if (char === " ") return " ";
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            })
            .join("")
        );

        if (iteration >= originalText.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3; // Speeds up the resolution rate
      }, speed);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(() => {
      const cleanUp = startAnimation();
      return () => {
        cleanUp();
      };
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [text, speed, delay, trigger]);

  const handleMouseEnter = () => {
    if (animateOnHover && !isHovered.current) {
      isHovered.current = true;
      setTrigger((prev) => prev + 1);
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {displayText || text}
    </span>
  );
}
