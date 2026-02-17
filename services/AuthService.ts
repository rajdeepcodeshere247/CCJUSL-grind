"use server";

import { User } from "@/types/user";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/client";
import { auth, signIn, unstable_update } from "@/auth";
import { redirect } from "next/navigation";
import { CONST, SERVER_URL } from "@/utils/constants";
import { AuthError } from "next-auth";
import { UserRole } from "@prisma/client";
import { withAuth } from "@/utils/withAuth";
import z from "zod";

const getUserByEmail = async (email: string | null) => {
  if (!email) return null;
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      teams: {
        select: {
          id: true,
          name: true,
          eventSlug: true,
          event: true,
        },
      },
      pendingTeams: {
        select: {
          id: true,
          name: true,
          eventSlug: true,
          event: true,
        },
      },
    },
  });
  return user;
};

const validateUser = async (
  existingPassword: string | null,
  password: string,
) => {
  if (!existingPassword) return false;

  const passwordMatch = await bcrypt.compare(password, existingPassword);

  if (!passwordMatch) return false;
  return true;
};

const handleSignin = async (email: string, password: string) => {
  if (!email || !password)
    return { ok: false, message: "Email and password required" };
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { ok: true, message: "Login successful" };
  } catch (err) {
    console.error(err);
    if (err instanceof AuthError && err.type === "CredentialsSignin")
      return { ok: false, message: "Invalid credentials" };
    else return { ok: false, message: "Error in login" };
  }
};

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
}

const verifyTurnstileToken = async (token: string) => {
  if(!token) return false;
  try{
    const response = await fetch(CONST.turnstile.VERIFICATION_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        secret: CONST.turnstile.SECRET,
        response: token
      })
    });
    const data = await response.json() as TurnstileResponse;
    if(!data.success) console.error("Error while validatin turnstile token: ", data["error-codes"]);
    if(data.hostname !== SERVER_URL){
      console.error("Invalid turnstile hostname: ", data.hostname);
      return false;
    }
    return data.success;
  }catch(err){
    console.error("Error while validating turnstile token: ", err);
  }
}

const signup = async (user: User, turnstileToken: string) => {
  try {
    const UserSchema = z
      .object({
        name: z.string().min(1, "Name is required"),
        email: z.email("Invalid email"),
        password: z
          .string()
          .regex(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            "Weak Password",
          ),
        confirmPassword: z.string(),
        
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    const isValid = UserSchema.safeParse(user);
    if (!isValid) return { ok: false, message: "Invalid data" };

    const validCaptcha = await verifyTurnstileToken(turnstileToken);
    if (!validCaptcha)
      return { ok: false, message: "Captcha Verification Failed" };

    if (!user.password) return { ok: false, message: "Password is required" };

    const existingUser = await getUserByEmail(user.email);
    if (existingUser) return { ok: false, message: "Email already in use" };

    const hashedPassword = await bcrypt.hash(user.password, 12);
    const newUser = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      registrationComplete: false,
      emailVerified: null,
      image: null,
      role: UserRole.USER,
    };

    await prisma.user.create({ data: newUser });

    try {
      await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });
    } catch (err) {
      console.error(err);
      return {
        ok: false,
        message: "Error in login after signup, please login manually",
      };
    }

    return { ok: true, message: "Signup successful" };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "Error in signup" };
  }
};

const checkAuthentication = async (redirectUrl = "") => {
  const session = await auth();
  const encodedRedirectUrl = encodeURIComponent(redirectUrl);
  if (!session || !session.user || !session.user.id)
    redirect(`/signin?redirect=${encodedRedirectUrl}`);

  if (redirectUrl.indexOf("dashboard") !== -1) return session.user;

  if (!session.user.emailVerified || !session.user.registrationComplete)
    redirect(`/dashboard?redirect=${encodedRedirectUrl}`);

  return session.user;
};

const checkAdminAuthorization = async () => {
  const session = await auth();
  if (
    !session ||
    !session.user ||
    !session.user.id ||
    session.user.role !== "ADMIN"
  )
    redirect("/signin");

  return session.user;
};

const checkRegistrationStatus = async (id: string | undefined) => {
  if (!id) return { emailVerified: null, registrationComplete: false };
  const user = await prisma.user.findUnique({
    where: { id },
    select: { emailVerified: true, registrationComplete: true },
  });
  if (!user) return { emailVerified: null, registrationComplete: false };
  return user;
};

const updateVerification = withAuth(async () => {
  const res = await unstable_update({ user: { emailVerified: new Date() } });
  return res;
});

const updateRegistrationStatus = withAuth(async () => {
  const res = await unstable_update({ user: { registrationComplete: true } });
  return res;
});

const getAuthStatus = async () => {
  const session = await auth();
  return session?.user;
};

export {
  getUserByEmail,
  validateUser,
  handleSignin,
  verifyTurnstileToken,
  signup,
  checkAuthentication,
  checkAdminAuthorization,
  checkRegistrationStatus,
  updateVerification,
  updateRegistrationStatus,
  getAuthStatus,
};
