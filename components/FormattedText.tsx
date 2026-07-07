import React from "react";

interface FormattedTextProps {
  text: string;
  className?: string;
}

export default function FormattedText({ text, className = "" }: FormattedTextProps) {
  if (!text) return null;

  // Split by double newlines to get paragraphs/blocks
  const blocks = text.split(/\r?\n\r?\n/);

  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((block, blockIdx) => {
        if (!block.trim()) return null;

        const lines = block.split(/\r?\n/);
        const renderedElements: React.ReactNode[] = [];
        
        let currentList: { type: "bullet" | "number"; items: string[] } | null = null;

        const flushList = (key: string) => {
          if (!currentList) return;
          
          if (currentList.type === "bullet") {
            renderedElements.push(
              <ul key={key} className="list-disc pl-6 space-y-2 text-base font-light text-white/70">
                {currentList.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            );
          } else {
            renderedElements.push(
              <ol key={key} className="list-decimal pl-6 space-y-2 text-base font-light text-white/70">
                {currentList.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {renderInline(item)}
                  </li>
                ))}
              </ol>
            );
          }
          currentList = null;
        };

        lines.forEach((line, lineIdx) => {
          const trimmedLine = line.trim();
          
          // Check if bulleted list item (matches leading * or - followed by spaces)
          const bulletMatch = line.match(/^(\s*)[\*\-]\s+(.*)$/);
          // Check if numbered list item (matches leading digit. followed by spaces)
          const numberMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);

          if (bulletMatch) {
            // If we were building a numbered list, flush it first
            if (currentList && currentList.type !== "bullet") {
              flushList(`list-flush-${blockIdx}-${lineIdx}`);
            }
            // Start or append to bullet list
            if (!currentList) {
              currentList = { type: "bullet", items: [] };
            }
            currentList.items.push(bulletMatch[2]);
          } else if (numberMatch) {
            // If we were building a bullet list, flush it first
            if (currentList && currentList.type !== "number") {
              flushList(`list-flush-${blockIdx}-${lineIdx}`);
            }
            // Start or append to numbered list
            if (!currentList) {
              currentList = { type: "number", items: [] };
            }
            currentList.items.push(numberMatch[2]);
          } else {
            // Flush any active list before rendering a paragraph
            if (currentList) {
              flushList(`list-flush-${blockIdx}-${lineIdx}`);
            }
            if (trimmedLine) {
              renderedElements.push(
                <p key={`p-${blockIdx}-${lineIdx}`} className="text-base font-light leading-relaxed">
                  {renderInline(line)}
                </p>
              );
            } else {
              renderedElements.push(<div key={`br-${blockIdx}-${lineIdx}`} className="h-2" />);
            }
          }
        });

        // Flush any remaining list at the end of the block
        if (currentList) {
          flushList(`list-end-${blockIdx}`);
        }

        return (
          <div key={blockIdx} className="space-y-4">
            {renderedElements}
          </div>
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
