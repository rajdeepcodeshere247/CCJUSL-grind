import React from "react";

interface FormattedTextProps {
  text: string;
  className?: string;
}

export default function FormattedText({ text, className = "" }: FormattedTextProps) {
  if (!text) return null;

  // Split by double newlines to get paragraphs
  const paragraphs = text.split(/\r?\n\r?\n/);

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((p, index) => {
        if (!p.trim()) return null;
        return (
          <p key={index} className="text-base font-light leading-relaxed">
            {renderInline(p)}
          </p>
        );
      })}
    </div>
  );
}

export function renderInline(text: string): React.ReactNode[] {
  if (!text) return [];

  // Split the text by single newlines to handle line breaks within a paragraph
  const lines = text.split(/\r?\n/);

  return lines.reduce((acc: React.ReactNode[], line, lineIdx) => {
    if (lineIdx > 0) {
      acc.push(<br key={`br-${lineIdx}`} />);
    }

    // Parse inline tags:
    // **bold**
    // __underline__
    // *italics*
    // ==highlight==
    // Regex matches any of the inline tags in a single capture group
    const regex = /(\*\*.*?\*\*|__.*?__|\*.*?\*|==.*?==)/g;
    const parts = line.split(regex);

    const parsedLine = parts.map((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={partIdx} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("__") && part.endsWith("__")) {
        return (
          <span key={partIdx} className="underline decoration-red-400">
            {part.slice(2, -2)}
          </span>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={partIdx} className="italic text-white/95">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("==") && part.endsWith("==")) {
        return (
          <mark key={partIdx} className="bg-red-400/20 text-red-300 font-semibold px-1.5 py-0.5 rounded border border-red-500/20">
            {part.slice(2, -2)}
          </mark>
        );
      }
      return part;
    });

    acc.push(...parsedLine);
    return acc;
  }, []);
}
