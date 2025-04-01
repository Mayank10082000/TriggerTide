import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  UserPlus,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
} from "lucide-react";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup, isSigningUp, authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if already authenticated
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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

    if (validateForm()) {
      // The signup function from useAuthStore already handles toast notifications
      await signup(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-20">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-8 rounded-t-lg">
            <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
              <UserPlus className="h-6 w-6" />
              Create Your Account
            </h2>
            <p className="text-blue-100 text-center mt-2">
              Join us to start designing your email marketing sequences
            </p>
          </div>

          {/* Form Container */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      formErrors.fullName ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 bg-white`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.fullName && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs italic mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.fullName}
                  </p>
                )}
              </div>

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
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 bg-white`}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs italic mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  <Lock className="h-4 w-4" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      formErrors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 bg-white`}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs italic mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.password}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  <Lock className="h-4 w-4" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      formErrors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 bg-white`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs italic mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSigningUp ? (
                  <>
                    <Loader className="animate-spin mr-2 h-5 w-5" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Sign Up
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
