import React from "react";
import Image from "next/image";

type EventType = {
  id: number;
  title: string;
  description: string;
  image: string;
  classes: string;
};

const events: EventType[] = [
  {
    id: 1,
    title: "HackForge",
    description: "Hackathon",
    image: "/hackforge.jpg",
    classes: "bg-red-400 rotate-6 left-5 2xl:left-[5%] top-0 lg:top-[25%]",
  },
  {
    id: 2,
    title: "H42",
    description: "Competitive Programming",
    image: "/sample.png",
    classes: "bg-blue-400 -rotate-6 left-[5%] lg:left-[25%] top-[20%] lg:top-[35%]",
  },
  {
    id: 3,
    title: "Sherlocked",
    description: "CTF",
    image: "/sample.png",
    classes: "bg-red-400 rotate-6 left-[5%] lg:left-[45%] top-[40%] lg:top-[30%]",
  },
  {
    id: 4,
    title: "Pass The Baton",
    description: "Competitive Programming",
    image: "/sample.png",
    classes: "bg-blue-400 -rotate-6 left-[5%] lg:left-[70%] top-[60%] lg:top-[35%]",
  },
];

function Card({ event }: { event: EventType }) {
  return (
    <div
      className={`${event.classes} p-4 rounded-md flex flex-col gap-y-2 absolute uppercase text-black scale-75 lg:scale-90 2xl:scale-120`}
    >
      <Image
        src={event.image}
        height={350}
        width={350}
        alt="Sample Image"
        className="aspect-video object-cover"
      />
      <h2 className="text-3xl font-semibold">
        {event.title}
      </h2>
      <p className="text-lg">
        {event.description}
      </p>
    </div>
  );
}

function Gallery() {
  return (
    <div className="w-full min-h-[150vh] lg:min-h-screen bg-gradient-to-b from-transparent via-black to-black drop-shadow-2xl">
      {events.map((e) => (
        <Card event={e} key={e.id} />
      ))}
    </div>
  );
}

export default Gallery;
