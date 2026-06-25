"use client";
import React from "react";
import { FileText } from "lucide-react";
import { CLIP_PATH } from "./constants/events";

interface DocButtonProps {
  isCard?: boolean;
  docUrl?: string;
}

export default function DocButton({ isCard, docUrl }: DocButtonProps) {
  const buttonStyle = isCard ? { clipPath: CLIP_PATH } : {};

  if (!docUrl) {
    return (
      <div
        style={buttonStyle}
        className="font-euclid text-xs uppercase font-bold flex items-center justify-center py-2.5 gap-2 rounded bg-[#1e293b]/40 text-gray-500 border border-gray-800/40 select-none cursor-not-allowed w-full"
        title="No Document Available"
      >
        <p>Rulebook</p>
        <FileText size={16} strokeWidth={2} />
      </div>
    );
  }

  return (
    <a
      href={docUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={buttonStyle}
      className="font-euclid text-xs uppercase font-bold flex items-center justify-center py-2.5 gap-2 rounded bg-transparent text-white border border-white/20 hover:bg-white/10 active:bg-white/20 transition-all duration-200 w-full cursor-pointer"
      title="View Rulebook"
      onClick={(e) => e.stopPropagation()}
    >
      <p>Rulebook</p>
      <FileText size={16} strokeWidth={2} />
    </a>
  );
}
