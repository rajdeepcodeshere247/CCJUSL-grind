import React from "react";
import Contact from "@/components/Home/Contact";

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-between">
      <div className="flex-grow pt-24 flex items-center justify-center">
        {/* Empty Team Section */}
        <h1 className="text-white text-4xl font-jetbrains-mono uppercase">Team Page</h1>
      </div>
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-16"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 100 10"
        >
          <polygon
            points="0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10"
            className="fill-black"
          />
        </svg>
      </div>
      <div className="relative z-20">
        <Contact />
      </div>
    </div>
  );
}
