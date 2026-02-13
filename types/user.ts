import { UserRole } from "@prisma/client";

type User = {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    email: string;
    registrationComplete: boolean;
    emailVerified: Date | null;
    image?: string | null;
    password?: string | null;
    role?: UserRole;
    year?: string | null;
    department?: string | null;
    phone?: string | null;
    college?: string | null;
    verificationToken?: string | null;
    teamIds?: string[];
    pendingTeamIds?: string[];
    wishlistedEventIds?: string[];
    workshopIds?: string[];
}

type SessionUser = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: UserRole;
    emailVerified: Date | null;
    registrationComplete: boolean;
}



export type {User, SessionUser};