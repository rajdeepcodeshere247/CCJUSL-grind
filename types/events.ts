import type { User } from "./user";

type Event = {
    slug: string;
    id: string;
    name: string;
    minMembers: number;
    maxMembers: number;
    registrationsOpen?: boolean;
    isLive?: boolean;
    description?: string | null;
    shortDescription?: string | null;
    rules?: string[];
    poster?: string | null;
    prize?: string | null;
    coordinators?: string[];
    prelimsDate?: string[];
    finalsDate?: string | null;
    updates?: string[];
    registrationCloseTime?: Date | string | null;
    registeredMessage?: string | null;
};

type Team = {
    id: string;
    name: string;
    leader: string;
    members: User[];
    pendingMembers: User[];
    eventSlug: string;
    joiningCode: string;
    event?: Event;
};

enum RegistrationStatus {
    REGISTERED = "REGISTERED",
    PENDING = "PENDING",
    NOT_REGISTERED = "NOT_REGISTERED",
}

export { RegistrationStatus };
export type { Event, Team };
