"use client";

import React from "react";
import NotFound from "../NotFound";
import { useConfirmationDialogContext } from "@/hooks/useConfirmationDialog";
import { leavePendingTeam } from "@/services/EventsService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type PendingTeamData = {
  id: string;
  name: string;
  leader: {
    name: string;
    email: string;
  };
};

function Pending({
  teamData,
  eventName,
  userId,
  registrationsOpen,
}: {
  teamData: PendingTeamData | null;
  eventName: string;
  userId: string;
  registrationsOpen: boolean | undefined;
}) {
  const modalContext = useConfirmationDialogContext();
  const router = useRouter();
  if (!teamData) return <NotFound />;

  const handleLeaveTeam = () => {
    modalContext.showDialog("Are you sure you want to leave the team?", () => {
      leavePendingTeam(teamData.id, userId).then((res) => {
        if (res.ok) {
          toast.success("Left Team");
        } else {
          toast.error("Error in leaving team");
        }
        router.refresh();
      });
    });
  };

  return (
    <div className="flex h-full min-h-[80vh] flex-col items-center justify-center gap-10 px-4 py-6">
      {/* Header with decoration */}
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          {eventName}
        </h1>

        <div className="flex items-center justify-center gap-4 font-mono text-xs tracking-widest text-white/40">
          <div className="h-px w-16 bg-white/20"></div>
          <span>REGISTRATION STATUS</span>
          <div className="h-px w-16 bg-white/20"></div>
        </div>
      </div>

      {/* Status Message */}
      <div className="w-full max-w-2xl space-y-4 border border-white/20 p-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-3">
          <h2 className="text-2xl font-bold tracking-wide text-white uppercase">
            Registration Pending
          </h2>
        </div>
        <p className="leading-relaxed font-light text-white/60">
          The Team Lead must accept your application to join the team.
        </p>
      </div>

      {/* Team Information */}
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="w-full border border-white/20 p-6 text-center">
          <p className="mb-3 font-mono text-xs tracking-widest text-white/50 uppercase">
            Team Name
          </p>
          <p className="text-2xl font-bold text-white">{teamData.name}</p>
        </div>

        {/* Team Lead Details */}
        <div className="w-full space-y-4 border border-red-400/30 p-6">
          <h6 className="border-b border-white/10 pb-3 text-center text-lg font-bold tracking-wider text-white uppercase">
            Team Lead Details
          </h6>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-l-2 border-white/20 py-2 pl-4">
              <span className="font-mono text-sm tracking-wide text-white/50 uppercase">
                Name
              </span>
              <span className="font-light text-white">
                {teamData.leader.name}
              </span>
            </div>
            <div className="flex items-center justify-between border-l-2 border-white/20 py-2 pl-4">
              <span className="font-mono text-sm tracking-wide text-white/50 uppercase">
                Email
              </span>
              <span className="text-sm font-light text-white">
                {teamData.leader.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {registrationsOpen && (
        <button
          className="mt-4 border border-red-400 px-10 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all hover:bg-red-400 hover:text-black"
          onClick={() => handleLeaveTeam()}
        >
          Leave Team
        </button>
      )}
    </div>
  );
}

export default Pending;
