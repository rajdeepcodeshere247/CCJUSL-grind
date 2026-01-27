'use server';

import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import ShortUniqueId from "short-unique-id";
import { setVerificationCode } from "./UserService";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (mailOptions: MailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending registration email:", error);
    return false;
  }
};

const sendVerificationEmail = async (email: string) => {
  const code = new ShortUniqueId({length: 8}).rnd();

  await setVerificationCode(email, code);

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Verify your email for CodeClub JUSL",
    html: `<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e0e0e0; background-color: #ffffff;">
        <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px; margin-bottom: 30px;">Verify Email</h2>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Please use the following code to verify your email.
        </p>
        
        <div style="background-color: #f8f9fa; border-left: 4px solid #003366; padding: 20px; margin: 30px 0;">
          <h3 style="margin-top: 0; color: #003366; font-size: 18px; margin-bottom: 15px;">Participant Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; color: #333;">${code}</td>
            </tr>
        </div>
        
        <br/>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 14px; color: #666;">
          Kind regards,<br/>
          <strong>CodeClub JUSL</strong>
        </p>
      </div>`,
  };
  const result = await sendEmail(mailOptions);
  return result;
};

const sendPasswordResetEmail = async (email: string) => {
  const code = new ShortUniqueId({length: 12}).rnd();

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Password Reset for CodeClub JUSL",
    html: `<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e0e0e0; background-color: #ffffff;">
        <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px; margin-bottom: 30px;">Verify Email</h2>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Please use the following code to verify your email.
        </p>
        
        <div style="background-color: #f8f9fa; border-left: 4px solid #003366; padding: 20px; margin: 30px 0;">
          <h3 style="margin-top: 0; color: #003366; font-size: 18px; margin-bottom: 15px;">Participant Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; color: #333;">${code}</td>
            </tr>
        </div>
        
        <br/>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 14px; color: #666;">
          Kind regards,<br/>
          <strong>CodeClub JUSL</strong>
        </p>
      </div>`,
  };
  const result = await sendEmail(mailOptions);
  return result;
};

export { sendVerificationEmail, sendPasswordResetEmail };
