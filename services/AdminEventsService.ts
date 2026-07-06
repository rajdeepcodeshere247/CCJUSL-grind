"use server";

import { prisma } from "@/prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth();
  if (
    !session ||
    !session.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    throw new Error("Unauthorized");
  }
}

export async function getAllEvents() {
  await verifyAdmin();
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        slug: "asc",
      },
    });
    return { ok: true, events };
  } catch (err) {
    console.error("Error fetching all events: ", err);
    return { ok: false, message: "Failed to fetch events" };
  }
}

export async function getLiveEventsPublic() {
  try {
    const events = await prisma.event.findMany({
      where: {
        isLive: true,
      },
    });
    return events;
  } catch (err) {
    console.error("Error fetching live events: ", err);
    return [];
  }
}

export async function upsertLiveEvent(data: {
  slug: string;
  name: string;
  minMembers: number;
  maxMembers: number;
  registrationsOpen: boolean;
  isLive: boolean;
  description?: string;
  shortDescription?: string;
  rules?: string[];
  poster?: string;
  prize?: string;
  coordinators?: string[];
  prelimsDate?: string[];
  finalsDate?: string;
}) {
  await verifyAdmin();
  try {
    const { slug, ...fields } = data;
    const event = await prisma.event.upsert({
      where: { slug },
      update: {
        ...fields,
      },
      create: {
        slug,
        ...fields,
      },
    });
    revalidatePath("/events");
    revalidatePath(`/events/${slug}`);
    return { ok: true, message: "Event saved successfully", event };
  } catch (err) {
    console.error("Error upserting event: ", err);
    return { ok: false, message: "Failed to save event details" };
  }
}

export async function addEventUpdate(slug: string, updateText: string) {
  await verifyAdmin();
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      select: { updates: true },
    });
    if (!event) return { ok: false, message: "Event not found" };

    const updatedUpdates = [updateText, ...(event.updates || [])];

    await prisma.event.update({
      where: { slug },
      data: {
        updates: updatedUpdates,
      },
    });

    revalidatePath(`/events/${slug}`);
    return { ok: true, message: "Update added successfully" };
  } catch (err) {
    console.error("Error adding update: ", err);
    return { ok: false, message: "Failed to add update" };
  }
}

export async function deleteEventUpdate(slug: string, index: number) {
  await verifyAdmin();
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      select: { updates: true },
    });
    if (!event) return { ok: false, message: "Event not found" };

    const updatedUpdates = [...(event.updates || [])];
    updatedUpdates.splice(index, 1);

    await prisma.event.update({
      where: { slug },
      data: {
        updates: updatedUpdates,
      },
    });

    revalidatePath(`/events/${slug}`);
    return { ok: true, message: "Update deleted successfully" };
  } catch (err) {
    console.error("Error deleting update: ", err);
    return { ok: false, message: "Failed to delete update" };
  }
}

export async function getEventRegistrations(slug: string) {
  await verifyAdmin();
  try {
    const teams = await prisma.team.findMany({
      where: { eventSlug: slug },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            college: true,
            department: true,
            year: true,
          },
        },
        pendingMembers: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    return { ok: true, teams };
  } catch (err) {
    console.error("Error fetching registrations: ", err);
    return { ok: false, message: "Failed to fetch registrations" };
  }
}

export async function deleteEvent(slug: string) {
  await verifyAdmin();
  try {
    await prisma.event.delete({
      where: { slug },
    });
    revalidatePath("/events");
    return { ok: true, message: "Event deleted successfully" };
  } catch (err) {
    console.error("Error deleting event: ", err);
    return { ok: false, message: "Failed to delete event" };
  }
}
