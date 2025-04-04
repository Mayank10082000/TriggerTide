import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { KeyRound, Lock, Eye, EyeOff, AlertCircle, Loader } from "lucide-react";
import toast from "react-hot-toast";
import AnimatedAuthBackground from "../components/AnimatedAuthBackground";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showconfirmNewPassword, setShowconfirmNewPassword] = useState(false);

  const { resetPassword, isResetPassword, authUser } = useAuthStore();
  const navigate = useNavigate();
  const { resetToken } = useParams(); // Get reset token from URL

  useEffect(() => {
    // Redirect to home if already authenticated
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const validateForm = () => {
    // Reset form errors
    const errors = {};

    // Check if any required field is empty
    if (!formData.newPassword || !formData.confirmNewPassword) {
      // Set individual form errors for UI indicators
      if (!formData.newPassword)
        errors.newPassword = "New password is required";
      if (!formData.confirmNewPassword)
        errors.confirmNewPassword = "Confirm password is required";

      setFormErrors(errors);
      toast.error("All fields are required");
      return false;
    }

    // Validate password length
    if (
      formData.newPassword.length < 6 ||
      formData.confirmNewPassword.length < 6
    ) {
      setFormErrors({ newPassword: "Password must be at least 6 characters" });
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Check if passwords match
    if (formData.newPassword !== formData.confirmNewPassword) {
      setFormErrors({ confirmNewPassword: "Passwords do not match" });
      toast.error("Passwords do not match");
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
      const success = await resetPassword({
        resetToken,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });
      if (success) {
        // Redirect to login page after successful password reset
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
              Reset Your Password
            </h2>
            <p className="text-blue-100 text-center mt-1 text-sm">
              Create a new secure password
            </p>
          </div>

          {/* Form Container */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  <Lock className="h-4 w-4" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      formErrors.newPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 bg-white/80 backdrop-blur-sm`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmNewPassword"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  <Lock className="h-4 w-4" />
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showconfirmNewPassword ? "text" : "password"}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      formErrors.confirmNewPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 bg-white/80 backdrop-blur-sm`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() =>
                      setShowconfirmNewPassword(!showconfirmNewPassword)
                    }
                  >
                    {showconfirmNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isResetPassword}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-6"
              >
                {isResetPassword ? (
                  <>
                    <Loader className="animate-spin mr-2 h-5 w-5" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-5 w-5" />
                    Reset Password
                  </>
                )}
              </button>

              {/* Login Link */}
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </AnimatedAuthBackground>
  );
};

export default ResetPasswordPage;
