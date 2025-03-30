// This file is responsible for sending emails, specifically for password reset functionality.
// It uses the nodemailer package to send emails and dotenv for environment variable management.

import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., "gmail"
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (email, resetToken, req) => {
  try {
    // Get the origin from request headers or fallback to env variable
    const origin = req.headers.origin || process.env.FRONTEND_URL || "";

    // Construct the reset URL using the request origin
    const resetUrl = `${origin}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
