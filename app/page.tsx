import React from "react";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Events from "@/components/Events";

function page() {
  return (
    <div className="font-jetbrains-mono absolute w-full">
      <div className="fixed top-0 z-10 flex h-screen flex-col items-center">
        <Navbar />
        <Hero />
      </div>
      <div className="relative top-0 z-20 mt-[100vh] lg:sticky lg:h-screen">
        <Gallery />
        <Events />
        <Contact />
      </div>
    </div>
  );
}

export default page;
