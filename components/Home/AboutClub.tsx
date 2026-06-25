"use client";

import React from "react";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutClub() {
  return (
    <section className="w-full bg-black py-14 sm:py-20 lg:py-28">
      <div className="mx-auto w-11/12 max-w-7xl">
        <SectionHeading className="mb-8 sm:mb-12 lg:mb-16">
          About Code Club
        </SectionHeading>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left — Image */}
          <AnimatedSection direction="left" delay={0.1}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10">
              <Image
                src="/images/events/ccabout.webp"
                alt="CodeClub JUSL members collaborating"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </AnimatedSection>

          {/* Right — Description */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="flex flex-col gap-8">
              {/* Mission */}
              <div className="border-l-2 border-red-400 pl-6">
                <h3 className="mb-3 text-lg font-semibold uppercase tracking-wider text-red-400">
                  Our Mission
                </h3>
                <p className="text-sm leading-relaxed text-white/70 sm:text-base lg:text-lg lg:leading-8">
                  To create a vibrant, inclusive tech community where students
                  can learn, collaborate, and innovate. We bridge the gap between
                  academic knowledge and industry-ready skills through hands-on
                  workshops, competitive programming, and real-world projects.
                </p>
              </div>

              {/* Vision */}
              <div className="border-l-2 border-red-400 pl-6">
                <h3 className="mb-3 text-lg font-semibold uppercase tracking-wider text-red-400">
                  Our Vision
                </h3>
                <p className="text-sm leading-relaxed text-white/70 sm:text-base lg:text-lg lg:leading-8">
                  To be the premier student-led coding community in Eastern
                  India, nurturing the next generation of engineers, researchers,
                  and tech leaders who drive meaningful change through
                  technology.
                </p>
              </div>

              {/* Community Impact */}
              <div className="border-l-2 border-red-400 pl-6">
                <h3 className="mb-3 text-lg font-semibold uppercase tracking-wider text-red-400">
                  Community Impact
                </h3>
                <p className="text-sm leading-relaxed text-white/70 sm:text-base lg:text-lg lg:leading-8">
                  Since 2018, we have organized 50+ events, mentored 500+
                  students, and built a thriving network of alumni working at
                  top tech companies worldwide. Our events — from hackathons to
                  CTFs — bring together the brightest minds from across the
                  country.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
