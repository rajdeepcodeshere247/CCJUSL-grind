import { getAuthStatus } from "@/services/AuthService";
import { getRegistrationStatus } from "@/services/EventsService";
import { RegistrationStatus } from "@/types/events";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

async function RegistrationButton({
  registrationOpen,
  slug,
}: {
  registrationOpen: boolean;
  slug: string;
}) {
  const user = await getAuthStatus();
  const registrationStatus = user
    ? await getRegistrationStatus(user.id, slug)
    : RegistrationStatus.NOT_REGISTERED;

  if (registrationStatus !== RegistrationStatus.NOT_REGISTERED)
    return (
      <Link href={`/eventRegistration/${slug}`} className="border border-red-400 px-6 py-3 text-xl text-red-400">Registration Details</Link>
    );

  return (
    <>
      {registrationOpen ? (
        <Link
          href={`/eventRegistration/${slug}`}
          className="border border-red-400 px-6 py-3 text-xl text-red-400 lg:text-2xl 2xl:text-3xl"
        >
          Register
        </Link>
      ) : (
        <div className="inline-flex items-center border border-red-400/30 px-6 py-3 text-sm tracking-wide text-red-400">
          <AlertCircle className="mr-2 h-4 w-4" />
          REGISTRATION CLOSED
        </div>
      )}
    </>
  );
}

export default RegistrationButton;
