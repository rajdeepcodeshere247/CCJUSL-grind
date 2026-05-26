import React from "react";
import Contact from "@/components/Home/Contact";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-between">
      <div className="flex-grow pt-24 flex items-center justify-center">
        {/* Empty Gallery Section */}
        <h1 className="text-white text-4xl font-jetbrains-mono uppercase">Gallery Page</h1>
      </div>
      <div className="relative z-20">
        <Contact />
      </div>
    </div>
  );
}
