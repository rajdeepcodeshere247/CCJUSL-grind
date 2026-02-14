"use client";

import { useConfirmationDialogContext } from "@/hooks/useConfirmationDialog";
import { leaveTeam } from "@/services/EventsService";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

function LeaveTeam({ teamId, id }: { teamId: string; id: string }) {
    const modalContext = useConfirmationDialogContext();
    const router = useRouter();

    const handleLeaveTeam = () => {
        modalContext.showDialog("Are you sure you want to leave this team?", () => {
            leaveTeam(teamId, id)
            .then(res => {
                if(res.ok){
                    toast.success(res.message);
                    router.refresh();
                }else{
                    toast.error(res.message);
                }
            })
        });
    };
    return (
        <div className="p-4 border-t border-t-gray-200/30 w-full grid place-items-center">
            <button
                className="border border-red-400 px-8 py-3 text-white hover:bg-red-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
                onClick={() => handleLeaveTeam()}
            >
                Leave Team
            </button>
        </div>
    );
}

export default LeaveTeam;
