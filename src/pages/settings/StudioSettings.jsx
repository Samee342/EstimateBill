import { useEffect, useState } from "react";
import {
  FiUser,
  FiBriefcase,
  FiSave,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";
import { getCurrentUser, updateCurrentUser } from "../../utils/auth";
import { updateTenant, changePasswordByTenant } from "../../api/admin";

const STORAGE_KEY = "printing_press_studio_settings";

// ── Toast component (local, no dependency) ─────────────
const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div className="fixed top-5 right-5 z-50 animate-[slideIn_0.2s_ease-out]">
      <div
        className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${
          isError
            ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
            : "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300"
        }`}
      >
        {isError ? <FiAlertCircle size={18} /> : <FiCheckCircle size={18} />}
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 opacity-60 hover:opacity-100"
          aria-label="Close"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
};

const StudioSettings = () => {
  const [settings, setSettings] = useState(() => {
    // 1) Prefer fresh tenant data from the cached user
    const user = getCurrentUser();
    if (user?.tenant) {
      return {
        profileName: user.username ?? "",
        profileEmail: user.email ?? "",
        profilePhone: user.phone_no ?? "",
        businessName: user.tenant.shop_name ?? "",
        ownerName: "",
        businessPhone: user.tenant.contact_phone ?? "",
        businessEmail: user.email ?? "",
        address: user.tenant.address ?? "",
        panVat: user.tenant.pan_no ?? "",
      };
    }
    // 2) Fallback to local draft cache
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
    return {};
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // =========================================
  // PASSWORD STATES
  // =========================================

  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // =========================================
  // HANDLE INPUT
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
    setSaving(true);

    try {
      const user = getCurrentUser();
      if (!user?.id) {
        throw new Error("Your login session has expired. Please log in again.");
      }

      const tenantId = user?.tenant?.id ?? user?.tenant_id;
      if (!tenantId) {
        throw new Error("No tenant linked to this account.");
      }

      const tenantData = {
        shop_name: settings.businessName,
        address: settings.address,
        contact_phone: settings.businessPhone,
      };

      const res = await updateTenant(tenantId, tenantData);

      // Sync new tenant values into cached user
      updateCurrentUser({
        tenant: res,
        company_name: res.shop_name,
      });

      // Persist local draft
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

      showToast("success", "Settings saved successfully.");
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      showToast(
        "error",
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error.message ||
          "Failed to save settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handleChangePassword = async () => {
    setPasswordError("");

    if (!old_password || !new_password || !confirm_password) {
      setPasswordError("Please fill all password fields.");
      return;
    }
    if (new_password.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (new_password !== confirm_password) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }
    if (old_password === new_password) {
      setPasswordError(
        "New password must be different from your current password.",
      );
      return;
    }

    setChangingPassword(true);

    try {
      await changePasswordByTenant({
        old_password,
        new_password,
        confirm_password,
      });
      showToast("success", "Password changed successfully.");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error("Change password error:", error);
      console.log("BACKEND SAYS:", error?.response?.data); // ← add this
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
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="mx-auto max-w-7xl">
        {/* PAGE HEADER (save button removed from here) */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Studio Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your profile, printing press and system preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          {/* LEFT MENU */}
          <div className="h-fit rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 transition-colors">
            <div className="space-y-1">
              <a
                href="#profile"
                className="flex items-center gap-3 rounded-lg bg-orange-50 dark:bg-orange-500/10 px-3 py-2.5 text-sm font-semibold text-orange-600 dark:text-orange-400"
              >
                <FiUser size={16} />
                Profile
              </a>
              <a
                href="#business"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <FiBriefcase size={16} />
                Business
              </a>
              <a
                href="#password"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <FiLock size={16} />
                Change Password
              </a>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="space-y-6">
            {/* PROFILE */}
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      name="profileName"
                      value={settings.profileName ?? ""}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      name="profileEmail"
                      value={settings.profileEmail ?? ""}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="text"
                      name="profilePhone"
                      value={settings.profilePhone ?? ""}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* BUSINESS */}
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
                    value={settings.businessName ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={settings.ownerName ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Business Phone</label>
                  <input
                    type="text"
                    name="businessPhone"
                    value={settings.businessPhone ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Address</label>
                  <textarea
                    name="address"
                    value={settings.address ?? ""}
                    onChange={handleChange}
                    rows="3"
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {/* ── SAVE BUTTON (below business fields, above password) ── */}
              <div className="flex justify-end border-t border-slate-200 dark:border-slate-700 px-5 py-4">
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
            </section>

            {/* CHANGE PASSWORD */}
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
                  <div>
                    <label className={labelClass}>Current Password</label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={old_password}
                        onChange={(e) => {
                          setOldPassword(e.target.value);
                          setPasswordError("");
                        }}
                        placeholder="Enter current password"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword((p) => !p)}
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

                  <div>
                    <label className={labelClass}>New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={new_password}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setPasswordError("");
                        }}
                        placeholder="Enter new password"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((p) => !p)}
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

                  <div>
                    <label className={labelClass}>Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirm_password}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError("");
                        }}
                        placeholder="Confirm new password"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
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

                  {passwordError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                      {passwordError}
                    </div>
                  )}

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioSettings;
