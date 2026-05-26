import React from "react";

function Hero() {

  return (
    <div className="flex w-full flex-col items-center sm:justify-center gap-y-4 sm:gap-y-6 bg-black min-h-[80vh]">
      <h1 className="text-center text-7xl sm:text-[11vw] mt-6 sm:mt-4 font-semibold text-white">
        <span className="text-white">Code</span><span className="text-[#ed1b58]">Club</span> JUSL
      </h1>
      <div className="flex h-fit w-11/12 items-center justify-between border-red-500 text-red-400">
        <p className="p-3">[2018]</p>
        <div className="h-px w-full bg-gray-300/50"></div>
        <p className="p-3">[NOW]</p>
      </div>
      <div className="w-11/12 sm:px-4">
        <p className="lg:w-3/4 text-sm sm:text-lg 2xl:text-2xl 2xl:leading-10">
          CodeClub JUSL is the official coding club of Jadavpur University that operates from the SaltLake Campus. It offers a collaborative platform for individuals passionate about tech and programming to learn and share their knowledge. Through workshops, discussions, and practical sessions, members explore various programming languages, tools, and concepts, building a supportive community dedicated to enhancing coding skills and fostering innovation.
        </p>
      </div>
    </div>
  );
}

export default Hero;
