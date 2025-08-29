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
    image: "/sample.png",
    classes: "bg-red-400 rotate-6 left-[5%] top-[15%]",
  },
  {
    id: 2,
    title: "H42",
    description: "Competitive Programming",
    image: "/sample.png",
    classes: "bg-blue-400 -rotate-6 left-[25%] top-[25%]",
  },
  {
    id: 3,
    title: "Sherlocked",
    description: "CTF",
    image: "/sample.png",
    classes: "bg-red-400 rotate-6 left-[50%] top-[20%]",
  },
  {
    id: 4,
    title: "Pass The Baton",
    description: "Competitive Programming",
    image: "/sample.png",
    classes: "bg-blue-400 -rotate-6 left-[72%] top-[25%]",
  },
];

function Card({ event }: { event: EventType }) {
  return (
    <div
      className={`${event.classes} p-4 rounded-md flex flex-col gap-y-2 absolute uppercase font-jetbrains-mono text-black`}
    >
      <Image
        src={event.image}
        height={450}
        width={450}
        alt="Sample Image"
        className="aspect-video"
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
    <div className="w-full min-h-screen sticky bg-gradient-to-b from-transparent via-black to-black drop-shadow-2xl overflow-clip">
      {events.map((e) => (
        <Card event={e} key={e.id} />
      ))}
    </div>
  );
}

export default Gallery;
