"use client";

import { signOut } from "next-auth/react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { Event } from "@/types/events";
import { SERVER_URL } from "@/utils/constants";

type DashboardTeam = {
  id: string;
  name: string;
  eventSlug: string;
  event: Event;
}

type DashboardUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  college: string | null;
  department: string | null;
  year: string | null;
  phone: string | null;
  teams: DashboardTeam[];
  pendingTeams: DashboardTeam[]
}

function Dashboard({ user }: { user: DashboardUser }) {
  const handleLogout = () => {
    signOut({
      redirectTo: `${SERVER_URL}/signin`
    });
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="mt-12 mb-8 flex w-full items-center gap-4">
      <h2 className="text-2xl font-bold tracking-tight whitespace-nowrap text-white uppercase">
        {title}
      </h2>
      <div className="h-px flex-1 bg-white/20"></div>
    </div>
  );

  const EmptyState = ({ text }: { text: string }) => (
    <p className="text-sm font-light text-white/50">{text}</p>
  );

  return (
    <div className="relative isolate mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-16 p-6 text-white md:p-12">
      {/* Timeline Decoration */}
      <div className="flex w-full items-center justify-center gap-4 pt-8 font-mono text-xs tracking-widest text-white/40">
        <div className="h-px w-24 bg-white/20"></div>
        <span>DASHBOARD</span>
        <div className="h-px w-24 bg-white/20"></div>
      </div>

      {/* Profile Header */}
      <div className="flex w-full flex-col items-center gap-8 border-b border-white/10 pb-12 md:flex-row md:items-start">
        <div className="relative">
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden border border-white/20 bg-black">
            {user.image ? (
              <Image
                src={user.image}
                alt="Profile"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                width={100}
                height={100}
              />
            ) : (
              <span className="text-6xl font-light text-white/60">
                {user.name ? user.name[0].toUpperCase() : "?"}
              </span>
            )}
          </div>
          <div className="absolute -right-3 -bottom-3 bg-red-400 px-3 py-1.5 text-xs font-bold tracking-wider text-black uppercase">
            {user.role || "Guest"}
          </div>
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            {user.name || "Anonymous User"}
          </h1>
          <p className="font-mono text-base tracking-wide text-white/60">
            {user.email || "No email linked"}
          </p>
          <div className="pt-2">
            <p className="mb-1 font-mono text-xs tracking-widest text-white/40 uppercase">
              Member Since
            </p>
            <p className="font-light text-white/80">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Date Unknown"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="cursor-pointer border border-red-400 px-10 py-3 text-sm font-bold tracking-widest uppercase transition-all hover:bg-red-400 hover:text-black"
        >
          Logout
        </button>
      </div>

      {/* Academic Information */}
      <div className="w-full">
        <SectionHeader title="Academic Information" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border border-white/20 p-6">
            <p className="mb-3 font-mono text-xs tracking-widest text-white/50 uppercase">
              College
            </p>
            <p className="text-lg font-light text-white">
              {user.college || <EmptyState text="Not specified" />}
            </p>
          </div>
          <div className="border border-white/20 p-6">
            <p className="mb-3 font-mono text-xs tracking-widest text-white/50 uppercase">
              Department
            </p>
            <p className="text-lg font-light text-white">
              {user.department || <EmptyState text="Not listed" />}
            </p>
          </div>
          <div className="border border-white/20 p-6">
            <p className="mb-3 font-mono text-xs tracking-widest text-white/50 uppercase">
              Graduation Year
            </p>
            <p className="text-lg font-light text-white">
              {user.year || <EmptyState text="N/A" />}
            </p>
          </div>
          <div className="border border-white/20 p-6">
            <p className="mb-3 font-mono text-xs tracking-widest text-white/50 uppercase">
              Phone
            </p>
            <p className="text-lg font-light text-white">
              {user.phone || <EmptyState text="Not added" />}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="w-full">
        <SectionHeader title="Activity Overview" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              id: 1,
              label: "My Teams",
              data: user.teams,
              empty: "Not part of any teams yet",
            },
            {
              id: 2,
              label: "Pending Requests",
              data: user.pendingTeams,
              empty: "No pending invitations",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="border border-white/20 p-6 transition-colors hover:border-red-400/50"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="mb-1 text-base font-bold tracking-wider text-white uppercase">
                    {item.label}
                  </h3>
                  {(!item.data || item.data.length === 0) && (
                    <EmptyState text={item.empty} />
                  )}
                </div>
                <span className="ml-4 text-4xl font-light text-red-400">
                  {item.data?.length || 0}
                </span>
              </div>
              {item.data && item.data.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  {item.data.map((team: DashboardTeam, idx: number) => (
                    <Link href={`/eventRegistration/${team.eventSlug}`}
                      key={`${team.id}-${idx}`}
                      className="border border-white/30 px-3 py-1.5 font-mono text-xs text-white/70 transition-colors hover:border-red-400 hover:text-white"
                    >
                      {team.name} ({team.event?.name ?? team.eventSlug})
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
