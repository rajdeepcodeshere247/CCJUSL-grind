import { SessionUser } from "@/types/user";
import { Event, Team } from "@/types/events";
import React from "react";
import { TeamControls, EditTeamName } from "./TeamControls";
import NotRegistered from "./NotRegistered";
import MemberControls from "./MemberControls";
import LeaveTeam from "./LeaveTeam";
import PendingMemberControls from "./PendingMemberControls";
import { Megaphone, ExternalLink } from "lucide-react";

function parseInlineStyles(text: string): React.ReactNode[] {
  // Match bold (**), underline (__), italics (*), highlight (==), and raw URLs (fallback)
  const regex = /(\*\*.*?\*\*|__.*?__|\*.*?\*|==.*?==|https?:\/\/[^\s\n\r\)]+)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("__") && part.endsWith("__")) {
      return (
        <span key={index} className="underline decoration-red-400">
          {part.slice(2, -2)}
        </span>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic text-white/95">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("==") && part.endsWith("==")) {
      return (
        <mark key={index} className="bg-red-400/20 text-red-300 font-semibold px-1.5 py-0.5 rounded border border-red-500/20">
          {part.slice(2, -2)}
        </mark>
      );
    }
    if (part.match(/^https?:\/\/[^\s\n\r\)]+/)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-400 underline hover:text-red-300 break-all transition-colors"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

function parseInlineFormatting(text: string): React.ReactNode {
  // Regex to match markdown links: [Label](URL)
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...parseInlineStyles(text.substring(lastIndex, match.index)));
    }
    
    const label = match[1];
    const url = match[2];
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-red-400 bg-red-400/10 px-4 py-2 mt-1.5 mr-2 font-mono text-xs font-bold text-red-400 transition-all hover:bg-red-400 hover:text-black shadow-[0_0_15px_rgba(248,113,113,0.05)] hover:shadow-[0_0_20px_rgba(248,113,113,0.15)] rounded-sm"
      >
        <span>{label}</span>
        <ExternalLink size={12} />
      </a>
    );
    
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(...parseInlineStyles(text.substring(lastIndex)));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

function renderRegisteredMessage(message: string) {
  const lines = message.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-none pl-1 space-y-3 my-3">
          {listItems}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  lines.forEach((line, idx) => {
    const trimmedLine = line.trim();
    const bulletMatch = line.match(/^(\s*)[\*\-]\s+(.*)$/);
    
    if (bulletMatch) {
      inList = true;
      listItems.push(
        <li key={`li-${idx}`} className="flex items-start gap-3 text-sm font-light text-white/80">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400"></span>
          <span className="leading-relaxed">{parseInlineFormatting(bulletMatch[2])}</span>
        </li>
      );
    } else {
      if (inList) {
        flushList(idx);
      }
      
      if (trimmedLine) {
        elements.push(
          <div key={`p-${idx}`} className="text-sm font-light leading-relaxed my-2 text-white/90">
            {parseInlineFormatting(line)}
          </div>
        );
      } else {
        elements.push(<div key={`br-${idx}`} className="h-2" />);
      }
    }
  });

  if (inList) {
    flushList(lines.length);
  }

  return elements;
}

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
          {/* Announcements Card for Registered Users */}
          {event.registeredMessage && (
            <div className="mb-6 border border-red-500/20 bg-red-500/[0.01] hover:bg-red-500/[0.02] transition-colors p-6 shadow-[0_0_30px_rgba(239,68,68,0.03)] relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-red-500 via-red-400 to-transparent"></div>
              <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-red-500/50 to-transparent"></div>
              <h3 className="mb-4 flex items-center text-lg font-mono font-bold tracking-widest text-red-400 uppercase">
                <Megaphone className="mr-3 h-4 w-4 animate-pulse text-red-400" />
                CONTEST ANNOUNCEMENTS & LINKS
              </h3>
              <div className="space-y-1 text-white/85">
                {renderRegisteredMessage(event.registeredMessage)}
              </div>
            </div>
          )}

          {/* Team Name Header */}
          <div className="mb-3 border border-white/20 px-2 py-6 flex justify-between items-center gap-3">
            <h4 className="text-2xl font-bold tracking-tight text-white">
              {team?.name}
            </h4>
            {(isTeamLead && event.registrationsOpen) && <EditTeamName teamId={team.id} />}
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
                {(isTeamLead && member.id !== team.leader && event.registrationsOpen) && (
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
                  {(isTeamLead && event.registrationsOpen) && (
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
              <LeaveTeam teamId={team.id} id={user.id} registrationsOpen={event.registrationsOpen} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registered;
