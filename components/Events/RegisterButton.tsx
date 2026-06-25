"use client";
import React from "react";
import Link from "next/link";
import { CircleSlash, CheckCircle2 } from "lucide-react";
import { CLIP_PATH } from "./constants/events";

interface RegisterButtonProps {
  status: "Open" | "Closed" | "Coming Soon";
  link?: string;
  isCard?: boolean;
  slug: string;
}

export default function RegisterButton({ status, link, isCard, slug }: RegisterButtonProps) {
  const buttonStyle = isCard ? { clipPath: CLIP_PATH } : {};

  if (status === "Closed") {
    return (
      <div
        style={buttonStyle}
        className="font-euclid text-xs uppercase font-bold flex items-center justify-center py-2.5 gap-2 rounded bg-[#1e293b]/80 text-[#94a3b8] select-none cursor-not-allowed w-full border border-white/5"
      >
        <p>Closed</p>
        <CircleSlash size={16} strokeWidth={2} />
      </div>
    );
  }

  if (status === "Coming Soon") {
    return (
      <div
        style={buttonStyle}
        className="font-euclid text-xs uppercase font-bold flex items-center justify-center py-2.5 gap-2 rounded bg-[#1e293b]/80 text-yellow-500 select-none cursor-not-allowed w-full border border-white/5"
      >
        <p>Coming Soon</p>
      </div>
    );
  }

  // Otherwise, it is Open!
  const regUrl = link || `/eventRegistration/${slug}`;
  return (
    <Link
      href={regUrl}
      style={buttonStyle}
      className="font-euclid text-xs uppercase font-bold flex items-center justify-center py-2.5 gap-2 rounded bg-amber-400 text-black hover:bg-amber-300 active:bg-amber-500 duration-200 transition-all w-full"
      title="Register"
    >
      <p>Register Now</p>
      <CheckCircle2 size={16} strokeWidth={2} />
    </Link>
  );
}
