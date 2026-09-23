import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      company: "",
      customerType: "individual",
      address: "",
      notes: "",
    },
  });

  // =========================================================
  // EDIT MODE
  // =========================================================
  useEffect(() => {
    if (!isEditMode) return;

    // Temporary customer data
    // Replace this later with API data from useCustomer(id)
    const customers = [
      {
        id: "CUS-1001",
        fullName: "Ram Sharma",
        phone: "9841234567",
        email: "ram@example.com",
        company: "Ram Enterprises",
        customerType: "business",
        address: "Butwal, Rupandehi",
        notes: "Regular printing customer.",
      },
      {
        id: "CUS-1002",
        fullName: "Sita Karki",
        phone: "9851234567",
        email: "sita@example.com",
        company: "Sita Collection",
        customerType: "business",
        address: "Bhairahawa, Rupandehi",
        notes: "",
      },
    ];

    const customer = customers.find((item) => item.id === id);

    if (customer) {
      reset({
        fullName: customer.fullName || "",
        phone: customer.phone || "",
        email: customer.email || "",
        company: customer.company || "",
        customerType: customer.customerType || "individual",
        address: customer.address || "",
        notes: customer.notes || "",
      });
    }
  }, [id, isEditMode, reset]);

  // =========================================================
  // SUBMIT
  // =========================================================
  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        console.log("Updating Customer:", id, data);

        // API call here
        await new Promise((resolve) => setTimeout(resolve, 1000));

        alert("Customer updated successfully");
      } else {
        console.log("Creating Customer:", data);

        // API call here
        await new Promise((resolve) => setTimeout(resolve, 1000));

        alert("Customer created successfully");
      }

      navigate("/customers");
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================================
  // CANCEL
  // =========================================================
  const handleCancel = () => {
    navigate("/customers");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-800 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-300 sm:text-3xl">
              {isEditMode ? "Edit Customer" : "Add Customer"}
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isEditMode
                ? "Update customer information"
                : "Add a new customer to your system"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            <FaArrowLeft size={14} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        {/* =====================================================
            FORM CARD
        ====================================================== */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {/* ===================================================
              CARD HEADER
          ==================================================== */}
          <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <FaUser />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-300">
                  Customer Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  {isEditMode
                    ? `Editing ${id}`
                    : "Enter customer details below"}
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              FORM
          ==================================================== */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-8 px-4 py-7 sm:px-8">
              {/* =================================================
                  PERSONAL INFORMATION
              ================================================== */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* FULL NAME */}
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
                        className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-700 dark:text-slate-300 ${
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

                  {/* PHONE */}
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
                        className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-700 dark:text-slate-300 ${
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

                  {/* EMAIL */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>

                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

                      <input
                        type="email"
                        placeholder="customer@example.com"
                        className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-700 dark:text-slate-300 ${
                          errors.email
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 focus:border-orange-500 focus:ring-orange-100"
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

              {/* =================================================
                  BUSINESS INFORMATION
              ================================================== */}
              <div className="border-t border-slate-100 pt-7 dark:border-slate-700">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Business Information
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* COMPANY */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Company / Business
                    </label>

                    <div className="relative">
                      <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

                      <input
                        type="text"
                        placeholder="Company name"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        {...register("company")}
                      />
                    </div>
                  </div>

                  {/* CUSTOMER TYPE */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Customer Type
                    </label>

                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      {...register("customerType")}
                    >
                      <option value="individual">Individual</option>

                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* =================================================
                  ADDRESS
              ================================================== */}
              <div className="border-t border-slate-100 pt-7 dark:border-slate-700">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Address
                </h3>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-4 text-sm text-slate-400" />

                  <textarea
                    rows="3"
                    placeholder="Enter customer's address"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    {...register("address")}
                  />
                </div>
              </div>

              {/* =================================================
                  NOTES
              ================================================== */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Notes
                </label>

                <textarea
                  rows="3"
                  placeholder="Add any additional notes about this customer..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  {...register("notes")}
                />
              </div>
            </div>

            {/* ===================================================
                FOOTER
            ==================================================== */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-5 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSave />

                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                    ? "Update Customer"
                    : "Save Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
