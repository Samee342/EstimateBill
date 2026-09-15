import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle } from "react-icons/fa";
import svgImage from "../../assets/svgImage.jpg";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    console.log("Form Submitted:", data);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft background decorative shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] bg-[#F8EFE3] rounded-full filter blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#F8EFE3] rounded-full filter blur-3xl opacity-70 pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 border border-slate-100">
        {/* Left Column: Illustration Area */}
        <div className="bg-[#FAF4ED] p-8 sm:p-12 flex flex-col justify-between items-center relative min-h-[350px] md:min-h-[520px]">
          {/* Top Brand Logo */}
          <div className="w-full flex justify-start">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-800">
                Print<span className="text-[#FF7A00]">Tech</span>
              </span>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex flex-1 items-center justify-center w-full py-8">
            <img
              src={svgImage}
              alt="Register illustration"
              className="w-full max-w-[340px] h-auto object-contain"
            />
          </div>

          {/* Bottom spacing */}
          <div className="w-full" />
        </div>

        {/* Right Column: Registration Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Register
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Create an account to access all the features.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username & Phone */}
            <div className="grid grid-cols-2 gap-3">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username
                </label>

                <input
                  type="text"
                  placeholder="Username"
                  className="w-full rounded-lg border bg-white border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00]"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />

                {errors.username && (
                  <p className="text-[10px] text-red-500 mt-0.5">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone
                </label>

                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00]"
                  {...register("phone", {
                    required: "Phone is required",
                  })}
                />

                {errors.phone && (
                  <p className="text-[10px] text-red-500 mt-0.5">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>

              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00]"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email",
                  },
                })}
              />

              {errors.email && (
                <p className="text-[10px] text-red-500 mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-8 text-xs text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00]"
                    {...register("password", {
                      required: "Required",
                      minLength: {
                        value: 6,
                        message: "Min 6 chars",
                      },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={12} />
                    ) : (
                      <FaEye size={12} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-[10px] text-red-500 mt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-8 text-xs text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00]"
                    {...register("confirmPassword", {
                      required: "Required",
                      validate: (value) =>
                        value === password || "Passwords mismatch",
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash size={12} />
                    ) : (
                      <FaEye size={12} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-500 mt-0.5">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 rounded-lg bg-[#FF7A00] hover:bg-[#E66E00] py-2.5 text-xs font-bold tracking-wider text-white shadow-md shadow-orange-500/20 uppercase transition-all disabled:opacity-50"
            >
              {isSubmitting ? "REGISTERING..." : "REGISTER"}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>

            <span className="relative bg-white px-3 text-[10px] uppercase font-medium text-slate-400">
              OR
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center items-center gap-3">
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-slate-50 transition shadow-sm">
              <FaFacebookF size={12} />
            </button>

            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-red-500 hover:bg-slate-50 transition shadow-sm">
              <FaGoogle size={12} />
            </button>
          </div>

          {/* Bottom Login Link */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an Account?{" "}
            <a
              href="/login"
              className="font-bold text-[#FF7A00] hover:underline uppercase"
            >
              LOGIN
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
