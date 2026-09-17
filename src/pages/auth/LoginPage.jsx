import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const demoUser = {
    email: "admin@example.com",
    password: "123456",
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.email === demoUser.email && data.password === demoUser.password) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      {/* Login Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
            <FiLock className="text-orange-600" size={21} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <div className="relative">
              <FiMail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email address",
                  },
                })}
              />
            </div>

            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <a
                href="/forgot-password"
                className="text-xs font-medium text-orange-600 transition hover:text-orange-700"
              >
                Forgot password?
              </a>
            </div>

            <div className="relative">
              <FiLock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                {...register("password", {
                  required: "Password is required",
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me */}
          <div className="mb-6 flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />

            <label htmlFor="remember" className="text-sm text-slate-500">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-orange-600/20 transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}

            {!isSubmitting && (
              <FiArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            )}
          </button>

          {/* Divider */}
          <div className="mt-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-[11px] font-medium text-slate-400">OR</span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Register */}
          <p className="mt-5 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Create an account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
