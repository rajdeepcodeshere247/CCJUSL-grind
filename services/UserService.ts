'use server';
import { prisma } from "@/prisma/client";

type RegistrationData = {
    phone: string;
    college: string;
    year: string;
    department: string;
}

const completeUserRegistration = async (data: RegistrationData, id: string) => {
    const status = await prisma.user.update({
        where: {
            id
        },
        data: {
            phone: data.phone,
            year: data.year,
            college: data.college,
            department: data.department
        }
    });
    return {ok: true, message: "Registration completed"};
}

const setVerificationCode = async (email: string, token: string) => {
    const status = await prisma.user.update({where: {email}, data: {verificationToken: token}});
    return {ok: true, message: "Token set"};
}

const matchVerificationCode = async (email: string, code: string) => {
    const userToken = await prisma.user.findFirst({where: {email}, select: {verificationToken: true}});
    const match =  userToken?.verificationToken === code;

    const verifiedAt = new Date();
    if(match) await prisma.user.update({where: {email}, data: {emailVerified: verifiedAt}});
    return match;
}

export {completeUserRegistration, setVerificationCode, matchVerificationCode};