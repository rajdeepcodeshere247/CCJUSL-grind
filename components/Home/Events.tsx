import Link from "next/link";
import React from "react";

const eventData = [
  {
    name: "H42",
    slug: "h42",
    type: "Competitive Programming"
  },
  {
    name: "Hackforge",
    slug: "hackforge",
    type: "Hackathon"
  },
  {
    name: "Pass the Baton",
    slug: "ptb",
    type: "Competitive Programming"
  },
  {
    name: "Sherlocked",
    slug: "sherlocked",
    type: "Capture the Flag"
  },
  {
    name: "Epochalypse",
    slug: "epochalypse",
    type: "Data Science"
  },
];

function Events() {
  return (
    <div id="events" className="flex w-full flex-col items-center gap-y-20 bg-black py-8">
      <h1 className="text-6xl sm:text-8xl font-semibold">EVENTS</h1>
      <ul className="flex w-5/6 flex-col lg:w-4/5 2xl:w-3/5 border-b border-b-gray-400/50">
      {eventData.map(event => (
        <li key={event.slug} className="grid grid-cols-2 w-full items-center gap-6 border-t border-gray-400/50 px-2 py-4 transition-colors duration-300 hover:bg-gray-400/20">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl sm:text-3xl font-semibold">{event.name}</h3>
            <p className="text-red-400">{event.type}</p>
          </div>
          <Link href={`/events/${event.slug}`} className="text-sm sm:text-base text-center justify-self-end px-5 py-2 border border-red-400/60">Learn More</Link>
        </li>
      ))}
      </ul>
    </div>
  );
}

export default Events;