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
    <>
      <button
        className="w-fit rounded-xs bg-white px-2 py-1 text-sm text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
        onClick={() => handleAcceptMember()}
      >
        Accept
      </button>
      <button
        className="w-fit justify-self-end rounded-xs bg-white px-2 py-1 text-sm text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
        onClick={() => handleRejectMember()}
      >
        Reject
      </button>
    </>
  );
}

export default PendingMemberControls;
