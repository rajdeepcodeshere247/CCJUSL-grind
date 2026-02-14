"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getAuthStatus } from "@/services/AuthService";

function Navbar({ fromLayout = false }) {
  const path = usePathname();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    getAuthStatus().then((res) => {
      if (res) setSignedIn(true);
    });
  }, []);

  if (path === "/" && fromLayout) return;

  return (
    <div className="font-jetbrains-mono flex w-full justify-center px-6">
      <div className="flex w-11/12 items-center justify-between border-b border-b-gray-300/50 py-3">
        <Link href={"/"} className="text-2xl lg:text-5xl">
          <Image
            height={100}
            width={100}
            src={"/ccjusl-logo.png"}
            alt="CCJUSL Logo"
          />
        </Link>
        <nav className="flex items-center gap-2 uppercase lg:gap-12 lg:text-2xl">
          <Link href={"/#events"}>Events</Link>
          {signedIn ? (
            <Link href={"/dashboard"}>Dashboard</Link>
          ) : (
            <Link href={"/signin"}>Sign-in</Link>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
