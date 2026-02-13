import type { User } from "./user";

type Event = {
    slug: string;
    id: string;
    name: string;
    minMembers: number;
    maxMembers: number;
};

type Team = {
    id: string;
    name: string;
    leader: string;
    members: User[];
    pendingMembers: User[];
    eventSlug: string;
    joiningCode: string;
};

enum RegistrationStatus {
    REGISTERED = "REGISTERED",
    PENDING = "PENDING",
    NOT_REGISTERED = "NOT_REGISTERED",
}

export { RegistrationStatus };
export type { Event, Team };
