"use client";

import Loading from "@/components/Loading";
import Tooltip from "@/components/Tooltip";
import {
  resetPassword,
  verifyPasswordResetToken,
} from "@/services/UserService";
import { Info } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import z from "zod";

function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPassword />
    </Suspense>
  );
}

const PasswordResetSchema = z
  .object({
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

function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    verifyPasswordResetToken(token)
      .then((res) => {
        if (res.ok && res.id) setUserId(res.id);
        else router.push("/404");
      })
      .catch(() => {
        router.push("/404");
      });
  }, [token, router]);

  if (!token) {
    router.push("/404");
    return;
  }

  const handleChange = (field: string, value: string) => {
    setData((oldData) => ({ ...oldData, [field]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setErrors({ password: "", confirmPassword: "" });
    const isValid = PasswordResetSchema.safeParse(data);
    if (!isValid.success) {
      isValid.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          setErrors((oldErrors) => ({
            ...oldErrors,
            [issue.path[0]]: issue.message,
          }));
        }
      });
      setLoading(false);
      return;
    }
    toast("Submitting...");

    resetPassword(userId, data.password, token)
      .then((res) => {
        if (res.ok) {
          toast.success(res.message);
          redirect("/signin");
        } else toast.error(res.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex h-full min-h-[80vh] flex-col items-center justify-center gap-8 px-12">
      <h1 className="text-center text-5xl font-semibold">
        Reset your Password
      </h1>
      <div className="relative flex w-full flex-col items-center gap-2 sm:w-1/3 2xl:w-1/4">
        <div className="absolute top-1/2 -right-10 -translate-y-1/2">
          <Tooltip message="Password must be at least 8 characters long and must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character">
            <Info className="flex h-6 w-6 cursor-help items-center justify-center rounded-full text-xs text-white/60 transition-colors hover:text-red-400" />
          </Tooltip>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className="w-full border border-white/20 bg-transparent px-6 py-4 font-light text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-400"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={data.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          className="w-full border border-white/20 bg-transparent px-6 py-4 font-light text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-400 sm:w-1/3 2xl:w-1/4"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>
      <button
        className="border border-red-400 px-8 py-3 tracking-wide text-white transition-colors hover:bg-red-400/30 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => handleSubmit()}
        disabled={loading}
      >
        Submit
      </button>
    </div>
  );
}

export default Page;
