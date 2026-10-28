import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiBriefcase,
  FiMapPin,
  FiPhone,
  FiHash,
  FiArrowRight,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import toast from "react-hot-toast";
import { createTenant } from "../../api/admin";

const SetupPage = () => {
  const navigate = useNavigate();

  const [logoPreview, setLogoPreview] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm();

  // =========================================================
  // PREVENT LOGGED-IN USERS FROM ACCESSING SETUP PAGE
  // =========================================================
  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const user = JSON.parse(storedUser);

          if (user) {
            const role = String(
              user.role || user.user_type || user.user_role || "",
            ).toLowerCase();

            if (role === "staff") {
              navigate("/staff", { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }

            return;
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      }

      setCheckingAuth(false);
    };

    checkAuthentication();
  }, [navigate]);

  // =========================================================
  // SUBMIT BUSINESS SETUP
  // =========================================================
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("shop_name", data.shop_name.trim());
      formData.append("contact_phone", data.contact_phone || "");
      formData.append("pan_no", data.pan_no || "");
      formData.append("address", data.address || "");

      // Send the actual image file to the backend.
      if (data.logo?.[0]) {
        formData.append("logo", data.logo[0]);
      }

      const response = await createTenant(formData);

      console.log("Tenant created:", response);

      toast.success(
        "Business setup completed! Please log in with your account.",
      );

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("TENANT CREATE FAILED:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });

      const errorData = error?.response?.data;
      const errorMessage = JSON.stringify(errorData || {}).toLowerCase();

      // Duplicate PAN
      if (
        errorMessage.includes("pan_no") &&
        (errorMessage.includes("unique") ||
          errorMessage.includes("already exists") ||
          errorMessage.includes("duplicate"))
      ) {
        toast.error(
          "This PAN number is already registered. Please enter a unique PAN number.",
        );
        return;
      }

      // Password rules
      if (errorMessage.includes("password")) {
        toast.error(
          "The password cannot contain only numbers. Please use a combination of text and numbers.",
        );
        return;
      }

      // Duplicate shop name / email
      if (
        errorMessage.includes("shop_name") ||
        errorMessage.includes("email")
      ) {
        const field = errorMessage.includes("shop_name")
          ? "shop name"
          : "email";

        if (
          errorMessage.includes("unique") ||
          errorMessage.includes("already exists") ||
          errorMessage.includes("duplicate")
        ) {
          toast.error(`This ${field} is already registered.`);
          return;
        }
      }

      // Generic error
      toast.error(
        errorData?.message ||
          errorData?.detail ||
          "Failed to complete business setup. Please try again.",
      );
    }
  };

  // =========================================================
  // LOGO IMAGE VALIDATION AND PREVIEW
  // =========================================================
  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate image type
    const allowedTypes = ["image/png", "image/jpeg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a PNG, JPG or JPEG image.");
      event.target.value = "";
      resetField("logo");
      setLogoPreview(null);
      return;
    }

    // Maximum file size: 2 MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo size must be less than 2MB.");
      event.target.value = "";
      resetField("logo");
      setLogoPreview(null);
      return;
    }

    setLogoPreview((previousPreview) => {
      if (previousPreview) {
        URL.revokeObjectURL(previousPreview);
      }

      return URL.createObjectURL(file);
    });
  };

  // =========================================================
  // REMOVE SELECTED LOGO
  // =========================================================
  const removeLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoPreview(null);
    resetField("logo");
  };

  // Release the preview URL when the component unmounts.
  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  // Avoid briefly showing the setup form while checking login.
  if (checkingAuth) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Brand */}
        <div className="mb-7 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-orange-600/20">
              <img src={Logo} className="h-10 w-10" alt="PrintTech" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Print<span className="text-orange-600">Tech</span>
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Smart billing for your business
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
              <img src={Logo} className="h-10 w-10" alt="PrintTech" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Set up your business
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Tell us a little about your business to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Shop Logo */}
            <div className="mb-7">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Shop logo
              </label>

              {!logoPreview ? (
                <label
                  htmlFor="logo"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-7 transition hover:border-orange-400 hover:bg-orange-50/50"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-orange-100">
                    <FiUpload size={20} className="text-orange-600" />
                  </div>

                  <p className="text-sm font-medium text-slate-700">
                    Upload your shop logo
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    PNG, JPG or JPEG • Max 2MB
                  </p>

                  <input
                    id="logo"
                    type="file"
                    accept="image/png,image/jpeg,.jpg,.jpeg"
                    className="hidden"
                    {...register("logo", {
                      onChange: handleLogoChange,
                    })}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <img
                        src={logoPreview}
                        alt="Shop logo preview"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Logo selected
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Your logo will appear on invoices and receipts.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeLogo}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove logo"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Shop Name */}
            <div className="mb-5">
              <label
                htmlFor="shopName"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Shop name
              </label>

              <div className="relative">
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="shopName"
                  type="text"
                  placeholder="Enter your shop name"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  {...register("shop_name", {
                    required: "Shop name is required",
                    validate: (value) =>
                      value.trim().length > 0 || "Shop name is required",
                  })}
                />
              </div>

              {errors.shop_name && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.shop_name.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Phone number
              </label>

              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98XXXXXXXX"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  {...register("contact_phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be exactly 10 digits",
                    },
                    onChange: (event) => {
                      event.target.value = event.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10);
                    },
                  })}
                />

                {errors.contact_phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.contact_phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* PAN / VAT */}
            <div className="mb-5">
              <label
                htmlFor="panVatNumber"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                PAN / VAT number
              </label>

              <div className="relative">
                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="panVatNumber"
                  type="text"
                  inputMode="numeric"
                  maxLength={20}
                  placeholder="Enter PAN number"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  {...register("pan_no", {
                    required: "PAN number is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Please enter numbers only",
                    },
                    minLength: {
                      value: 3,
                      message: "PAN number must be at least 3 digits",
                    },
                  })}
                />
              </div>

              {errors.pan_no && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.pan_no.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="mb-5">
              <label
                htmlFor="address"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Shop address
              </label>

              <div className="relative">
                <FiMapPin className="absolute left-4 top-3.5 text-slate-400" />

                <textarea
                  id="address"
                  rows="3"
                  placeholder="Enter your shop address"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  {...register("address")}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-600/20 transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Setting up..." : "Complete setup"}

              {!isSubmitting && <FiArrowRight size={17} />}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-slate-400">
          Your business information can be updated later from settings.
        </p>
      </div>
    </div>
  );
};

export default SetupPage;
