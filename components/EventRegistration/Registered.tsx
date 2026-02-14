import { SessionUser } from "@/types/user";
import { Event, Team } from "@/types/events";
import React from "react";
import { TeamControls, EditTeamName } from "./TeamControls";
import NotRegistered from "./NotRegistered";
import MemberControls from "./MemberControls";
import LeaveTeam from "./LeaveTeam";
import PendingMemberControls from "./PendingMemberControls";

function Registered({
  user,
  event,
  team,
}: {
  user: SessionUser;
  event: Event;
  team: Team | null;
}) {
  if (!team) return <NotRegistered user={user} event={event} />;
  const isTeamLead = team.leader === user.id;

  let status: string;
  if (team.members.length === event.maxMembers) status = "Team full";
  else if (team.members.length >= event.minMembers) status = "Valid";
  else status = "Not enough members";

  return (
    <div className="flex h-full min-h-[80vh] flex-col items-center justify-center gap-10 px-4 py-6">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
        {event.name}
      </h1>

      <div className="flex w-full max-w-7xl flex-col gap-8 lg:flex-row">
        {/* Left Column - Team Members */}
        <div className="flex flex-1 flex-col">
          {/* Team Name Header */}
          <div className="mb-3 border border-white/20 px-2 py-6 flex justify-between items-center gap-3">
            <h4 className="text-2xl font-bold tracking-tight text-white">
              {team?.name}
            </h4>
            {isTeamLead && <EditTeamName teamId={team.id} />}
          </div>

          {/* Current Members Section */}
          <div className="space-y-2 border border-white/20 p-4">
            <h6 className="border-b border-white/10 pb-3 text-lg font-bold tracking-wider text-white uppercase">
              Team Members
            </h6>

            {/* Desktop Table Header */}
            <div className="hidden grid-cols-2 gap-4 border-b border-white/20 px-4 py-3 font-mono text-sm tracking-wider text-white/50 uppercase sm:grid">
              <p>Name</p>
              <p>Email</p>
            </div>

            {/* Members List */}
            {team?.members.map((member) => (
              <div
                key={member.id}
                className="border border-white/10 transition-colors hover:border-red-400/50"
              >
                <div className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-2 sm:gap-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <p className="font-mono text-xs tracking-wide text-white/50 uppercase sm:hidden">
                      Name
                    </p>
                    <p className="font-light text-white">
                      {member.name}
                      {member.id === team.leader && (
                        <span className="ml-2 bg-red-400 px-2 py-0.5 text-xs font-bold tracking-wide text-black uppercase">
                          Lead
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <p className="font-mono text-xs tracking-wide text-white/50 uppercase sm:hidden">
                      Email
                    </p>
                    <p className="text-sm font-light break-all text-white/70 sm:justify-self-end">
                      {member.email}
                    </p>
                  </div>
                </div>
                {isTeamLead && member.id !== team.leader && (
                  <div className="border-t border-white/10 px-4 py-3">
                    <MemberControls
                      memberId={member.id!}
                      memberName={member.name}
                      teamId={team.id}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pending Members Section */}
          {isTeamLead && team.pendingMembers.length !== 0 && (
            <div className="mt-4 space-y-2 border border-white/20 p-4">
              <h6 className="border-b border-white/10 pb-3 text-lg font-bold tracking-wider text-white uppercase">
                Pending Requests
              </h6>

              {/* Desktop Table Header */}
              <div className="hidden grid-cols-2 gap-4 border-b border-white/20 px-4 py-3 font-mono text-sm tracking-wider text-white/50 uppercase sm:grid">
                <p>Name</p>
                <p>Email</p>
              </div>

              {/* Pending Members List */}
              {team?.pendingMembers.map((member) => (
                <div
                  key={member.id}
                  className="border border-yellow-400/30 transition-colors hover:border-yellow-400/50"
                >
                  <div className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-2 sm:gap-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                      <p className="font-mono text-xs tracking-wide text-white/50 uppercase sm:hidden">
                        Name
                      </p>
                      <p className="font-light text-white">{member.name}</p>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                      <p className="font-mono text-xs tracking-wide text-white/50 uppercase sm:hidden">
                        Email
                      </p>
                      <p className="text-sm font-light break-all text-white/70 sm:justify-self-end">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  {isTeamLead && (
                    <div className="border-t border-white/10 px-4 py-3">
                      <PendingMemberControls
                        memberId={member.id!}
                        memberName={member.name}
                        teamId={team.id}
                        event={event}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Team Info & Controls */}
        <div className="flex w-full flex-col gap-6 lg:w-96">
          {/* Status Card */}
          <div
            className={`border p-6 ${status === "Not enough members" ? "border-yellow-400/50 bg-yellow-400/5" : "border-green-400/50 bg-green-400/5"}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${status === "Not enough members" ? "animate-pulse bg-yellow-400" : "bg-green-400"}`}
              ></div>
              <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                Status
              </h3>
            </div>
            <p
              className={`text-lg font-bold ${status === "Not enough members" ? "text-yellow-400" : "text-green-400"}`}
            >
              {status}
            </p>
          </div>

          {/* Team Size Info */}
          <div className="space-y-4 border border-white/20 p-6">
            <h3 className="border-b border-white/10 pb-3 text-sm font-bold tracking-wider text-white uppercase">
              Team Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-l-2 border-white/20 py-2 pl-4">
                <span className="font-mono text-sm tracking-wide text-white/50 uppercase">
                  Allowed Size
                </span>
                <span className="font-light text-white">
                  {event.minMembers === event.maxMembers
                    ? `${event.minMembers} member${event.minMembers !== 1 ? "s" : ""}`
                    : `${event.minMembers} - ${event.maxMembers} members`}
                </span>
              </div>
              <div className="flex items-center justify-between border-l-2 border-red-400 py-2 pl-4">
                <span className="font-mono text-sm tracking-wide text-white/50 uppercase">
                  Current Size
                </span>
                <span className="text-xl font-bold text-red-400">
                  {team?.members.length}
                </span>
              </div>
            </div>
          </div>

          {/* Team Controls */}
          <div className="border border-white/20 p-6">
            {isTeamLead ? (
              <TeamControls team={team} event={event} />
            ) : (
              <LeaveTeam teamId={team.id} id={user.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registered;
