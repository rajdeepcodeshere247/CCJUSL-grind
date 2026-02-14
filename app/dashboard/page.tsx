import CompleteRegistration from "@/components/Dashboard/CompleteRegistration";
import Dashboard from "@/components/Dashboard/Dashboard";
import VerifyEmail from "@/components/Dashboard/VerifyEmail";
import { checkAuthentication, getUserByEmail } from "@/services/AuthService";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
    const user = await checkAuthentication("/dashboard");

    if (!user) {
        redirect("/signin");
    }

    if (!user.emailVerified)
        return (
            <SessionProvider>
                <VerifyEmail user={user} />
            </SessionProvider>
        );
    if (!user.registrationComplete)
        return <CompleteRegistration id={user.id} />;

    const fullUser = await getUserByEmail(user.email);
    if(!fullUser) redirect("/signin");

    return <Dashboard user={fullUser} />;
}

export default Page;