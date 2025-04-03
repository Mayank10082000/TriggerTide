import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { KeyRound, Mail, AlertCircle, Loader } from "lucide-react";
import toast from "react-hot-toast";
import AnimatedAuthBackground from "../components/AnimatedAuthBackground";

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const { forgotPassword, isForgotPassword, authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if already authenticated
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const validateForm = () => {
    // Reset form errors
    const errors = {};

    // Check if email is empty
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      setFormErrors(errors);
      toast.error("Email is required");
      return false;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormErrors({ email: "Email is invalid" });
      toast.error("Email is invalid");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (isValid) {
      const success = await forgotPassword(formData);
      if (success) {
        // Optional: Clear form or navigate to login
        navigate("/login");
      }
    }
  };

  return (
    <AnimatedAuthBackground>
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300 border border-white/20">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-5">
            <h2 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
              <KeyRound className="h-5 w-5" />
              Forgot Password
            </h2>
            <p className="text-blue-100 text-center mt-1 text-sm">
              Enter your email to reset your password
            </p>
          </div>

          {/* Form Container */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 bg-white/80 backdrop-blur-sm`}
                    placeholder="Enter your registered email"
                  />
                  {formErrors.email && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send a password reset link to this email
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isForgotPassword}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-6"
              >
                {isForgotPassword ? (
                  <>
                    <Loader className="animate-spin mr-2 h-5 w-5" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-5 w-5" />
                    Reset Password
                  </>
                )}
              </button>

              {/* Login and Signup Links */}
              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
                  >
                    Back to Login
                  </Link>
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AnimatedAuthBackground>
  );
};

export default ForgotPasswordPage;
