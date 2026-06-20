"use client";

import React from "react";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutUniversity() {
  return (
    <section className="w-full bg-black py-14 sm:py-20 lg:py-28">
      <div className="mx-auto w-11/12 max-w-7xl">
        <SectionHeading className="mb-8 sm:mb-12 lg:mb-16">
          Jadavpur University
        </SectionHeading>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left — Text */}
          <AnimatedSection direction="left" delay={0.1}>
            <div className="flex flex-col gap-6">
              <p className="text-sm leading-relaxed text-white/70 sm:text-base lg:text-lg lg:leading-8">
                Jadavpur University, established in 1955, is one of the premier
                institutions of higher learning in India. The Salt Lake Campus,
                located in Sector III of Bidhannagar, Kolkata, houses the
                Faculty of Engineering and Technology and is a hub for
                innovation, research, and academic excellence.
              </p>
              <p className="text-sm leading-relaxed text-white/70 sm:text-base lg:text-lg lg:leading-8">
                With world-class infrastructure, dedicated faculty, and a
                vibrant student community, the campus fosters an environment
                where technology and creativity converge. It is home to numerous
                student-run organizations, technical clubs, and research labs
                that push the boundaries of knowledge.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-4 pt-2">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white lg:text-3xl">1955</span>
                  <span className="text-xs uppercase tracking-wider text-white/40">Established</span>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white lg:text-3xl">10K+</span>
                  <span className="text-xs uppercase tracking-wider text-white/40">Students</span>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white lg:text-3xl">NAAC A+</span>
                  <span className="text-xs uppercase tracking-wider text-white/40">Accredited</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right — Image */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10">
              <Image
                src="/images/jusl.png"
                alt="Jadavpur University Salt Lake Campus"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
