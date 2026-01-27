'use server';

import { User } from "@/types";
import bcrypt from "bcryptjs";
import {prisma} from "@/prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET;

const getUserByEmail = async (email: string | null) => {
  if(!email) return null;
  const user = await prisma.user.findFirst({ where: { email } });
  return user;
};

const validateUser = async (user: User | null, password: string) => {
    if (!user) throw new Error("Email not found");
    if(!user.password) throw new Error("Invalid password. Please check if you had signed in with Google");

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new Error("Incorrect Password");
    return true;
};

const signup = async (user: User, hCaptchaToken: string | null) => {
  if(!hCaptchaToken) return {ok: false, message: "Captcha Verification Failed"};

  const captchaBody = {
    secret: HCAPTCHA_SECRET,
    response: hCaptchaToken,
    sitekey: HCAPTCHA_SITEKEY
  };

  const captchaResponse = await fetch("https://api.hcaptcha.com/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "x-www-form-urlencoded"
    },
    body: JSON.stringify(captchaBody)
  });

  const captchaStatus = await captchaResponse.json();
  if(!captchaStatus.success) return {ok:false, message: "Captcha Verification Failed"};
  if(!user.password) return {ok: false, message: "Password is required"};
  const existingUser = await getUserByEmail(user.email);
  if(existingUser) return {ok: false, message: "Email already in use"};

  const hashedPassword = await bcrypt.hash(user.password, 12);
  user.password = hashedPassword;

  const createdUser = await prisma.user.create({
    data: user
  });

  if(createdUser) return {ok: true, message: "Signup successful"};
  return {ok: false, message: "Error in signup"};
}

const checkAuthentication = async (redirectUrl = "") => {
  const session = await auth();
  if(!session || !session.user || !session.user.id) redirect(`/signin?redirect=${redirectUrl}`);

  return session.user;
}

const checkAdminAuthorization = async () => {
  const session = await auth();
  if(!session || !session.user || !session.user.id || session.user.role !== "ADMIN") redirect("/signin");

  return session.user;
}

export { getUserByEmail, validateUser, signup, checkAuthentication, checkAdminAuthorization };