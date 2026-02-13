import {auth} from "@/auth";

export function withAuth<T extends unknown[], R>(
    fn: (sessionUserId: string, ...args: T) => Promise<R>
) {
    return async (...args: T): Promise<R> => {
        const session = await auth();

        if (!session?.user) {
            throw new Error("You must be logged in to access this resource");
        }

        return fn(session.user.id as string, ...args);
    };
}
