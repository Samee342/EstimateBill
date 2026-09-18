import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaLock,
  FaEnvelope,
  FaShieldAlt,
  FaUserCog,
  FaUserTie,
} from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { loginUser } from "../../utils/auth";
import Logo from "../../assets/Logo.png";
import LoginImage from "../../assets/LoginImage.jpeg";

const LoginPage = () => {
  const navigate = useNavigate();

  // =========================
  // FORM STATE
  // =========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Helper to quick-fill demo credentials
  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  // =========================
  // LOGIN HANDLER
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const user = loginUser(email.trim(), password);

      if (user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else if (user.role === "staff") {
        navigate("/staff", { replace: true });
      } else {
        setError("Invalid user role assigned.");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4 font-sans sm:p-6 lg:p-8">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
        {/* =====================================================
            LEFT SIDE - SIMPLE LOGIN IMAGE
        ====================================================== */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-orange-50/50 p-8 border-r border-gray-200">
          <img
            src={LoginImage}
            alt="PrintTech Workspace"
            className="h-full max-h-[500px] w-full object-contain"
          />
        </div>

        {/* =====================================================
            RIGHT SIDE - LOGIN FORM (WITH BORDER & LIGHT THEME)
        ====================================================== */}
        <div className="flex w-full flex-col justify-between bg-white p-6 border-l border-gray-200 sm:p-10 lg:w-1/2 xl:p-12">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-md">
                <img
                  src={Logo}
                  alt="PrintTech Logo"
                  className="h-5 w-5 object-contain brightness-200"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Print<span className="text-orange-500">Tech</span>
                </h1>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-orange-500">
                Welcome back
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Sign in to PrintTech
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Enter your email and password to access your dashboard.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700"
                >
                  Email Address
                </label>
                <div className="group relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-orange-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-bold uppercase tracking-wide text-gray-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="group relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-orange-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:text-orange-500 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 px-4 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Buttons */}
            <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-700">
                Demo Accounts (Click to autofill)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fillDemo("admin@printtech.com", "admin123")}
                  className="flex flex-col items-start rounded-xl border border-gray-200 bg-white p-3 text-left transition hover:border-orange-500 hover:shadow-sm"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                    <FaUserCog className="text-orange-500" /> Admin
                  </div>
                  <span className="mt-1 text-[11px] text-gray-500">
                    admin@printtech.com
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo("staff@printtech.com", "staff123")}
                  className="flex flex-col items-start rounded-xl border border-gray-200 bg-white p-3 text-left transition hover:border-orange-500 hover:shadow-sm"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                    <FaUserTie className="text-orange-500" /> Staff
                  </div>
                  <span className="mt-1 text-[11px] text-gray-500">
                    staff@printtech.com
                  </span>
                </button>
              </div>
            </div>

            {/* Register Link & Security Badge */}
            <div className="mt-6 text-center space-y-4">
              <p className="text-xs text-gray-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-bold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Create Account
                </button>
              </p>

              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <FaShieldAlt className="text-[10px]" />
                <span>Your login information is secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
