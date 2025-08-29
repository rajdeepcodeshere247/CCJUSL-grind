import React from "react";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";

function page() {
  return (
    <div className="absolute w-full">
      <div className="fixed top-0 z-10 flex h-screen flex-col items-center">
        <Navbar />
        <Hero />
      </div>
      <div className="sticky top-0 z-20 mt-[100vh] h-screen">
        <Gallery />
      </div>
      <div className="sticky top-0 z-30 flex h-screen items-center justify-center bg-green-400">
        Section 3
      </div>
      <div className="sticky top-0 z-40 h-screen">
        <Contact />
      </div>
    </div>
  );
}

export default page;
