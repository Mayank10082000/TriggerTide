// This file contains the functions to generate and verify JWT tokens and used by authentication routes like login, register, and reset password.

import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // In miliseconds
    httpOnly: true, // Prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks - Cross Site Request Forgery attacks
    secure: process.env.NODE_ENV !== "development", // Only works on HTTPS
  });

  return token;
};
