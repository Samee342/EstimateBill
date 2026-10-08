import { useEffect, useState } from "react";
import {
  FiUser,
  FiBriefcase,
  FiBell,
  FiSave,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi";
import { updateTenant, changePasswordByTenant } from "../../api/admin";

const STORAGE_KEY = "printing_press_studio_settings";

const defaultSettings = {
  // PROFILE
  profileName: "Admin User",
  profileEmail: "admin@printtech.com",
  profilePhone: "9800000000",
  profileRole: "Administrator",

  // BUSINESS
  businessName: "PrintTech Printing Press",
  ownerName: "Ram Sharma",
  businessPhone: "9812345678",
  businessEmail: "info@printtech.com",
  address: "Butwal, Rupandehi, Nepal",
  panVat: "123456789",

  // PAYMENT
  defaultPaymentMethod: "Cash",
  partialPayment: true,
  dueReminder: true,
  reminderDays: 1,

  // NOTIFICATIONS
  newProject: true,
  paymentReceived: true,
  paymentDue: true,
  projectCompleted: true,
  lowStock: true,
};

const StudioSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        return {
          ...defaultSettings,
          ...JSON.parse(saved),
        };
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }

    return defaultSettings;
  });

  const [savedMessage, setSavedMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================================
  // PASSWORD STATES
  // =========================================

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // =========================================
  // AUTOMATIC LOCAL STORAGE SAVE
  // =========================================

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // =========================================
  // HANDLE INPUT / CHECKBOX / SELECT
  // =========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================
  // SAVE TENANT SETTINGS
  // =========================================

  const saveSettings = async () => {
    setSavedMessage("");
    setSaving(true);

    try {
      await updateTenant({
        profileName: settings.profileName,
        profileEmail: settings.profileEmail,
        profilePhone: settings.profilePhone,
        profileRole: settings.profileRole,

        businessName: settings.businessName,
        ownerName: settings.ownerName,
        businessPhone: settings.businessPhone,
        businessEmail: settings.businessEmail,
        address: settings.address,
        panVat: settings.panVat,

        defaultPaymentMethod: settings.defaultPaymentMethod,
        partialPayment: settings.partialPayment,
        dueReminder: settings.dueReminder,
        reminderDays: settings.reminderDays,

        newProject: settings.newProject,
        paymentReceived: settings.paymentReceived,
        paymentDue: settings.paymentDue,
        projectCompleted: settings.projectCompleted,
        lowStock: settings.lowStock,
      });

      // Keep local storage updated as well
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

      setSavedMessage("Settings saved successfully.");

      setTimeout(() => {
        setSavedMessage("");
      }, 2500);
    } catch (error) {
      console.error("Update tenant error:", error);

      setSavedMessage(
        error?.response?.data?.message ||
          "Failed to save settings. Please try again.",
      );

      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handleChangePassword = async () => {
    setPasswordMessage("");
    setPasswordError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password.",
      );
      return;
    }

    setChangingPassword(true);

    try {
      await changePasswordByTenant({
        oldPassword,
        newPassword,
      });

      setPasswordMessage("Password changed successfully.");

      // Clear password fields after successful change
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Hide passwords again
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setTimeout(() => {
        setPasswordMessage("");
      }, 2500);
    } catch (error) {
      console.error("Change password error:", error);

      setPasswordError(
        error?.response?.data?.message ||
          "Failed to change password. Please try again.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =========================================
  // COMMON INPUT CLASSES
  // =========================================

  const inputClass =
    "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-orange-400 dark:focus:border-orange-500 transition";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-slate-950 px-4 py-5 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        {/* =========================================
            PAGE HEADER
        ========================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Studio Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your profile, printing press and system preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedMessage && (
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {savedMessage}
              </span>
            )}

            <button
              type="button"
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave size={16} />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* =========================================
            MAIN GRID
        ========================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          {/* =========================================
              LEFT SETTINGS MENU
          ========================================== */}

          <div className="h-fit rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 transition-colors">
            <div className="space-y-1">
              {/* PROFILE */}

              <a
                href="#profile"
                className="flex items-center gap-3 rounded-lg bg-orange-50 dark:bg-orange-500/10 px-3 py-2.5 text-sm font-semibold text-orange-600 dark:text-orange-400"
              >
                <FiUser size={16} />
                Profile
              </a>

              {/* BUSINESS */}

              <a
                href="#business"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <FiBriefcase size={16} />
                Business
              </a>

              {/* CHANGE PASSWORD */}

              <a
                href="#password"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <FiLock size={16} />
                Change Password
              </a>

              {/* NOTIFICATIONS */}

              <a
                href="#notification"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <FiBell size={16} />
                Notifications
              </a>
            </div>
          </div>

          {/* =========================================
              RIGHT CONTENT
          ========================================== */}

          <div className="space-y-6">
            {/* =========================================
                PROFILE
            ========================================== */}

            <section
              id="profile"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
            >
              <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Profile
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Your personal account information.
                </p>
              </div>

              <div className="p-5">
                {/* PROFILE PHOTO */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/15 text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {settings.profileName
                      ? settings.profileName.charAt(0).toUpperCase()
                      : "A"}
                  </div>

                  <div>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <FiCamera size={15} />
                      Change Photo
                    </button>

                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      JPG or PNG. Recommended square image.
                    </p>
                  </div>
                </div>

                {/* PROFILE INPUTS */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full Name</label>

                    <input
                      type="text"
                      name="profileName"
                      value={settings.profileName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Role</label>

                    <input
                      type="text"
                      name="profileRole"
                      value={settings.profileRole}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Email</label>

                    <input
                      type="email"
                      name="profileEmail"
                      value={settings.profileEmail}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone Number</label>

                    <input
                      type="text"
                      name="profilePhone"
                      value={settings.profilePhone}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================
                BUSINESS
            ========================================== */}

            <section
              id="business"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
            >
              <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Business Information
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Information used on invoices, estimates and reports.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Business Name</label>

                  <input
                    type="text"
                    name="businessName"
                    value={settings.businessName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Owner Name</label>

                  <input
                    type="text"
                    name="ownerName"
                    value={settings.ownerName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Business Phone</label>

                  <input
                    type="text"
                    name="businessPhone"
                    value={settings.businessPhone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Business Email</label>

                  <input
                    type="email"
                    name="businessEmail"
                    value={settings.businessEmail}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Address</label>

                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    rows="3"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className={labelClass}>PAN / VAT Number</label>

                  <input
                    type="text"
                    name="panVat"
                    value={settings.panVat}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* =========================================
                CHANGE PASSWORD
            ========================================== */}

            <section
              id="password"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
            >
              <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Change Password
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Update your account password to keep your account secure.
                </p>
              </div>

              <div className="p-5">
                <div className="max-w-xl space-y-4">
                  {/* CURRENT PASSWORD */}

                  <div>
                    <label className={labelClass}>Current Password</label>

                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => {
                          setOldPassword(e.target.value);
                          setPasswordError("");
                        }}
                        placeholder="Enter current password"
                        className={`${inputClass} pr-11`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowOldPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showOldPassword ? (
                          <FiEyeOff size={17} />
                        ) : (
                          <FiEye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* NEW PASSWORD */}

                  <div>
                    <label className={labelClass}>New Password</label>

                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setPasswordError("");
                        }}
                        placeholder="Enter new password"
                        className={`${inputClass} pr-11`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showNewPassword ? (
                          <FiEyeOff size={17} />
                        ) : (
                          <FiEye size={17} />
                        )}
                      </button>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                      Password must be at least 6 characters.
                    </p>
                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>
                    <label className={labelClass}>Confirm New Password</label>

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError("");
                        }}
                        placeholder="Confirm new password"
                        className={`${inputClass} pr-11`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff size={17} />
                        ) : (
                          <FiEye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* PASSWORD ERROR */}

                  {passwordError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                      {passwordError}
                    </div>
                  )}

                  {/* PASSWORD SUCCESS */}

                  {passwordMessage && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-600 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400">
                      {passwordMessage}
                    </div>
                  )}

                  {/* CHANGE PASSWORD BUTTON */}

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiLock size={16} />

                    {changingPassword
                      ? "Changing Password..."
                      : "Change Password"}
                  </button>
                </div>
              </div>
            </section>

            {/* =========================================
                NOTIFICATIONS
            ========================================== */}

            <section
              id="notification"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
            >
              <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Notification Settings
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Choose which events should create notifications.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
                {[
                  ["newProject", "New Project"],
                  ["paymentReceived", "Payment Received"],
                  ["paymentDue", "Payment Due"],
                  ["projectCompleted", "Project Completed"],
                  ["lowStock", "Low Stock Alert"],
                ].map(([name, label]) => (
                  <label
                    key={name}
                    className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {label}
                    </span>

                    <input
                      type="checkbox"
                      name={name}
                      checked={settings[name]}
                      onChange={handleChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioSettings;
