"use client";

import { SessionUser } from "@/types/user";
import { Event } from "@/types/events";
import React, { useState } from "react";
import { createTeam, joinTeam } from "@/services/EventsService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function NotRegistered({ user, event }: { user: SessionUser; event: Event }) {
    const router = useRouter();
    const [teamName, setTeamName] = useState("");
    const [teamCode, setTeamCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateTeam = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        createTeam(event, user, teamName)
            .then((res) => {
                if (res.ok) router.refresh();
                else toast.error(res.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleJoinTeam = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        joinTeam(event, user, teamCode)
            .then((res) => {
                if (res.ok) router.refresh();
                else toast.error(res.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center gap-8 h-full min-h-[80vh] p-4">

    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mt-4">
      {event.name}
    </h1>


  {/* Create Team Section */}
  <div className="flex flex-col items-center gap-6 w-full border border-white/20 p-8 sm:p-10 max-w-lg">
    <h4 className="text-lg font-bold uppercase tracking-wider text-white">Create New Team</h4>
    <input
      type="text"
      placeholder="TEAM NAME"
      value={teamName}
      onChange={(e) => {
        setTeamName(e.target.value);
      }}
      className="px-6 py-4 border border-white/20 bg-transparent text-white outline-none focus:border-red-400 transition-colors placeholder:text-white/40 font-light w-full"
    />
    <button
      onClick={(e) => {
        handleCreateTeam(e);
      }}
      disabled={loading}
      className="w-full border border-red-400 px-8 py-3 text-white hover:bg-red-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-widest uppercase text-sm font-bold"
    >
      {loading ? "CREATING..." : "CREATE TEAM"}
    </button>
  </div>

  {(event.maxMembers > 1) && (
    <>
      {/* Divider */}
      <div className="flex w-full max-w-lg items-center justify-center gap-6">
        <div className="h-px flex-1 bg-white/20"></div>
        <p className="text-white/40 text-sm font-mono tracking-widest">OR</p>
        <div className="h-px flex-1 bg-white/20"></div>
      </div>

      {/* Join Team Section */}
      <div className="flex flex-col items-center gap-6 w-full border border-white/20 p-8 sm:p-10 max-w-lg">
        <h4 className="text-lg font-bold uppercase tracking-wider text-white">Join Existing Team</h4>
        <input
          type="text"
          placeholder="JOINING CODE"
          value={teamCode}
          onChange={(e) => {
            setTeamCode(e.target.value);
          }}
          className="px-6 py-4 border border-white/20 bg-transparent text-white outline-none focus:border-red-400 transition-colors placeholder:text-white/40 font-light w-full"
        />
        <button
          onClick={(e) => {
            handleJoinTeam(e);
          }}
          disabled={loading}
          className="w-full border border-red-400 px-8 py-3 text-white hover:bg-red-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-widest uppercase text-sm font-bold"
        >
          {loading ? "JOINING..." : "JOIN TEAM"}
        </button>
      </div>
    </>
  )}
</div>
    );
}

export default NotRegistered;
