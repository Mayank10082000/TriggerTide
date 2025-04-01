import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  isResettingPassword: false,
  isForgotPassword: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Successfully!");
    } catch (error) {
      console.log("Error in signup: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      console.log("Error in login: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Error in logout: ", error);
      toast.error(error.response.data.message);
    }
  },

  forgotPassword: async (email) => {
    set({ isForgotPassword: true });
    try {
      await axiosInstance.post("/auth/forgot-password", email);
      toast.success("Password reset link sent to your email");
      return true;
    } catch (error) {
      console.log("Error in forgot password: ", error);
      toast.error(
        error.response?.data?.message || "Failed to send reset email"
      );
      return false;
    } finally {
      set({ isForgotPassword: false });
    }
  },

  resetPassword: async (resetToken, newPassword) => {
    set({ isResettingPassword: true });
    try {
      await axiosInstance.post("/auth/reset-password", {
        resetToken,
        newPassword,
      });
      toast.success("Password reset successful");
      return true;
    } catch (error) {
      console.log("Error in reset password: ", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
      return false;
    } finally {
      set({ isResettingPassword: false });
    }
  },
}));
