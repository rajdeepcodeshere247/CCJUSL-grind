"use client";
import { signup } from "@/services/AuthService"; // You'll need to create this function
import { HCaptchaProvider, useHCaptcha } from "@hcaptcha/react-hcaptcha/hooks";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;

function Page() {
  return (
    <HCaptchaProvider sitekey={HCAPTCHA_SITEKEY} size="invisible">
      <SignUpForm />
    </HCaptchaProvider>
  );
}

function SignUpForm() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState("");
  const { ready, token, executeInstance } = useHCaptcha();

  const handleUpdate = (value: string, field: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      setStatus("Passwords don't match");
      return;
    }

    setStatus("Submitting..");

    executeInstance()
      .then((hCaptchaToken) => {
        return signup({
          id: "",
          name: data.name,
          email: data.email,
          password: data.password,
          registrationComplete: false,
          emailVerified: null,
          image: null,
        },
        hCaptchaToken??null
      );
      })
      .then((res) => {
        console.log(res);
        setStatus("Account created successfully");
        // Optionally redirect to login or dashboard
      })
      .catch((err) => {
        console.error(err);
        setStatus("Error occurred");
      });
  };

  const handleSignInWithGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("google")
      .then((res) => {
        console.log(res);
        setStatus("Account created successfully");
      })
      .catch((err) => {
        console.error(err);
        setStatus("Error occurred");
      });
  };

  return (
    <div className="font-jetbrains-mono flex flex-col items-center gap-8 p-12">
      <h1 className="my-8 text-4xl font-semibold">Sign Up</h1>
      <div className="flex flex-col items-center gap-8">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={data.name}
          onChange={(e) => handleUpdate(e.target.value, "name")}
          className="rounded-sm border px-2 py-1"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => handleUpdate(e.target.value, "email")}
          className="rounded-sm border px-2 py-1"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => handleUpdate(e.target.value, "password")}
          className="rounded-sm border px-2 py-1"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={data.confirmPassword}
          onChange={(e) => handleUpdate(e.target.value, "confirmPassword")}
          className="rounded-sm border px-2 py-1"
        />
        <button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          className="rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
        >
          Sign Up
        </button>
      </div>
      <div className="flex w-2/5 items-center justify-between gap-6">
        <div className="h-px w-full bg-white"></div>
        <p>OR</p>
        <div className="h-px w-full bg-white"></div>
      </div>
      <button
        onClick={(e) => handleSignInWithGoogle(e)}
        className="rounded-xs bg-white px-2 py-1 text-black transition-colors duration-300 hover:bg-white/90 active:bg-white/60"
      >
        Sign in with Google
      </button>
      <div className="flex justify-between gap-x-8 text-sm">
        <p>Already have an account?</p>
        <Link href={"/signin"} className="underline underline-offset-4">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default Page;
