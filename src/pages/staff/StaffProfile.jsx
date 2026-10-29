import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiMoon,
  FiSun,
  FiSave,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../redux/slices/themeSlice";
import { updateProfile } from "../../api/admin";
import { changePasswordByTenant } from "../../api/admin";
import { updateCurrentUser } from "../../utils/auth"; // top of file
import { updateUser } from "../../redux/slices/authSlice"; // adjust path if different

const StaffProfile = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const currentUser = useSelector((state) => state.auth.user);
  console.log("REDUX USER ON MOUNT:", currentUser); // ← add this

  // ========================================
  // STATE
  // ========================================

  const [activeSection, setActiveSection] = useState("profile");

  // Profile state — populated from Redux on mount, synced on change
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [changingPassword, setChangingPassword] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  // ========================================
  // TOAST
  // ========================================

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (type, message) => setToast({ type, message });

  // ========================================
  // LOAD PROFILE FROM REDUX
  // ========================================

  useEffect(() => {
    if (!currentUser) return;

    setProfile({
      name: currentUser.full_name || currentUser.username || "",
      email: currentUser.email ?? "",
    });
  }, [currentUser]);

  // ========================================
  // PROFILE CHANGE
  // ========================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ========================================
  // PASSWORD CHANGE
  // ========================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // ========================================
  // SAVE PROFILE
  // ========================================

  const saveProfile = async () => {
    if (!currentUser?.id) {
      showToast("error", "Your session has expired. Please log in again.");
      return;
    }
    if (!profile.name.trim()) {
      showToast("error", "Full name cannot be empty.");
      return;
    }
    if (!profile.email.trim()) {
      showToast("error", "Email cannot be empty.");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await updateProfile({
        full_name: profile.name,
        email: profile.email,
      });

      if (res?.user) {
        dispatch(updateUser(res.user));
        updateCurrentUser(res.user); // sync localStorage
      } else {
        dispatch(updateUser({ full_name: profile.name, email: profile.email }));
        updateCurrentUser({ full_name: profile.name, email: profile.email });
      }

      showToast("success", "Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      showToast(
        "error",
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          JSON.stringify(error?.response?.data?.errors) ||
          error.message ||
          "Failed to update profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ========================================
  // UPDATE PASSWORD
  // ========================================

  const updatePassword = async () => {
    if (
      !passwords.current ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      showToast("error", "Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("error", "New password and confirm password do not match.");
      return;
    }

    if (passwords.current === passwords.newPassword) {
      showToast("error", "New password must be different from current.");
      return;
    }

    setChangingPassword(true);

    try {
      await changePasswordByTenant({
        old_password: passwords.current,
        new_password: passwords.newPassword,
        confirm_password: passwords.confirmPassword,
      });

      showToast("success", "Password changed successfully.");

      setPasswords({ current: "", newPassword: "", confirmPassword: "" });
      setShowPasswords({
        current: false,
        newPassword: false,
        confirmPassword: false,
      });
    } catch (error) {
      console.error("Change password error:", error);
      const data = error?.response?.data;
      let msg = "Failed to change password. Please try again.";
      if (data) {
        if (typeof data === "string") msg = data;
        else if (data.detail) msg = data.detail;
        else if (data.message) msg = data.message;
        else {
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            const val = data[firstKey];
            msg = Array.isArray(val) ? val[0] : String(val);
          }
        }
      }
      showToast("error", msg);
    } finally {
      setChangingPassword(false);
    }
  };

  // ========================================
  // PASSWORD VISIBILITY
  // ========================================

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // ========================================
  // SIDEBAR SECTIONS
  // ========================================

  const sections = [
    {
      id: "profile",
      label: "My Profile",
      description: "Your account",
      icon: FiUser,
    },
    {
      id: "appearance",
      label: "Appearance",
      description: "Theme preferences",
      icon: theme === "dark" ? FiMoon : FiSun,
    },
  ];

  // Avatar letter from the profile name
  const avatarLetter = profile.name?.trim()?.charAt(0).toUpperCase() || "S";

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 transition-colors dark:bg-slate-950 md:px-6">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 z-[200]">
          <div
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${
              toast.type === "error"
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                : "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300"
            }`}
          >
            {toast.type === "error" ? (
              <FiAlertCircle size={18} />
            ) : (
              <FiCheck size={18} />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 opacity-60 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your account and preferences.
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
          {/* SIDEBAR */}
          <aside className="h-fit border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Settings
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Account preferences
              </p>
            </div>

            <div className="p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`mb-1 flex w-full items-center gap-3 px-3 py-3 text-left transition ${
                      active
                        ? "bg-orange-500 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={18} />
                    <div>
                      <p className="text-sm font-semibold">{section.label}</p>
                      <p
                        className={`text-xs ${
                          active
                            ? "text-orange-100"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {section.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ACCOUNT TYPE — real name from profile */}
            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                  {avatarLetter}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {profile.name || "—"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {currentUser?.role
                      ? currentUser.role.charAt(0).toUpperCase() +
                        currentUser.role.slice(1) +
                        " Account"
                      : "Staff Account"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <main className="min-w-0">
            {/* PROFILE */}
            {activeSection === "profile" && (
              <section className="space-y-6">
                {/* PERSONAL INFO */}
                <div className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                        <FiUser size={20} />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900 dark:text-white">
                          My Profile
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Manage your personal account information.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Input
                        label="Full Name"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={saveProfile}
                        disabled={savingProfile}
                        className="flex items-center gap-2 bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FiSave size={16} />
                        {savingProfile ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* CHANGE PASSWORD */}
                <div className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <FiLock size={19} />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900 dark:text-white">
                          Change Password
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Update your account password.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 p-6">
                    <PasswordInput
                      label="Current Password"
                      name="current"
                      value={passwords.current}
                      show={showPasswords.current}
                      onChange={handlePasswordChange}
                      onToggle={() => togglePassword("current")}
                    />
                    <PasswordInput
                      label="New Password"
                      name="newPassword"
                      value={passwords.newPassword}
                      show={showPasswords.newPassword}
                      onChange={handlePasswordChange}
                      onToggle={() => togglePassword("newPassword")}
                    />
                    <PasswordInput
                      label="Confirm New Password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      show={showPasswords.confirmPassword}
                      onChange={handlePasswordChange}
                      onToggle={() => togglePassword("confirmPassword")}
                    />

                    <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={updatePassword}
                        disabled={changingPassword}
                        className="flex items-center gap-2 bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FiLock size={16} />
                        {changingPassword ? "Changing..." : "Update Password"}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* APPEARANCE */}
            {activeSection === "appearance" && (
              <section className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                      {theme === "dark" ? (
                        <FiMoon size={20} />
                      ) : (
                        <FiSun size={20} />
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 dark:text-white">
                        Appearance
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Choose how the app looks on your device.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ThemeOption
                      active={theme === "light"}
                      icon={FiSun}
                      title="Light"
                      description="Use the standard light interface."
                      onClick={() => dispatch(setTheme("light"))}
                    />
                    <ThemeOption
                      active={theme === "dark"}
                      icon={FiMoon}
                      title="Dark"
                      description="Use a darker interface for low-light environments."
                      onClick={() => dispatch(setTheme("dark"))}
                    />
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

/* ── INPUT ─────────────────────────────────── */
const Input = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="h-11 w-full border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
    />
  </div>
);

/* ── PASSWORD INPUT ────────────────────────── */
const PasswordInput = ({ label, name, value, show, onChange, onToggle }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full border border-slate-300 bg-white px-3 pr-11 text-sm text-slate-700 outline-none transition focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FiEyeOff size={17} /> : <FiEye size={17} />}
      </button>
    </div>
  </div>
);

/* ── THEME OPTION ──────────────────────────── */
const ThemeOption = ({ active, icon: Icon, title, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`border p-5 text-left transition ${
      active
        ? "border-orange-500 bg-orange-50 dark:border-orange-500 dark:bg-orange-950/20"
        : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
    }`}
  >
    <div className="flex items-start justify-between">
      <div
        className={`flex h-10 w-10 items-center justify-center ${
          active
            ? "bg-orange-500 text-white"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        }`}
      >
        <Icon size={19} />
      </div>
      {active && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">
          <FiCheck size={13} />
        </div>
      )}
    </div>
    <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
      {title}
    </h3>
    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
      {description}
    </p>
  </button>
);

export default StaffProfile;
