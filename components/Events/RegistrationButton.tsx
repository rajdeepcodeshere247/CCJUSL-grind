import { getAuthStatus } from "@/services/AuthService";
import { getRegistrationStatus } from "@/services/EventsService";
import { RegistrationStatus } from "@/types/events";
import { events } from "@/data/events"; // 1. Import the local events array
import Link from "next/link";
import React from "react";

async function RegistrationButton({
  registrationOpen,
  slug,
}: {
  registrationOpen: boolean;
  slug: string;
}) {
  // 2. Find the current event locally by its slug
  const localEvent = events.find((e) => e.slug === slug);

  // 3. FORCE it to vanish if the local event status is "Closed"
  if (localEvent?.status === "Closed") return null;

  const user = await getAuthStatus();
  const registrationStatus = user
    ? (await getRegistrationStatus(user.id, slug)).status
    : RegistrationStatus.NOT_REGISTERED;

  if (registrationStatus !== RegistrationStatus.NOT_REGISTERED)
    return (
      <Link href={`/eventRegistration/${slug}`} className="border border-red-400 px-6 py-3 text-xl text-red-400">
        Registration Details
      </Link>
    );

  // Fallback check
  if (!registrationOpen) return null;

  return (
    <Link
      href={`/eventRegistration/${slug}`}
      className="border border-red-400 px-6 py-3 text-xl text-red-400 lg:text-2xl 2xl:text-3xl"
    >
      Register
    </Link>
  );
}

export default RegistrationButton;