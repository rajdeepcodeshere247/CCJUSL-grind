import eventData from "@/eventData.json";
import { redirect } from "next/navigation";
import {
  Calendar,
  Users,
  Trophy,
  Hash,
  Phone,
  Megaphone,
} from "lucide-react";

import Image from "next/image";
import RegistrationButton from "@/components/Events/RegistrationButton";
import Footer from "@/components/Footer";
import { getEventFromSlug } from "@/services/EventsService";

interface EventDetailsType {
  name: string;
  slug: string;
  eventShortDescription: string;
  eventDescription: string[];
  eventRules: string[];
  eventPoster: string;
  eventHashtags: string[];
  registrationOpen: boolean;
  eventDate: {
    prelims: string[];
    finals: string;
  };
  minMembers: number;
  maxMembers: number;
  prize: string[];
  eventCoordinators: string[];
  updates: string[];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // 1. Fetch from Database first
  const dbEvent = await getEventFromSlug(slug);
  
  let eventDetails: EventDetailsType | null = null;

  if (dbEvent && dbEvent.isLive) {
    eventDetails = {
      name: dbEvent.name,
      slug: dbEvent.slug,
      eventShortDescription: dbEvent.shortDescription || "",
      eventDescription: dbEvent.description ? [dbEvent.description] : [],
      eventRules: dbEvent.rules || [],
      eventPoster: dbEvent.poster || "default-poster.webp",
      eventHashtags: ["LIVE", "EVENT"],
      registrationOpen: dbEvent.registrationsOpen,
      eventDate: {
        prelims: dbEvent.prelimsDate || [],
        finals: dbEvent.finalsDate || "TBD",
      },
      minMembers: dbEvent.minMembers,
      maxMembers: dbEvent.maxMembers,
      prize: dbEvent.prize ? [dbEvent.prize] : ["TBD"],
      eventCoordinators: dbEvent.coordinators || [],
      updates: dbEvent.updates || [],
    };
  } else {
    // 2. Fallback to static eventData.json
    const staticEvent = eventData.find((event) => event.slug === slug);
    if (staticEvent) {
      eventDetails = {
        ...staticEvent,
        updates: [],
      };
    }
  }

  if (!eventDetails) redirect("/404");

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-8xl">
              {eventDetails.name}
            </h1>

            <div className="grid sm:grid-cols-2 place-items-center gap-8 py-8">
              <Image src={`/images/posters/${eventDetails.eventPoster}`} width={200} height={200} className="h-full w-auto" alt={eventDetails.name} />
              <div className="flex flex-col items-center gap-10">
                <p className="mx-auto max-w-4xl text-lg leading-relaxed font-light text-white/80 md:text-xl">
                  {eventDetails.eventShortDescription}
                </p>

                {/* Hashtags */}
                <div className="flex flex-wrap justify-center gap-3">
                  {eventDetails.eventHashtags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center border border-white/20 px-4 py-2 font-mono text-sm text-white/70 transition-colors hover:border-red-400/50 hover:text-red-400"
                    >
                      <Hash className="mr-1 h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <RegistrationButton registrationOpen={eventDetails.registrationOpen} slug={slug} />

            <div className="border border-white/10 p-6 w-4/5">
              <h3 className="mb-6 flex items-center text-lg font-bold tracking-wide text-white">
                <Calendar className="mr-3 h-5 w-5 text-red-400" />
                EVENT SCHEDULE
              </h3>
              <div className="space-y-5">
                <div>
                  <p className="mb-3 font-mono text-xs tracking-wider text-red-400">
                    PRELIMINARIES
                  </p>
                  {eventDetails.eventDate.prelims.map((date: string, index: number) => (
                    <p
                      key={index}
                      className="border-l-2 border-white/20 py-2 pl-4 text-sm font-light text-white/70"
                    >
                      {date}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="mb-3 font-mono text-xs tracking-wider text-red-400">
                    FINALS
                  </p>
                  <p className="border-l-2 border-white/20 py-2 pl-4 text-sm font-light text-white/70">
                    {eventDetails.eventDate.finals}
                  </p>
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="space-y-16 lg:col-span-2">
            {/* Updates & Announcements (if any) */}
            {eventDetails.updates && eventDetails.updates.length > 0 && (
              <div className="border border-red-500/20 bg-red-500/[0.02] p-6 mb-8">
                <h3 className="mb-4 flex items-center text-lg font-bold tracking-wide text-red-400 font-mono">
                  <Megaphone className="mr-3 h-5 w-5" />
                  ANNOUNCEMENTS & UPDATES
                </h3>
                <div className="space-y-4">
                  {eventDetails.updates.map((update: string, index: number) => (
                    <div
                      key={index}
                      className="border-l-2 border-red-400 pl-4 py-2 text-sm font-light text-white/90 bg-white/[0.01]"
                    >
                      {update}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Description */}
            <div className="border-l-2 border-red-400 pl-8">
              <h2 className="mb-8 text-3xl font-bold tracking-tight text-white">
                About the Event
              </h2>
              <div className="space-y-6 leading-relaxed text-white/70">
                {eventDetails.eventDescription.map((paragraph: string, index: number) => (
                  <p key={index} className="text-base font-light">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Event Rules */}
            <div className="border-l-2 border-red-400 pl-8">
              <h2 className="mb-8 text-3xl font-bold tracking-tight text-white">
                Rules & Guidelines
              </h2>
              <div className="space-y-5">
                {eventDetails.eventRules.map((rule: string, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400"></div>
                    <p className="text-base leading-relaxed font-light text-white/70">
                      {rule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Event Details */}
          <div className="space-y-8">
            {/* Team Size */}
            <div className="border border-white/10 p-6">
              <h3 className="mb-6 flex items-center text-lg font-bold tracking-wide text-white">
                <Users className="mr-3 h-5 w-5 text-red-400" />
                TEAM REQUIREMENTS
              </h3>
              <div className="border-l-2 border-red-400 py-2 pl-6">
                <p className="text-center text-white">
                  <span className="mb-2 block text-4xl font-bold text-white">
                    {eventDetails.minMembers === eventDetails.maxMembers
                      ? `${eventDetails.minMembers}`
                      : `${eventDetails.minMembers} - ${eventDetails.maxMembers}`}
                  </span>
                  <span className="text-sm tracking-wide text-white/60">
                    MEMBER(S) PER TEAM
                  </span>
                </p>
              </div>
            </div>

            {/* Prizes */}
            <div className="border border-white/10 p-6">
              <h3 className="mb-6 flex items-center text-lg font-bold tracking-wide text-white">
                <Trophy className="mr-3 h-5 w-5 text-red-400" />
                PRIZE POOL
              </h3>
              <div className="space-y-3">
                {eventDetails.prize.map((prize: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-l-2 border-white/20 py-3 pl-4"
                  >
                    <span className="font-mono text-sm tracking-wide text-white/70">
                      {prize.split(":")[0].trim()}
                    </span>
                    <span className="text-xl font-bold text-white">
                      ₹{prize.split(":")[1].trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Coordinators */}
            <div className="border border-white/10 p-6">
              <h3 className="mb-6 flex items-center text-lg font-bold tracking-wide text-white">
                <Phone className="mr-3 h-5 w-5 text-red-400" />
                CONTACT US
              </h3>
              <div className="space-y-3">
                {eventDetails.eventCoordinators.map((coordinator: string, index: number) => (
                  <div
                    key={index}
                    className="border-l-2 border-white/20 py-2 pl-4 text-sm font-light text-white/70"
                  >
                    {coordinator}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

