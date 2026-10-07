import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaArrowRight, FaLock, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { Login } from "../../api/auth";
import Logo from "../../assets/Logo.png";
import LoginImage from "../../assets/LoginImage.jpg";

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  // =========================
  // LOGIN HANDLER
  // =========================
  const onSubmit = async (data) => {
    try {
      const response = await Login({
        identifier: data.identifier.trim(),
        password: data.password,
      });

      console.log("Login successful:", response);

      // Save tokens
      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);

      // Save user
      localStorage.setItem("user", JSON.stringify(response.user));

      // Check role
      if (response.user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else if (response.user.role === "staff") {
        navigate("/staff", { replace: true });
      } else {
        setError("root", {
          message: "Invalid user role assigned.",
        });
      }
    } catch (err) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", JSON.stringify(err.response?.data, null, 2));

      setError("root", {
        message:
          err.response?.data?.message ||
          err.response?.data?.detail ||
          "Invalid email or password. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4 font-sans sm:p-6 lg:p-8">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
        {/* LEFT SIDE */}
        <div className="relative hidden items-center justify-center overflow-hidden border-r border-gray-200 bg-orange-50/50 lg:flex lg:w-1/2">
          <img
            src={LoginImage}
            alt="PrintTech Workspace"
            className="h-full w-full object-cover object-right"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-orange-50/40 to-transparent" />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full flex-col justify-between border-l border-gray-200 bg-white p-6 sm:p-10 lg:w-1/2 xl:p-12">
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
                  Print<span className="text-orange-500">tech</span>
                </h1>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-orange-500">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Sign in to Print
                <span className="text-orange-400">Tech</span>
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Enter your email and password to access your dashboard.
              </p>
            </div>

            {/* Backend Error */}
            {errors.root && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-600">
                {errors.root.message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
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
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...register("identifier", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email",
                      },
                    })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 disabled:opacity-60"
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
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
                    className="text-xs font-semibold text-orange-500 transition-colors hover:text-orange-600"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="group relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-orange-500" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-colors hover:text-orange-500"
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

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <div className="mt-8 space-y-4 text-center">
              <p className="text-xs text-gray-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-bold text-orange-500 transition-colors hover:text-orange-600"
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
