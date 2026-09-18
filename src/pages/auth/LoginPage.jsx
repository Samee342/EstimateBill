
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowRight,
  FaCheckCircle,
  FaLock,
  FaPrint,
  FaUser,
} from "react-icons/fa";

import {
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { loginUser } from "../../utils/auth";

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

  // =========================
  // LOGIN
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // Validate fields
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // Login through existing auth system
      const user = loginUser(
        email.trim(),
        password
      );

      // =========================
      // ROLE BASED REDIRECT
      // =========================

      if (user.role === "admin") {
        navigate("/dashboard", {
          replace: true,
        });
      } else if (user.role === "staff") {
        navigate("/staff", {
          replace: true,
        });
      } else {
        setError("Invalid user role.");
      }
    } catch (error) {
      setError(
        error.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-4 sm:p-6 lg:p-8">
      <div
        className="
          mx-auto flex min-h-[calc(100vh-2rem)]
          max-w-7xl overflow-hidden rounded-3xl
          bg-white
          shadow-[0_20px_70px_rgba(0,0,0,0.10)]
        "
      >

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div
          className="
            relative hidden w-1/2
            overflow-hidden bg-[#f97316]
            lg:flex
          "
        >

          {/* Background Decoration */}

          <div
            className="
              absolute -right-32 -top-32
              h-96 w-96 rounded-full
              bg-orange-400/40
            "
          />

          <div
            className="
              absolute -bottom-40 -left-40
              h-[500px] w-[500px]
              rounded-full
              bg-orange-700/30
            "
          />

          {/* Content */}

          <div
            className="
              relative z-10 flex w-full
              flex-col justify-between
              p-10 xl:p-14
            "
          >

            {/* =================================================
                LOGO
            ================================================== */}

            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl bg-white
                  text-orange-500
                  shadow-lg
                "
              >
                <FaPrint className="text-lg" />
              </div>

              <div>
                <h1
                  className="
                    text-xl font-bold
                    tracking-tight text-white
                  "
                >
                  PrintTech
                </h1>

                <p className="text-xs text-orange-100">
                  Print Business Management
                </p>
              </div>
            </div>

            {/* =================================================
                MAIN CONTENT
            ================================================== */}

            <div className="max-w-lg">

              {/* Badge */}

              <div
                className="
                  mb-6 inline-flex
                  items-center gap-2
                  rounded-full
                  border border-white/20
                  bg-white/10
                  px-4 py-2
                  backdrop-blur-sm
                "
              >
                <span
                  className="
                    h-2 w-2 rounded-full
                    bg-green-300
                  "
                />

                <span
                  className="
                    text-sm font-medium text-white
                  "
                >
                  Smart Printing Management
                </span>
              </div>

              {/* Heading */}

              <h2
                className="
                  text-4xl font-bold
                  leading-tight text-white
                  xl:text-5xl
                "
              >
                Manage your
                <br />
                printing business
                <br />

                <span className="text-orange-100">
                  smarter.
                </span>
              </h2>

              <p
                className="
                  mt-6 max-w-md
                  text-base leading-7
                  text-orange-50
                "
              >
                Manage projects, customers, orders
                and business operations from one
                simple and powerful platform.
              </p>

              {/* Features */}

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-orange-100" />

                  <span className="text-sm text-white">
                    Manage projects and orders
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-orange-100" />

                  <span className="text-sm text-white">
                    Track customers and payments
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-orange-100" />

                  <span className="text-sm text-white">
                    Powerful business reports
                  </span>
                </div>

              </div>
            </div>

            {/* =================================================
                BOTTOM
            ================================================== */}

            <div
              className="
                flex items-center
                justify-between
                text-xs text-orange-100
              "
            >
              <span>
                © 2026 PrintTech
              </span>

              <span
                className="
                  rounded-full
                  bg-white/10
                  px-3 py-1.5
                  backdrop-blur-sm
                "
              >
                Business Management System
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE - LOGIN
        ====================================================== */}

        <div
          className="
            flex w-full
            items-center justify-center
            px-5 py-10
            sm:px-10
            lg:w-1/2
            xl:px-20
          "
        >
          <div className="w-full max-w-md">

            {/* =================================================
                MOBILE LOGO
            ================================================== */}

            <div
              className="
                mb-10 flex items-center
                gap-3 lg:hidden
              "
            >
              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  bg-orange-500
                  text-white
                  shadow-lg
                "
              >
                <FaPrint />
              </div>

              <div>
                <h1
                  className="
                    text-xl font-bold
                    text-gray-900
                  "
                >
                  PrintTech
                </h1>

                <p className="text-xs text-gray-500">
                  Print Business Management
                </p>
              </div>
            </div>

            {/* =================================================
                HEADING
            ================================================== */}

            <div className="mb-8">
              <p
                className="
                  mb-3 text-sm
                  font-semibold uppercase
                  tracking-wider
                  text-orange-500
                "
              >
                Welcome back
              </p>

              <h2
                className="
                  text-3xl font-bold
                  tracking-tight
                  text-gray-900
                  sm:text-4xl
                "
              >
                Sign in to your account
              </h2>

              <p
                className="
                  mt-3 text-sm
                  leading-6 text-gray-500
                "
              >
                Enter your details to continue
                managing your printing business.
              </p>
            </div>

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div
                className="
                  mb-5 rounded-xl
                  border border-red-200
                  bg-red-50 px-4 py-3
                "
              >
                <p
                  className="
                    text-sm font-medium
                    text-red-600
                  "
                >
                  {error}
                </p>
              </div>
            )}

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2 block
                    text-sm font-semibold
                    text-gray-700
                  "
                >
                  Email Address
                </label>

                <div className="group relative">

                  <FaUser
                    className="
                      absolute left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      transition
                      group-focus-within:text-orange-500
                    "
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={loading}
                    className="
                      w-full rounded-xl
                      border border-gray-200
                      bg-gray-50
                      py-3.5 pl-11 pr-4
                      text-sm text-gray-900
                      outline-none transition
                      placeholder:text-gray-400
                      focus:border-orange-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-orange-100
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />
                </div>
              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div>
                <div
                  className="
                    mb-2 flex
                    items-center
                    justify-between
                  "
                >
                  <label
                    htmlFor="password"
                    className="
                      block text-sm
                      font-semibold
                      text-gray-700
                    "
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/forgot-password")
                    }
                    className="
                      text-xs font-semibold
                      text-orange-500
                      transition
                      hover:text-orange-600
                    "
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="group relative">

                  <FaLock
                    className="
                      absolute left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      transition
                      group-focus-within:text-orange-500
                    "
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="
                      w-full rounded-xl
                      border border-gray-200
                      bg-gray-50
                      py-3.5
                      pl-11 pr-12
                      text-sm text-gray-900
                      outline-none transition
                      placeholder:text-gray-400
                      focus:border-orange-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-orange-100
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  {/* Show / Hide Password */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="
                      absolute right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-lg p-2
                      text-gray-400
                      transition
                      hover:text-orange-500
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* =================================================
                  REMEMBER ME
              ================================================== */}

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="
                    h-4 w-4 rounded
                    border-gray-300
                    text-orange-500
                    accent-orange-500
                    focus:ring-orange-500
                  "
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-gray-500"
                >
                  Remember me
                </label>
              </div>

              {/* =================================================
                  LOGIN BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group flex w-full
                  items-center
                  justify-center gap-3
                  rounded-xl
                  bg-orange-500
                  px-5 py-3.5
                  text-sm font-bold
                  text-white
                  shadow-lg
                  shadow-orange-500/20
                  transition-all
                  duration-200
                  hover:bg-orange-600
                  hover:shadow-orange-500/30
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <span
                      className="
                        h-4 w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Logging in...
                  </>
                ) : (
                  <>
                    Sign In

                    <FaArrowRight
                      className="
                        text-xs
                        transition-transform
                        duration-200
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </button>
            </form>

            {/* =================================================
                REGISTER
            ================================================== */}

            <div className="mt-7 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/register")
                  }
                  className="
                    font-bold
                    text-orange-500
                    transition
                    hover:text-orange-600
                  "
                >
                  Create Account
                </button>
              </p>
            </div>

            {/* =================================================
                DEMO ACCOUNTS
            ================================================== */}

            <div
              className="
                mt-8 rounded-2xl
                border border-orange-100
                bg-orange-50/60 p-5
              "
            >
              <div
                className="
                  mb-4 flex
                  items-center
                  justify-between
                "
              >
                <h3
                  className="
                    text-sm font-bold
                    text-gray-800
                  "
                >
                  Demo Accounts
                </h3>

                <span
                  className="
                    rounded-full
                    bg-orange-100
                    px-3 py-1
                    text-[10px]
                    font-bold uppercase
                    tracking-wide
                    text-orange-600
                  "
                >
                  Demo
                </span>
              </div>

              <div className="space-y-3">

                {/* ADMIN */}

                <div
                  className="
                    rounded-xl
                    bg-white p-3
                    shadow-sm
                  "
                >
                  <p
                    className="
                      mb-1 text-xs
                      font-bold
                      text-gray-800
                    "
                  >
                    Admin
                  </p>

                  <p className="text-xs text-gray-500">
                    admin@printtech.com
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Password:{" "}

                    <span
                      className="
                        font-semibold
                        text-gray-700
                      "
                    >
                      admin123
                    </span>
                  </p>
                </div>

                {/* STAFF */}

                <div
                  className="
                    rounded-xl
                    bg-white p-3
                    shadow-sm
                  "
                >
                  <p
                    className="
                      mb-1 text-xs
                      font-bold
                      text-gray-800
                    "
                  >
                    Staff
                  </p>

                  <p className="text-xs text-gray-500">
                    staff@printtech.com
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Password:{" "}

                    <span
                      className="
                        font-semibold
                        text-gray-700
                      "
                    >
                      staff123
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                SECURITY
            ================================================== */}

            <div
              className="
                mt-6 flex
                items-center
                justify-center gap-2
                text-xs text-gray-400
              "
            >
              <FaLock className="text-[10px]" />

              <span>
                Your login information is secure
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

