"use client";

import Tooltip from "@/components/Tooltip";
import { handleForgotPassword } from "@/services/UserService";
import { CONST } from "@/utils/constants";
import { Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import z from "zod";

function Page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]',
      );
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const token = formData.get("cf-turnstile-response");

    if (!token) {
      toast.error("Captcha Verification failed");
      return;
    }

    const emailSchema = z.email();
    const isValid = emailSchema.safeParse(email);
    if (!isValid.success) {
      toast.error("Invalid Email");
      setLoading(false);
      return;
    }
    handleForgotPassword(email, token as string)
      .then(() => {
        toast("Please check your email for further instructions");
        setTimeout(
          () => {
            setLoading(false);
          },
          1000 * 60 * 2,
        );
      })
      .catch(() => {
        toast.error("Error occurred. Please try again later.");
      });
  };
  return (
    <form
      className="flex h-full min-h-[80vh] flex-col items-center justify-center gap-10 px-4"
      onSubmit={(e) => handleSubmit(e)}
    >
      {/* Title with timeline decoration */}
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center gap-4 font-mono text-xs tracking-widest text-white/40">
          <div className="h-px w-16 bg-white/20"></div>
          <span>PASSWORD RECOVERY</span>
          <div className="h-px w-16 bg-white/20"></div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
          Forgot Password
        </h1>
      </div>

      {/* Description */}
      <p className="max-w-md text-center leading-relaxed font-light text-white/60">
        If the email is registered, you will receive an email containing a link
        to a password reset page.
      </p>

      {/* Email Input */}
      <div className="w-full sm:w-1/2 md:w-1/3 2xl:w-1/4">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-white/20 bg-transparent px-6 py-4 font-light text-white transition-colors outline-none placeholder:text-white/40 focus:border-red-400"
          placeholder="EMAIL ADDRESS"
        />
      </div>

      <div
        className="cf-turnstile"
        data-sitekey={CONST.turnstile.SITEKEY}
        data-theme="dark"
        data-size="normal"
        data-callback="handleCaptchaVerification"
      ></div>

      {/* Submit Button */}
      <div className="relative">
        <button
          type="submit"
          className="border border-red-400 px-8 py-3 text-sm tracking-wide text-white transition-colors hover:bg-red-400/30 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "SENDING..." : "SEND EMAIL"}
        </button>

        {loading && (
          <div className="absolute top-1/2 -right-12 -translate-y-1/2">
            <Tooltip message="Please wait for 2 minutes before sending another email">
              <Info className="flex h-6 w-6 cursor-help items-center justify-center rounded-full text-xs text-white/60 transition-colors hover:text-red-400" />
            </Tooltip>
          </div>
        )}
      </div>
    </form>
  );
}

export default Page;
