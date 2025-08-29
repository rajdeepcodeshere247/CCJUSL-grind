import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div className="flex w-full justify-center px-6">
      <div className="font-jetbrains-mono flex w-11/12 items-center justify-between border-b-[1px] border-b-gray-300/50 py-10">
        <Link href={"/"} className="text-5xl">
          CCJUSL
        </Link>
        <nav className="flex items-center gap-12 text-2xl uppercase">
          <Link href={"/#about"}>About</Link>
          <Link href={"/#about"}>Contact</Link>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
