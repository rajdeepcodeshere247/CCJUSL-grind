"use client";

import { matchVerificationCode, verifyEmail } from "@/services/UserService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { User } from "@/types/user";
import { updateVerification } from "@/services/AuthService";
import toast from "react-hot-toast";

function VerifyEmail({ user }: { user: User }) {
  const email = user.email;
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (code.length !== 8) {
      toast.error("Invalid code");
      return;
    }
    toast.loading("Verifying code...");
    matchVerificationCode(email, code)
      .then((res) => {
        toast.dismiss();
        if (res) updateVerification().then(() => router.refresh());
        else toast.error("Invalid Code");
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Error occurred while verifying code")
      });
  };

  const handleSendCode = () => {
    setCodeSent(true);
    toast.loading("Sending email...");
    verifyEmail(email)
      .then((res) => {
        toast.dismiss();
        if (res.ok) toast.success(res.message);
        else toast.error(res.message);
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Error occurred");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full min-h-[80vh]">
      <div className="flex items-center justify-center gap-4 text-white/40 text-xs tracking-widest font-mono">
          <div className="h-px w-16 bg-white/20"></div>
          <span>EMAIL VERIFICATION</span>
          <div className="h-px w-16 bg-white/20"></div>
        </div>
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-center">Verify your email</h1>
      <p className="text-center text-white/60">An email will be sent to your registered email address with a code.</p>
      <button
        className="border border-red-400 px-8 py-3 text-white hover:bg-red-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
        onClick={() => handleSendCode()}
        disabled={codeSent}
      >
        Send Email
      </button>
      <input
        type="text"
        name="code"
        placeholder="Enter Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="px-6 py-4 border border-white/20 bg-transparent text-white outline-none focus:border-red-400 transition-colors placeholder:text-white/40 font-light w-full sm:w-1/3 2xl:w-1/4"
      />
      <button
        className="border border-red-400 px-8 py-3 text-white hover:bg-red-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
        onClick={() => handleSubmit()}
      >
        Verify Code
      </button>
    </div>
  );
}

export default VerifyEmail;
