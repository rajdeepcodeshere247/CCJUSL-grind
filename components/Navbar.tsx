'use client';

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";

function Navbar({fromLayout = false}) {
  const path = usePathname();
  if(path === "/" && fromLayout) return;

  return (
    <div className="flex w-full justify-center px-6 font-jetbrains-mono">
      <div className="flex w-11/12 items-center justify-between border-b border-b-gray-300/50 py-6">
        <Link href={"/"} className="text-2xl lg:text-5xl">
          <Image height={100} width={100} src={"/ccjusl-logo.png"} alt="CCJUSL Logo" />
        </Link>
        <nav className="flex items-center gap-2 lg:gap-12 lg:text-2xl uppercase">
          <Link href={"/#events"}>Events</Link>
          <Link href={"/#contact"}>Contact</Link>
          <Link href={"/signin"}>Sign-in</Link>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
