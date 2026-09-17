import React from "react";
import { useForm } from "react-hook-form";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";

const AddCustomer = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Customer Data:", data);

    // API call here
    await new Promise((resolve) => setTimeout(resolve, 1000));

    reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-300 sm:text-3xl">
              Add Customer
            </h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 shadow-sm">
          {/* Card Header */}
          <div className="border-b border-slate-100 bg-slate-50/70 dark:bg-slate-800 px-3 py-2  sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <FaUser />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-300">
                  Customer Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add a new customer to your billing system.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-8 px-4 py-7 sm:px-8">
              {/* Personal Information */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Full Name
                      <span className="ml-1 text-orange-500">*</span>
                    </label>

                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

                      <input
                        type="text"
                        placeholder="Enter customer's full name"
                        className={`w-full rounded-xl border bg-white dark:bg-slate-700 dark:text-slate-300 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.fullName
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 focus:border-orange-500 focus:ring-orange-100"
                        }`}
                        {...register("fullName", {
                          required: "Full name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                        })}
                      />
                    </div>

                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Phone Number
                      <span className="ml-1 text-orange-500">*</span>
                    </label>

                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

                      <input
                        type="tel"
                        placeholder="98XXXXXXXX"
                        className={`w-full rounded-xl border bg-white dark:bg-slate-700 dark:text-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.phone
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 focus:border-orange-500 focus:ring-orange-100"
                        }`}
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Enter a valid 10-digit phone number",
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

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>

                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

                      <input
                        type="email"
                        placeholder="customer@example.com"
                        className={`w-full rounded-xl border bg-white dark:bg-slate-700 dark:text-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 ${
                          errors.email ? "border-red-400" : "border-slate-200"
                        }`}
                        {...register("email", {
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
                </div>
              </div>

              {/* Business Information */}
              <div className="border-t border-slate-100 pt-7">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Business Information
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Company */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Company / Business
                    </label>

                    <div className="relative">
                      <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

                      <input
                        type="text"
                        placeholder="Company name"
                        className="w-full rounded-xl border border-slate-200 bg-white dark:bg-slate-700 dark:text-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        {...register("company")}
                      />
                    </div>
                  </div>

                  {/* Customer Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Customer Type
                    </label>

                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white dark:bg-slate-700 dark:text-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      {...register("customerType")}
                    >
                      <option value="individual">Individual</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="border-t border-slate-100 pt-7">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Address
                </h3>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-4 text-sm text-slate-400" />

                  <textarea
                    rows="3"
                    placeholder="Enter customer's address"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white dark:text-slate-300 dark:bg-slate-800  py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    {...register("address")}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Notes
                </label>

                <textarea
                  rows="3"
                  placeholder="Add any additional notes about this customer..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white dark:bg-slate-700 dark:text-slate-300  px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  {...register("notes")}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 dark:bg-slate-800 bg-slate-50/50 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={() => reset()}
                className="rounded-xl border border-slate-200 bg-white dark:bg-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSave />

                {isSubmitting ? "Saving..." : "Save Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
