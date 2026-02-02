"use server";

import { prisma } from "@/prisma/client";
import { Event, SessionUser, Team } from "@/utils/types";
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
      allowResetCode: true
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
  try {
    if (!event) return { ok: false, message: "Invalid event" };
    const existingTeam = await prisma.team.findFirst({
      where: {
        eventSlug: event.slug,
        name: teamName,
      },
    });
    if (existingTeam) return { ok: false, message: "Team name already taken" };
    const short_uid = new ShortUniqueId({ length: 6 }).rnd();
    const joiningCode = `${event.slug}_${short_uid}`;
    await prisma.team.create({
      data: {
        name: teamName,
        joiningCode,
        leader: user.id,
        eventSlug: event.slug,
        memberIds: [user.id],
      },
    });
    return { ok: true, message: "Team created successfully" };
  } catch (err) {
    console.error(`Error while creating team: ${err}`);
    return { ok: false, message: "Error occurred" };
  }
};

const joinTeam = async (event: Event, user: SessionUser, teamCode: string) => {
  try {
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
    await prisma.team.update({
      where: {
        joiningCode: teamCode,
      },
      data: team,
    });
    return { ok: true, message: `Joined team ${team.name}` };
  } catch (err) {
    console.error(`Error while joining team: ${err}`);
    return { ok: false, message: "Error occurred" };
  }
};

/* const completeRegistration = async (team: Team, event: Event) => {
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
}; */

const resetJoiningCode = async (team: Team) => {
  try{
    const shortUid = new ShortUniqueId({ length: 6 }).rnd();
    const joiningCode = `${team.eventSlug}_${shortUid}`;
    await prisma.team.update({
      where: {
        id: team.id,
      },
      data: {
        joiningCode,
        allowResetCode: false
      },
    });
    return { ok: true, code: joiningCode };
  }catch(err){
    console.error(`Error while resetting joining code: ${err}`);
    return { ok: false, code: null };
  }
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
  resetJoiningCode,
  transferTeamLead,
  removeMember,
};
