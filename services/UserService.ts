"use server";
import { prisma } from "@/prisma/client";
import { getUserByEmail, verifyTurnstileToken } from "./AuthService";
import ShortUniqueId from "short-unique-id";
import { sendPasswordResetEmail, sendVerificationEmail } from "./EmailService";
import bcrypt from "bcryptjs";
import { SERVER_URL } from "@/utils/constants";
import { withAuth } from "@/utils/withAuth";
import { signOut } from "@/auth";
import z from "zod";

type RegistrationData = {
  phone: string;
  college: string;
  year: string;
  department: string;
};

const completeUserRegistration = withAuth(
  async (sessionUserId: string, data: RegistrationData, id: string) => {
    try {
      if (sessionUserId !== id) {
        signOut({
          redirectTo: "/signin",
        });
        throw new Error("Invalid session - id mismatch");
      }

      const RegistrationSchema = z.object({
        phone: z
          .string()
          .length(10, "Phone number must be 10 digits long")
          .regex(
            /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
            "Invalid phone number",
          ),
        college: z.string().min(1, "College is required"),
        year: z.string().min(1, "Year of Study is required"),
        department: z.string().min(1, "Department is required")
      });

      const isValid = RegistrationSchema.safeParse(data);
      if(!isValid.success){
        return {ok: false, message: "Invalid data"};
      }

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          phone: data.phone,
          year: data.year,
          college: data.college,
          department: data.department,
          registrationComplete: true,
          emailVerified: new Date(),
        },
      });
      return { ok: true, message: "Registration completed" };
    } catch (err) {
      console.error(`Error in completing user registration: ${err}`);
      return {
        ok: false,
        message: "Error occurred - failed to complete registration",
      };
    }
  },
);

const matchVerificationCode = withAuth(
  async (sessionUserId: string, email: string, code: string) => {
    try {
      const userToken = await prisma.user.findFirst({
        where: { email },
        select: { id: true, verificationToken: true },
      });
      const match =
        userToken?.verificationToken === code && userToken.id === sessionUserId;

      const verifiedAt = new Date();
      if (match)
        await prisma.user.update({
          where: { email },
          data: { emailVerified: verifiedAt },
        });
      return match;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
);

const verifyEmail = withAuth(async (sessionUserId: string, email: string) => {
  try {
    const token = new ShortUniqueId({ length: 8 }).rnd();
    await prisma.user.update({
      where: { id: sessionUserId, email, emailVerified: null },
      data: { verificationToken: token },
    });

    const result = await sendVerificationEmail(email, token);
    if (result)
      return { ok: true, message: "Email sent with verification code" };
    else return { ok: false, message: "Error in email verification" };
  } catch (err) {
    console.error(`Error in email verification: ${err}`);
    return { ok: false, message: "Error in email verification" };
  }
});

const handleForgotPassword = async (email: string, turnstileToken: string) => {
  try {
    const validCaptcha = await verifyTurnstileToken(turnstileToken);
    if(!validCaptcha) return false;
    
    const existingUser = await getUserByEmail(email);
    if (!existingUser) return false;

    const token = new ShortUniqueId({ length: 20 }).rnd();
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.resetPasswordToken.create({
      data: {
        user_id: existingUser.id,
        token,
        expiresAt: tokenExpiry,
      },
    });
    const link = `${SERVER_URL}/reset-password?token=${token}`;

    const res = await sendPasswordResetEmail(email, link);

    return res;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const verifyPasswordResetToken = async (token: string | null) => {
  try {
    if (!token) return { ok: false, id: null };
    const resetToken = await prisma.resetPasswordToken.findFirst({
      where: { token },
    });

    const currentDate = new Date();
    if (!resetToken || !resetToken.user_id) return { ok: false, id: null };
    const tokenValid = resetToken?.expiresAt > currentDate;
    if (!tokenValid) {
      await prisma.resetPasswordToken.delete({ where: { token } });
      return { ok: false, id: null };
    }

    return { ok: true, id: resetToken.user_id };
  } catch (err) {
    console.error(`Error while verifying password reset token: ${err}`);
    return { ok: false, id: null };
  }
};

const resetPassword = async (
  userId: string,
  password: string,
  token: string,
) => {
  try {
    const existingToken = await prisma.resetPasswordToken.delete({
      where: { token },
      select: { user_id: true },
    });
    if (existingToken.user_id !== userId)
      throw new Error("Invalid token - user id mismatch");

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { ok: true, message: "Password reset successfully" };
  } catch (err) {
    console.error(`Error while resetting password: ${err}`);
    return { ok: false, message: "Error occurred" };
  }
};

const editUserDetails = withAuth(
  async (
    sessionUserId: string,
    newDetails: {
      name: string;
      college: string;
      department: string;
      year: string;
      phone: string;
    },
  ) => {
    try {
      const RegistrationSchema = z.object({
        phone: z
          .string()
          .length(10, "Phone number must be 10 digits long")
          .regex(
            /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
            "Invalid phone number",
          ),
        college: z.string().min(1, "College is required"),
        year: z.string().min(1, "Year of Study is required"),
        department: z.string().min(1, "Department is required")
      });

      const isValid = RegistrationSchema.safeParse(newDetails);
      if(!isValid.success){
        return {ok: false, message: "Invalid data"};
      }

      await prisma.user.update({
        where: {
          id: sessionUserId,
        },
        data: newDetails,
      });
      return { ok: true, message: "Details updated succesfully" };
    } catch (err) {
      console.error("Error while updating user details - ", err);
      return { ok: false, message: "Error occurred - failed to edit details" };
    }
  },
);

export {
  completeUserRegistration,
  matchVerificationCode,
  verifyEmail,
  handleForgotPassword,
  verifyPasswordResetToken,
  resetPassword,
  editUserDetails,
};
