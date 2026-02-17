export const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:3000";

export const CONST = {
    turnstile: {
        SITEKEY: process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY,
        SECRET: process.env.TURNSTILE_SECRET,
        VERIFICATION_URL: "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    },
    email: {
        USER: process.env.SMTP_USER,
        PASS: process.env.SMTP_PASS
    }
};