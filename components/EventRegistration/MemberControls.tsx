"use client";

import { removeMember, transferTeamLead } from "@/services/EventsService";
import React from "react";
import { useConfirmationDialogContext } from "@/hooks/useConfirmationDialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function MemberControls({
  memberId,
  memberName,
  teamId,
}: {
  memberId: string;
  memberName: string;
  teamId: string;
}) {
  const modalContext = useConfirmationDialogContext();
  const router = useRouter();

  const handleTransferTeamLead = () => {
    modalContext.showDialog(
      `Are you sure you want to make ${memberName} team lead?`,
      () => {
        transferTeamLead(teamId, memberId).then((res) => {
          if(res.ok){
            toast.success(res.message);
            router.refresh();
          }else{
            toast.error(res.message);
          }
        });
      },
    );
  };
  const handleRemoveMember = () => {
    modalContext.showDialog(`Are you sure you want to remove ${memberName}?`, () => {
      removeMember(teamId, memberId).then((res) => {
        if(res.ok){
            toast.success(res.message);
            router.refresh();
          }else{
            toast.error(res.message);
          }
      });
    });
  };
  return (
    <div className="w-full flex justify-between">
      <button
        className="w-fit border border-red-400 px-2 py-1 text-sm transition-colors duration-300 hover:bg-red-400/30 active:bg-red-400/60"
        onClick={() => handleRemoveMember()}
      >
        Remove
      </button>
      <button
        className="w-fit border border-red-400 px-2 py-1 text-sm transition-colors duration-300 hover:bg-red-400/30 active:bg-red-400/60"
        onClick={() => handleTransferTeamLead()}
      >
        Make Team Lead
      </button>
    </div>
  );
}

export default MemberControls;
