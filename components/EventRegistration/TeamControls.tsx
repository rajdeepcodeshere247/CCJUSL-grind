"use client";

import { useConfirmationDialogContext } from "@/hooks/useConfirmationDialog";
import { deleteTeam } from "@/services/EventsService";
import { Event, Team } from "@/types/events";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function TeamControls({ team, event }: { team: Team; event: Event }) {
    const modalContext = useConfirmationDialogContext();
    const router = useRouter();

    const handleCopyCode = () => {
        navigator.clipboard
            .writeText(team.joiningCode)
            .then(() => toast.success("Copied Joining Code"));
    };

    const handleDeleteTeam = () => {
        modalContext.showDialog(
            "Are you sure you want to delete this team?",
            () => {
                deleteTeam(team).then((res) => {
                    if (res.ok) {
                        toast.success(res.message);
                        router.refresh();
                    } else {
                        toast.error(res.message);
                    }
                });
            },
        );
    };

    return (
        <div className="flex w-full flex-col items-center gap-4">
            {event.maxMembers > 1 && (
                <div className="flex flex-col items-center gap-4 border-t border-b border-gray-200/30 p-4">
                    <p>Team Joining Code</p>
                    <div className="flex w-fit items-center justify-between gap-12 rounded-sm bg-gray-200/10 py-1.5 pr-2 pl-4 text-center">
                        <span>{team.joiningCode}</span>
                        <button
                            className="cursor-pointer rounded-sm border border-white/20 bg-black/80 px-2 py-1 text-sm transition-colors duration-200 hover:border-white/40 active:border-white/60"
                            onClick={() => handleCopyCode()}
                        >
                            Copy
                        </button>
                    </div>
                </div>
            )}
            <button
                className="border border-red-400 px-8 py-3 text-white hover:bg-red-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
                onClick={() => handleDeleteTeam()}
            >
                Delete Team
            </button>
        </div>
    );
}

export default TeamControls;
