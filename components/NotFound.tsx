import Link from "next/link";
import React from "react";

function NotFound() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-12 px-4">
      {/* Decorative lines */}
      <div className="flex items-center justify-center gap-4 font-mono text-xs tracking-widest text-white/40">
        <div className="h-px w-16 bg-white/20"></div>
        <span>ERROR</span>
        <div className="h-px w-16 bg-white/20"></div>
      </div>

      {/* Main 404 */}
      <div className="relative">
        <h1 className="text-8xl font-bold tracking-tighter text-white md:text-9xl">
          404
        </h1>
        <div className="absolute right-0 -bottom-2 left-0 h-px bg-red-400"></div>
      </div>

      {/* Error message */}
      <div className="max-w-2xl space-y-4 text-center">
        <h2 className="text-xl leading-relaxed font-light text-white/70 md:text-2xl">
          The resource you were looking for could not be found.
        </h2>
        <p className="font-mono text-sm tracking-wide text-white/40">
          PAGE_NOT_FOUND
        </p>
      </div>

      {/* Action button */}
      <Link
        href="/"
        className="mt-4 border border-red-400 px-10 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all hover:bg-red-400 hover:text-black"
      >
        Return Home
      </Link>

      {/* Bottom decoration */}
      <div className="mt-8 flex items-center justify-center gap-6 opacity-20">
        <div className="h-px max-w-32 flex-1 bg-white/30"></div>
        <p className="font-mono text-xs tracking-[0.3em]">END</p>
        <div className="h-px max-w-32 flex-1 bg-white/30"></div>
      </div>
    </div>
  );
}

export default NotFound;
