import React, { useState } from "react";
import {
  FaArrowLeft,
  FaUserPlus,
  FaWhatsapp,
  FaLink,
  FaCopy,
  FaCheckCircle,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaPaperPlane,
  FaEye,
  FaEyeSlash,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createTeam, inviteTeam } from "../../../api/team";

const AddTeamMember = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("invite");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Data returned from the backend after invitation is created
  const [inviteLink, setInviteLink] = useState(""); // registration_url
  const [whatsappUrl, setWhatsappUrl] = useState(""); // whatsapp_url
  const [expiresAt, setExpiresAt] = useState(""); // expires_at

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // =========================================================
  // OPEN WHATSAPP USING AN ANCHOR (avoids popup blocker)
  // =========================================================

  const openWhatsApp = (url) => {
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================
  // SEND INVITE (one call → backend returns whatsapp_url)
  // =========================================================

  const handleWhatsAppInvite = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter the staff member's full name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    setInviting(true);

    try {
      const response = await inviteTeam({
        full_name: formData.name.trim(),
        phone_no: formData.phone.trim(),
        email: formData.email.trim() || "",
      });

      console.log("inviteTeam response:", response);

      const payload = response?.data ?? response;
      const registrationUrl = payload?.registration_url || "";
      const waUrl = payload?.whatsapp_url || "";
      const expires = payload?.expires_at || "";

      if (!waUrl) {
        toast.error(
          "Invitation created, but no WhatsApp link was returned by the server.",
        );
        return;
      }

      // Store for UI
      if (registrationUrl) setInviteLink(registrationUrl);
      if (waUrl) setWhatsappUrl(waUrl);
      if (expires) setExpiresAt(expires);

      // Open WhatsApp with the pre-filled message
      openWhatsApp(waUrl);

      toast.success(
        "Invitation created. WhatsApp opened — tap Send in WhatsApp to deliver it.",
        { duration: 5000 },
      );
    } catch (error) {
      console.error("Invite error:", error);
      toast.error(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.response?.data?.phone_no?.[0] ||
          "Failed to create invitation.",
      );
    } finally {
      setInviting(false);
    }
  };

  // =========================================================
  // COPY INVITE LINK
  // =========================================================

  const handleCopyLink = async () => {
    if (!inviteLink) {
      toast.error("Send the invitation first to generate the link.");
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Registration link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy invitation link.");
    }
  };

  // =========================================================
  // MANUAL ADD
  // =========================================================

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const baseUsername = formData.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

      const username = baseUsername || `staff_${Date.now()}`;

      await createTeam({
        username,
        full_name: formData.name.trim(),
        phone_no: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success("Staff member added successfully!");
      navigate("/team");
    } catch (error) {
      console.error("Create staff error:", error);
      toast.error(
        error?.response?.data?.username?.[0] ||
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to add staff member.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FORMAT EXPIRY
  // =========================================================

  const formatExpiry = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6 dark:bg-slate-950">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/team")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <FaArrowLeft size={15} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-slate-900 md:text-2xl dark:text-white">
              Add Team Member
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add staff manually or invite them to join PrintTech.
            </p>
          </div>
        </div>
      </div>

      {/* MODE SWITCH */}
      <div className="mb-6 grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode("invite")}
          className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
            mode === "invite"
              ? "border-orange-300 bg-orange-50 shadow-sm dark:border-orange-500/40 dark:bg-orange-500/10"
              : "border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/50 dark:border-slate-700 dark:bg-slate-900"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                mode === "invite"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800"
              }`}
            >
              <FaPaperPlane />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Invite Team Member
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Send an invitation through WhatsApp or share an invite link.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
            mode === "manual"
              ? "border-orange-300 bg-orange-50 shadow-sm dark:border-orange-500/40 dark:bg-orange-500/10"
              : "border-slate-200 bg-white hover:border-orange-200 dark:border-slate-700 dark:bg-slate-900"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                mode === "manual"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800"
              }`}
            >
              <FaUserPlus />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Add Manually
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Create the staff account directly from the admin panel.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-5 py-5 md:px-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              {mode === "invite" ? <FaPaperPlane /> : <FaUserPlus />}
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                {mode === "invite"
                  ? "Send Staff Invitation"
                  : "Create Team Member"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {mode === "invite"
                  ? "The staff member will complete their own account setup."
                  : "Create login credentials for the staff member."}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={
            mode === "manual" ? handleManualSubmit : (e) => e.preventDefault()
          }
          className="p-5 md:p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ram Thapa"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                WhatsApp / Phone
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    handleChange({ target: { name: "phone", value: val } });
                  }}
                  placeholder="98XXXXXXXX"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
                <span className="ml-1 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ram@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                />
              </div>
            </div>

            {/* PASSWORD (manual only) */}
            {mode === "manual" && (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Temporary Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create temporary password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-orange-500"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  The staff member can change this password after login.
                </p>
              </div>
            )}
          </div>

          {/* INVITE ACTIONS */}
          {mode === "invite" && (
            <div className="mt-6 space-y-4">
              {/* WHATSAPP */}
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                      <FaWhatsapp size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-400">
                        Invite through WhatsApp
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-green-700 dark:text-green-300">
                        Creates an invitation and opens WhatsApp with the
                        registration link pre-filled. You still tap{" "}
                        <strong>Send</strong> in WhatsApp to deliver it.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleWhatsAppInvite}
                    disabled={inviting}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FaWhatsapp />
                    {inviting ? "Inviting..." : "Send WhatsApp Invite"}
                  </button>
                </div>
              </div>

              {/* REGISTRATION LINK + WHATSAPP FALLBACK */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-3 flex items-center gap-2">
                  <FaLink className="text-orange-500" />
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                    Registration Link
                  </h3>
                  {expiresAt && (
                    <span className="ml-auto text-[10px] text-slate-400">
                      Expires: {formatExpiry(expiresAt)}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:flex-row">
                  <input
                    type="text"
                    value={
                      inviteLink ||
                      "Fill in name & phone, then click Send WhatsApp Invite"
                    }
                    readOnly
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    disabled={!inviteLink}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {copied ? (
                      <>
                        <FaCheckCircle className="text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <FaCopy />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>

                {/* If the WhatsApp popup was blocked, this link is a manual fallback */}
                {whatsappUrl && (
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      WhatsApp didn&apos;t open?
                    </span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-green-600 hover:text-green-700 dark:text-green-400"
                    >
                      Open WhatsApp manually
                      <FaExternalLinkAlt size={10} />
                    </a>
                  </div>
                )}
              </div>

              {/* INFORMATION */}
              <div className="flex gap-3 rounded-xl bg-orange-50 p-4 dark:bg-orange-500/10">
                <FaCheckCircle className="mt-0.5 shrink-0 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    How invitation works
                  </p>
                  <p className="mt-1 text-xs leading-5 text-orange-700 dark:text-orange-400">
                    1. Fill in name and phone number.
                    <br />
                    2. Click <strong>Send WhatsApp Invite</strong>. A
                    registration link is generated (valid 24 hours) and WhatsApp
                    opens with the message already typed.
                    <br />
                    3. Tap <strong>Send</strong> inside WhatsApp to deliver the
                    invitation.
                    <br />
                    4. Staff opens the link and completes their registration.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate("/team")}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            {mode === "manual" && (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <FaUserPlus />
                    Create Team Member
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamMember;
