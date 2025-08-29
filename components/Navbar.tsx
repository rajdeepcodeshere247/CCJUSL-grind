import Link from "next/link";
import Image from "next/image";
import React from "react";

function Navbar() {
  return (
    <div className="flex w-full justify-center px-6 bg-black">
      <div className="flex w-11/12 items-center justify-between border-b-[1px] border-b-gray-300/50 py-6">
        <Link href={"/"} className="text-2xl lg:text-5xl">
          <Image height={100} width={100} src={"/ccjusl-logo.png"} alt="CCJUSL Logo" />
        </Link>
        <nav className="flex items-center gap-2 lg:gap-12 lg:text-2xl uppercase">
          <Link href={"/#events"}>Events</Link>
          <Link href={"/#contact"}>Contact</Link>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
