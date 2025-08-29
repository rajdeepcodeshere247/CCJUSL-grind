"use client";
import React, { useEffect, useState } from "react";

function Hero() {
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-jetbrains-mono flex w-full flex-col items-center gap-y-6">
      <h1 className="text-center text-[14rem] font-semibold">CodeClub JUSL</h1>
      <div className="flex h-fit w-11/12 items-center justify-between border-red-500 text-gray-300/90">
        <p className="p-3">[2018]</p>
        <div className="h-[1px] w-full bg-gray-300/50"></div>
        <p className="p-3">[NOW]</p>
      </div>
      <div className="w-11/12 px-4">
        <p className="w-3/5 text-2xl leading-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis quas
          nulla obcaecati quasi tempora alias id pariatur facilis distinctio,
          magni ipsa dolore officiis, odit itaque voluptatibus cumque! Rem vero
          debitis officiis consequatur adipisci blanditiis esse, dolore officia,
          quo vitae quod ratione aut excepturi accusamus explicabo nesciunt modi
          doloribus voluptate dignissimos!
        </p>
      </div>
    </div>
  );
}

export default Hero;
