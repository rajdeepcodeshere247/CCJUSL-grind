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
                className="bg-red hover:bg-red/70 active:bg-red/40"
                onClick={() => handleLeaveTeam()}
            >
                Leave Team
            </button>
        </div>
    );
}

export default LeaveTeam;
