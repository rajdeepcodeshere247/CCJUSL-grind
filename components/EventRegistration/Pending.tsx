'use client';

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
    userId
}: {
    teamData: PendingTeamData | null;
    eventName: string;
    userId: string;
}) {
    const modalContext = useConfirmationDialogContext();
    const router = useRouter();
    if (!teamData) return <NotFound />;

    const handleLeaveTeam = () => {
        modalContext.showDialog("Are you sure you want to leave the team?", () => {
            leavePendingTeam(teamData.id, userId)
            .then(res => {
                if(res.ok){
                    toast.success("Left Team");
                }else{
                    toast.error("Error in leaving team");
                }
                router.refresh();
            })
        });
    }

    return (
        <div className="flex flex-col items-center justify-center gap-10 h-full min-h-[80vh] py-6 px-4">
  {/* Header with decoration */}
  <div className="text-center space-y-6">
    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
      {eventName}
    </h1>

    <div className="flex items-center justify-center gap-4 text-white/40 text-xs tracking-widest font-mono">
      <div className="h-px w-16 bg-white/20"></div>
      <span>REGISTRATION STATUS</span>
      <div className="h-px w-16 bg-white/20"></div>
    </div>
  </div>

  {/* Status Message */}
  <div className="text-center space-y-4 border border-white/20 p-8 max-w-2xl w-full">
    <div className="flex items-center justify-center gap-3 mb-2">
      <h2 className="text-2xl font-bold uppercase tracking-wide text-white">
        Registration Pending
      </h2>
    </div>
    <p className="text-white/60 font-light leading-relaxed">
      The Team Lead must accept your application to join the team.
    </p>
  </div>

  {/* Team Information */}
  <div className="flex flex-col items-center gap-8 w-full max-w-md">
    <div className="w-full border border-white/20 p-6 text-center">
      <p className="text-xs text-white/50 uppercase mb-3 tracking-widest font-mono">Team Name</p>
      <p className="text-2xl font-bold text-white">{teamData.name}</p>
    </div>

    {/* Team Lead Details */}
    <div className="w-full border border-red-400/30 p-6 space-y-4">
      <h6 className="text-lg font-bold uppercase tracking-wider text-center text-white border-b border-white/10 pb-3">
        Team Lead Details
      </h6>
      <div className="space-y-3">
        <div className="flex justify-between items-center border-l-2 border-white/20 pl-4 py-2">
          <span className="text-white/50 text-sm uppercase tracking-wide font-mono">Name</span>
          <span className="text-white font-light">{teamData.leader.name}</span>
        </div>
        <div className="flex justify-between items-center border-l-2 border-white/20 pl-4 py-2">
          <span className="text-white/50 text-sm uppercase tracking-wide font-mono">Email</span>
          <span className="text-white font-light text-sm">{teamData.leader.email}</span>
        </div>
      </div>
    </div>
  </div>

  {/* Action Button */}
  <button 
    className="border border-red-400 px-10 py-3 text-white hover:bg-red-400 hover:text-black transition-all tracking-widest uppercase text-sm font-bold mt-4" 
    onClick={() => handleLeaveTeam()}
  >
    Leave Team
  </button>
</div>
    );
}

export default Pending;
