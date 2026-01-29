"use server";

import { prisma } from "@/prisma/client";
import { Event, SessionUser, Team } from "@/types";
import ShortUniqueId from "short-unique-id";

const getRegistrationStatus = async (userId: string, event: Event) => {
  const team = await prisma.team.findFirst({
    where: {
      eventSlug: event.slug,
      memberIds: {
        has: userId,
      },
    },
    select: {
      id: true,
      members: true,
      joiningCode: true,
      name: true,
      leader: true,
      eventSlug: true,
    },
  });
  if (!team) return { status: false, team: null };
  else return { status: true, team };
};

const getEventFromSlug = async (slug: string) => {
  const event = await prisma.event.findFirst({
    where: {
      slug,
    },
  });
  return event;
};

const createTeam = async (
  event: Event,
  user: SessionUser,
  teamName: string,
) => {
  if (!event) throw new Error("Invalid event");
  const existingTeam = await prisma.team.findFirst({
    where: {
      eventSlug: event.slug,
      name: teamName,
    },
  });
  if (existingTeam) throw new Error("Team name already taken");
  const short_uid = new ShortUniqueId({ length: 6 }).rnd();
  const joiningCode = `${event.slug}_${short_uid}`;
  const status = await prisma.team.create({
    data: {
      name: teamName,
      joiningCode,
      leader: user.id,
      eventSlug: event.slug,
      memberIds: [user.id],
    },
  });
  return status;
};

const joinTeam = async (event: Event, user: SessionUser, teamCode: string) => {
  const team = await prisma.team.findFirst({
    where: {
      joiningCode: teamCode,
    },
    select: {
      name: true,
      memberIds: true,
    },
  });
  if (!team) return { ok: false, message: "Invalid joining code" };
  if (team.memberIds.length === event.maxMembers)
    return { ok: false, message: "Team full" };
  team.memberIds.push(user.id);
  const status = await prisma.team.update({
    where: {
      joiningCode: teamCode,
    },
    data: team,
  });
  if (status) return { ok: true, message: `Joined team ${team.name}` };
  else
    return {
      ok: false,
      message: "Unknown error occurred. Please try again later",
    };
};

const completeRegistration = async (team: Team, event: Event) => {
  const eligible =
    team.members.length <= event.maxMembers &&
    team.members.length >= event.minMembers;
  if (!eligible) return { ok: false, message: "Not enough members." };
  await prisma.team.update({
    where: {
      id: team.id,
    },
    data: {
      complete: true,
    },
  });
  return { ok: true, message: "Registration complete!" };
};

const resetJoiningCode = async (team: Team) => {
  const shortUid = new ShortUniqueId({ length: 6 }).rnd();
  const joiningCode = `${team.eventSlug}_${shortUid}`;
  const status = await prisma.team.update({
    where: {
      id: team.id,
    },
    data: {
      joiningCode,
    },
  });
  if (!status) return { ok: false, code: null };
  else return { ok: true, code: joiningCode };
};

const transferTeamLead = async (team: Team, newLeadId: string) => {
  await prisma.team.update({
    where: {
      id: team.id,
    },
    data: {
      leader: newLeadId,
    },
  });
  return { ok: true, message: "Changed team lead successfully!" };
};

const removeMember = async (team: Team, memberId: string) => {
  const updatedMemberIds = team.members
    .filter((member) => member.id && member.id != memberId)
    .map((member) => member.id ?? "");
  await prisma.team.update({
    where: {
      id: team.id,
    },
    data: {
      memberIds: {
        set: updatedMemberIds,
      },
    },
  });
  return { ok: true, message: "Removed member" };
};

export {
  getRegistrationStatus,
  getEventFromSlug,
  createTeam,
  joinTeam,
  completeRegistration,
  resetJoiningCode,
  transferTeamLead,
  removeMember,
};
