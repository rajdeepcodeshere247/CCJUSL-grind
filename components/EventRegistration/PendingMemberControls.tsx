"use client";

import { acceptPendingMember, rejectPendingMember } from "@/services/EventsService";
import React from "react";
import { useConfirmationDialogContext } from "@/hooks/useConfirmationDialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Event } from "@/types/events";

function PendingMemberControls({
  memberId,
  memberName,
  teamId,
  event
}: {
  memberId: string;
  memberName: string;
  teamId: string;
  event: Event
}) {
  const modalContext = useConfirmationDialogContext();
  const router = useRouter();

  const handleAcceptMember = () => {
    modalContext.showDialog(
      `Are you sure you want to accept ${memberName}?`,
      () => {
        acceptPendingMember(teamId, memberId, event).then((res) => {
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

  const handleRejectMember = () => {
    modalContext.showDialog(`Are you sure you want to reject ${memberName}?`, () => {
      rejectPendingMember(teamId, memberId).then((res) => {
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
        onClick={() => handleAcceptMember()}
      >
        Accept
      </button>
      <button
        className="w-fit border border-red-400 px-2 py-1 text-sm transition-colors duration-300 hover:bg-red-400/30 active:bg-red-400/60"
        onClick={() => handleRejectMember()}
      >
        Reject
      </button>
    </div>
  );
}

export default PendingMemberControls;
