"use client";

import { SessionUser } from "@/types/user";
import { Event } from "@/types/events";
import React, { useState } from "react";
import { createTeam, joinTeam } from "@/services/EventsService";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function NotRegistered({ user, event }: { user: SessionUser; event: Event }) {
  const searchParams = useSearchParams();
  const joiningCode = searchParams.get("joiningCode");
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState(joiningCode ?? "");
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
    <div className="flex h-full min-h-[80vh] flex-col items-center justify-center gap-8 p-4">
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
        {event.name}
      </h1>

      {/* Create Team Section */}
      <div className="flex w-full max-w-lg flex-col items-center gap-6 border border-white/20 p-8 sm:p-10">
        <h4 className="text-lg font-bold tracking-wider text-white uppercase">
          Create New Team
        </h4>
        <input
          type="text"
          placeholder="TEAM NAME"
          value={teamName}
          onChange={(e) => {
            setTeamName(e.target.value);
          }}
          className="w-full border border-white/20 bg-transparent px-6 py-4 font-light text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-400"
        />
        <button
          onClick={(e) => {
            handleCreateTeam(e);
          }}
          disabled={loading}
          className="w-full border border-red-400 px-8 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all hover:bg-red-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "CREATING..." : "CREATE TEAM"}
        </button>
      </div>

      {event.maxMembers > 1 && (
        <>
          {/* Divider */}
          <div className="flex w-full max-w-lg items-center justify-center gap-6">
            <div className="h-px flex-1 bg-white/20"></div>
            <p className="font-mono text-sm tracking-widest text-white/40">
              OR
            </p>
            <div className="h-px flex-1 bg-white/20"></div>
          </div>

          {/* Join Team Section */}
          <div className="flex w-full max-w-lg flex-col items-center gap-6 border border-white/20 p-8 sm:p-10">
            <h4 className="text-lg font-bold tracking-wider text-white uppercase">
              Join Existing Team
            </h4>
            <input
              type="text"
              placeholder="JOINING CODE"
              value={teamCode}
              onChange={(e) => {
                setTeamCode(e.target.value);
              }}
              className="w-full border border-white/20 bg-transparent px-6 py-4 font-light text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-400"
            />
            <button
              onClick={(e) => {
                handleJoinTeam(e);
              }}
              disabled={loading}
              className="w-full border border-red-400 px-8 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all hover:bg-red-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
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
