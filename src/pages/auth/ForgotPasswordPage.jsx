import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiMail,
  FiPhone,
  FiArrowRight,
  FiArrowLeft,
  FiPrinter,
} from "react-icons/fi";
import Logo from "../../assets/Logo.png";

const ForgotPasswordPage = () => {
  const [method, setMethod] = useState("email");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Forgot password data:", {
      method,
      value: data.value,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-7 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm shadow-orange-600/20">
              <img src={Logo} className="h-10 w-10" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Print<span className="text-orange-600">Tech</span>
            </h1>
          </div>

          <p className="text-sm text-slate-500">
            Smart billing for your business
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
          {/* Header */}
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
              <FiMail size={21} className="text-orange-600" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Forgot your password?
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Choose how you'd like to receive your verification code.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Method Selection */}
            <div className="mb-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  method === "email"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <FiMail size={17} />
                Email
              </button>

              <button
                type="button"
                onClick={() => setMethod("phone")}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  method === "phone"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <FiPhone size={17} />
                Phone
              </button>
            </div>

            {/* Description */}
            <div className="mb-5 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs leading-5 text-slate-500">
                {method === "email"
                  ? "We'll send a verification code to your registered email address."
                  : "We'll send a verification code to your registered phone number."}
              </p>
            </div>

            {/* Email */}
            {method === "email" && (
              <div className="mb-6">
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
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
            )}

            {/* Phone */}
            {method === "phone" && (
              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Phone number
                </label>

                <div className="relative">
                  <FiPhone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="phone"
                    type="tel"
                    placeholder="98XXXXXXXX"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^(97|98)\d{8}$/,
                        message: "Enter a valid Nepal phone number",
                      },
                    })}
                  />
                </div>

                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending OTP..." : "Send OTP"}

              {!isSubmitting && (
                <FiArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-[11px] font-medium text-slate-400">OR</span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Back */}
          <div className="text-center">
            <a
              href="/login"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-600"
            >
              <FiArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
              Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
