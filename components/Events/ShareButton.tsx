"use client";
import React, { useState } from "react";
import { Share2, Check, X, Mail } from "lucide-react";
import { CLIP_PATH } from "./constants/events";
import toast from "react-hot-toast";

interface ShareButtonProps {
  eventSlug: string;
  eventTitle: string;
  isCard?: boolean;
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.61l-1.86 8.77c-.14.63-.51.79-1.04.49l-2.83-2.09-1.37 1.32c-.15.15-.28.28-.57.28l.2-2.87 5.22-4.72c.23-.2-.05-.31-.35-.11l-6.45 4.06-2.78-.87c-.6-.19-.61-.6.13-.89l10.87-4.19c.5-.19.94.11.78.89z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
  </svg>
);

export default function ShareButton({ eventSlug, eventTitle, isCard }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const buttonStyle = isCard ? { clipPath: CLIP_PATH } : {};

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin.includes("localhost")
        ? "https://www.codeclubjusl.in"
        : window.location.origin;
      return `${origin}/events/${eventSlug}`;
    }
    return `https://www.codeclubjusl.in/events/${eventSlug}`;
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleMoreOptions = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = getShareUrl();

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
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    const shareUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
      toast.error("Failed to copy link.");
    }
  };

  const shareUrl = getShareUrl();
  const shareText = `Check out ${eventTitle} at Code Club JUSL!`;

  return (
    <>
      <button
        onClick={handleShareClick}
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

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-default animate-fade-in"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          <div 
            className="relative w-full max-w-md border border-white/20 bg-black/95 p-8 shadow-2xl transition-all duration-300 flex flex-col gap-6"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* Close Button */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-white uppercase font-mono">
                Share Event
              </h3>
              <p className="text-sm font-light text-white/60">
                Publicize {eventTitle} with your network!
              </p>
            </div>

            {/* Grid of Social Buttons */}
            <div className="grid grid-cols-4 gap-y-6 gap-x-4 py-4 text-center">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                  <WhatsAppIcon />
                </div>
                <span className="text-xs font-mono tracking-wider text-white/70 group-hover:text-white transition-colors">WhatsApp</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 rounded-full bg-black border border-white/20 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                  <TwitterIcon />
                </div>
                <span className="text-xs font-mono tracking-wider text-white/70 group-hover:text-white transition-colors">Twitter / X</span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 rounded-full bg-[#0077B5] flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                  <LinkedInIcon />
                </div>
                <span className="text-xs font-mono tracking-wider text-white/70 group-hover:text-white transition-colors">LinkedIn</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 rounded-full bg-[#24A1DE] flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                  <TelegramIcon />
                </div>
                <span className="text-xs font-mono tracking-wider text-white/70 group-hover:text-white transition-colors">Telegram</span>
              </a>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-3 gap-y-6 gap-x-4 text-center justify-center">
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                  <FacebookIcon />
                </div>
                <span className="text-xs font-mono tracking-wider text-white/70 group-hover:text-white transition-colors">Facebook</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(eventTitle)}&body=${encodeURIComponent(`${shareText}\n\nLink: ${shareUrl}`)}`}
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 rounded-full bg-[#4b5563] flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                  <Mail size={22} />
                </div>
                <span className="text-xs font-mono tracking-wider text-white/70 group-hover:text-white transition-colors">Email</span>
              </a>

              {/* More Options / Copy Link */}
              <button
                onClick={(e) => {
                  handleMoreOptions(e);
                  setIsOpen(false);
                }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-[#1f2937] border border-white/10 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                  <Share2 size={22} />
                </div>
                <span className="text-xs font-mono tracking-wider text-white/70 group-hover:text-white transition-colors">More Options</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
