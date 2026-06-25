import React from "react";
import Hero from "@/components/Home/Hero";
import AboutUniversity from "@/components/Home/AboutUniversity";
import AboutClub from "@/components/Home/AboutClub";
import PartnerSection from "@/components/PartnerSection";
import { sponsors, communityPartners } from "@/data/partners";
import Contact from "@/components/Home/Contact";
import Footer from "@/components/Footer";
import DomeGallery from "@/components/DomeGallery";
import TextType from "@/components/TextType";
import { galleryItems } from "@/data/gallery";
import SectionHeading from "@/components/ui/SectionHeading";

const domeImages = galleryItems.map((item) => ({
  src: item.src,
  alt: item.caption || item.alt || ""
}));

export default function HomePage() {
  return (
    <div className="font-jetbrains-mono relative w-full scroll-smooth bg-black overflow-x-hidden">
      {/* Fixed Hero Backdrop covering 1 screen */}
      <div className="fixed inset-0 z-0 h-screen w-full">
        <Hero />
      </div>

      {/* Main content sliding up over the Hero */}
      <div className="relative z-10 mt-[100vh] w-full bg-black shadow-[0_-24px_48px_rgba(0,0,0,0.85)]">
        {/* Gallery Section */}
        <section className="w-full bg-black py-16 sm:py-24 border-b border-white/5 flex flex-col items-center justify-center">
          <div className="mx-auto w-11/12 max-w-7xl text-center mb-8">
            <SectionHeading className="mb-6">Our Gallery</SectionHeading>
            <div className="h-12 text-sm sm:text-base md:text-lg font-semibold tracking-wider text-white/70">
              <TextType
                text={[
                  "Catch glimpses of our workshops and hackathons",
                  "A community of developers, builders, and designers",
                  "Drag or click cards to enlarge the gallery!"
                ]}
                typingSpeed={60}
                pauseDuration={1800}
                showCursor
                cursorCharacter="_"
                deletingSpeed={40}
                loop={true}
              />
            </div>
          </div>

          <div className="w-full max-w-7xl h-[450px] sm:h-[600px] relative overflow-hidden">
            <DomeGallery
              images={domeImages}
              fit={0.8}
              minRadius={600}
              maxVerticalRotationDeg={0}
              segments={34}
              dragDampening={2}
              grayscale
            />
          </div>
        </section>

        <AboutUniversity />
        <AboutClub />
        <PartnerSection title="Past Sponsors" partners={sponsors} />
        <PartnerSection title="Community Partners" partners={communityPartners} />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

