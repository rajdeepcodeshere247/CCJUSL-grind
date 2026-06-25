"use client";
import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { CLIP_PATH } from "./constants/events";

interface ShareButtonProps {
  eventSlug: string;
  eventTitle: string;
  isCard?: boolean;
}

export default function ShareButton({ eventSlug, eventTitle, isCard }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const buttonStyle = isCard ? { clipPath: CLIP_PATH } : {};

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/events/${eventSlug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: `Check out ${eventTitle} at Code Club JUSL!`,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      style={buttonStyle}
      className={`font-euclid text-xs uppercase font-bold flex items-center justify-center py-2.5 gap-2 rounded transition-all duration-200 w-full ${
        copied
          ? "bg-green-600 text-white border border-green-500"
          : "bg-transparent text-white border border-white/20 hover:bg-white/10 active:bg-white/20 cursor-pointer"
      }`}
      title="Share"
    >
      <p>{copied ? "Copied" : "Share"}</p>
      {copied ? <Check size={16} strokeWidth={2} /> : <Share2 size={16} strokeWidth={2} />}
    </button>
  );
}
